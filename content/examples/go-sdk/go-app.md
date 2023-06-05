---
# cSpell:ignore gopkg Fatalln Fprintln Fprintf struct
---

```go
package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/hashicorp/golang-lru"
	"github.com/pomerium/sdk-go"
	"gopkg.in/square/go-jose.v2/jwt"
)

func main() {
	verifier, err := sdk.New(&sdk.Options{
		Expected: &jwt.Expected{
            // Replace the following with the domain for your service:
			Issuer: "sdk-example.localhost.pomerium.io",
			Audience: jwt.Audience([]string{
				"sdk-example.localhost.pomerium.io"}),
		},
		Datastore: newCache(),
	})
	if err != nil {
		log.Fatalln(err)
	}

	http.Handle("/", sdk.AddIdentityToRequest(verifier)(handler{}))
	log.Fatalln(http.ListenAndServe(":8080", nil))
}

type handler struct{}

func (handler) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	// Check the JWT verification result.
	id, err := sdk.FromContext(req.Context())
	if err != nil {
		fmt.Fprintln(res, "verification error:", err)
		return
	}

	fmt.Fprintf(res, "verified user identity (email %s)\n", id.Email)
}

type cache struct {
	lru *lru.Cache
}

func newCache() cache {
       lru, _ := lru.New(10)
       return cache{lru}
}

func (c cache) Get(key interface{}) (value interface{}, ok bool) {
       return c.lru.Get(key)
}

func (c cache) Add(key, value interface{}) {
       c.lru.Add(key, value)
}
```
