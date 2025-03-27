```yaml
networks:
 main: {}
services:
 pomerium:
   image: pomerium/pomerium:latest
   volumes:
     - ./config.yaml:/pomerium/config.yaml:ro
   ports:
     - 443:443
   networks:
     main:
       aliases:
       - authenticate.localhost.pomerium.io
 verify:
   networks:
     main: {}
   image: pomerium/verify:latest
   expose:
     - 8000
 jenkins:
   networks:
     main: {}
   image: jenkins/jenkins:lts-jdk11
   privileged: true
   user: root
   ports:
     - 8080:8080
     - 50000:50000
   volumes:
     # File path to Jenkins_home -- stores configs, build logs, and artifacts
     - ./home/jenkins_compose/jenkins_configuration:/var/jenkins_home
     # "sock" is the Unix socket the Docker daemon listens on by default
     - ./var/run/docker.sock:/var/run/docker.sock
```
