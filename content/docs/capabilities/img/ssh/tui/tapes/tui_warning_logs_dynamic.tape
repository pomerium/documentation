Source "/tapes/shared/tape_defaults.tape"

Hide
Type `ssh -E /ssh.log -tt -o PermitLocalCommand=yes -o LocalCommand="/tapes/util/curl_https.sh 0.5 -s -o /dev/null" -R https-route.example.com:443 example.com` Enter
Sleep 5s
Show
Sleep 1001ms
