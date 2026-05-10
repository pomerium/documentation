package main

import (
	"crypto/tls"
	"crypto/x509"
	"encoding/base64"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"strings"
	"time"
)

func main() {
	port := "8443"
	if fromEnv := os.Getenv("PORT"); fromEnv != "" {
		port = fromEnv
	}
	tlsCert := os.Getenv("TLS_CERT")
	tlsKey := os.Getenv("TLS_KEY")
	clientCA := os.Getenv("CLIENT_CA")

	if tlsCert == "" {
		log.Fatal("TLS_CERT environment variable must be set")
	}
	if tlsKey == "" {
		log.Fatal("TLS_KEY environment variable must be set")
	}
	if clientCA == "" {
		log.Fatal("CLIENT_CA environment variable must be set")
	}
	mux := http.NewServeMux()
	mux.HandleFunc("/", hello)
	srv := &http.Server{
		Handler:           mux,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       60 * time.Second,
		ErrorLog:          log.New(os.Stderr, "", log.LstdFlags),
	}
	ln, err := newClientCertTLSListener(":"+port, tlsCert, tlsKey, clientCA)
	if err != nil {
		log.Fatalf("failed creating tls listener: %v", err)
	}
	log.Printf("listening on port %s", port)
	if err := srv.Serve(ln); err != nil && err != http.ErrServerClosed {
		log.Fatalf("serve: %v", err)
	}
}

func hello(w http.ResponseWriter, r *http.Request) {
	log.Printf("Serving request: %s %s", r.Method, r.URL.Path)
	fmt.Fprintf(w, "Hello, world!\n")
	fmt.Fprintf(w, "%s %s %s\n", r.Method, r.URL, r.Proto)
	fmt.Fprintf(w, "TLS\n\tServerName: %s\n\tVersion: %d\n\tCipherSuite: %d\n",
		r.TLS.ServerName, r.TLS.Version, r.TLS.CipherSuite)

	for _, cert := range r.TLS.PeerCertificates {
		fmt.Fprintf(w, "TLSPeerCertificate: Subject %+v\n", cert.Subject)
	}

	fmt.Fprintf(w, "Headers\n")
	for k, v := range r.Header {
		// Redact sensitive headers in the demo response so screenshots and
		// shared logs don't accidentally leak bearer tokens, cookies, or the
		// JWT assertion Pomerium injects.
		if isSensitiveHeader(k) {
			fmt.Fprintf(w, "\t[%s]:\n\t\t[redacted]\n", k)
			continue
		}
		fmt.Fprintf(w, "\t[%s]:\n\t\t%s\n", k, v)
	}
}

func isSensitiveHeader(name string) bool {
	switch strings.ToLower(name) {
	case "authorization", "cookie", "x-pomerium-jwt-assertion":
		return true
	}
	return false
}

func newClientCertTLSListener(addr, tlsCert, tlsKey, clientCA string) (net.Listener, error) {
	caPool, err := decodeCertPoolFromPEM(clientCA)
	if err != nil {
		return nil, err
	}
	cert, err := decodeCertificate(tlsCert, tlsKey)
	if err != nil {
		return nil, err
	}

	// TLS 1.3 only — Go's stdlib manages the cipher and curve list; pinning
	// either field on a public reference example freezes a list that ages
	// poorly. tls.VersionTLS13 ignores CipherSuites and CurvePreferences.
	tlsConfig := &tls.Config{
		ClientAuth:   tls.RequireAndVerifyClientCert,
		ClientCAs:    caPool,
		MinVersion:   tls.VersionTLS13,
		Certificates: []tls.Certificate{cert},
		NextProtos:   []string{"h2"},
	}

	ln, err := net.Listen("tcp", addr)
	if err != nil {
		return nil, err
	}

	return tls.NewListener(ln, tlsConfig), nil
}

func decodeCertPoolFromPEM(encPemCerts string) (*x509.CertPool, error) {
	pemCerts, err := base64.StdEncoding.DecodeString(encPemCerts)
	if err != nil {
		return nil, fmt.Errorf("decode CA pem: %w", err)
	}
	certPool := x509.NewCertPool()
	if ok := certPool.AppendCertsFromPEM(pemCerts); !ok {
		return nil, fmt.Errorf("append CA certs from pem")
	}
	return certPool, nil
}

func decodeCertificate(cert, key string) (tls.Certificate, error) {
	decodedCert, err := base64.StdEncoding.DecodeString(cert)
	if err != nil {
		return tls.Certificate{}, fmt.Errorf("decode cert: %w", err)
	}
	decodedKey, err := base64.StdEncoding.DecodeString(key)
	if err != nil {
		return tls.Certificate{}, fmt.Errorf("decode key: %w", err)
	}
	pair, err := tls.X509KeyPair(decodedCert, decodedKey)
	if err != nil {
		return tls.Certificate{}, fmt.Errorf("X509KeyPair: %w", err)
	}
	return pair, nil
}
