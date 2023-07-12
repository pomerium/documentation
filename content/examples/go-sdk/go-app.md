---
# cSpell:ignore Fatalln Fprintln Fprintf struct
---

```go
package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/go-jose/go-jose/v3/jwt"
	"github.com/pomerium/sdk-go"
)

func main() {
	verifier, err := sdk.New(&sdk.Options{
		Expected: &jwt.Expected{
			// Replace the following with the domain for your service:
			Issuer: "sdk-example.localhost.pomerium.io",
			Audience: jwt.Audience([]string{
				"sdk-example.localhost.pomerium.io"}),
		},
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
```
