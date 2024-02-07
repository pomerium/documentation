```yaml title="config.yaml"
signing_key: LS0tLS1CRUdJTiBFQyBQUklWQVRFIEtFWS0tLS0tCk1IY0NBUUVFSURMV3Q3ZkczV2ZkYjk5elFHQTJObEJXcCt3d0c1aGJoR3MzY29JUlo2SjRvQW9HQ0NxR1NNNDkKQXdFSG9VUURRZ0FFcGtRRktLUUdqcVdzbDlYYkUwWmZLL2ZhbHJ2NENWSWtqSTlydXlCbHdOeDYzNmhZRnBtKwpNM0llTXNUKzRreExidVlZSGZDeUtjQzFnZ1BjSWpCYktRPT0KLS0tLS1FTkQgRUMgUFJJVkFURSBLRVktLS0tLQo=

routes:
  - from: https://verify.localhost.pomerium.io
    to: http://verify:8000
    policy:
      - allow:
          or:
            - email:
                # Replace user@example.com with your email address
                is: user@example.com
    pass_identity_headers: true
```
