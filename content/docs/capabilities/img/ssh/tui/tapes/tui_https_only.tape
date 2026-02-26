Set Shell "bash"
Set FontSize 32
Set Width 2560
Set Height 1440
Set Theme "nord"
Set Padding 1
Set Framerate 1
Set TypingSpeed 0

Hide
Type `ssh -E /ssh.log -o PermitLocalCommand=yes -o LocalCommand="/tapes/util/curl_https.sh 0.8" -tt -R https-*:0 example.com` Enter
Show
Sleep 1001ms
