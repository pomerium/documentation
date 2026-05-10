FROM golang:1.26.2-bookworm@sha256:4f4ab2c90005e7e63cb631f0b4427f05422f241622ee3ec4727cc5febbf83e34 AS build-env

WORKDIR /go/src/app
ADD . /go/src/app

RUN go mod download
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /app .

FROM gcr.io/distroless/static:latest@sha256:47b2d72ff90843eb8a768b5c2f89b40741843b639d065b9b937b07cd59b479c6
COPY --from=build-env /app /app
CMD ["/app"]
