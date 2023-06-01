```javascript
import { useEffect, useState } from 'react';
import { PomeriumVerifier, signOut } from '@pomerium/js-sdk';

function App() {

  const [jwt, setJwt ] = useState('');

  useEffect(() => {
    const jwtVerifier = new PomeriumVerifier({
      issuer: 'react.localhost.pomerium.io',
      audience: 'react.localhost.pomerium.io',
      expirationBuffer: 1000
    });
    jwtVerifier.verifyBrowserUser()
      .then(r => setJwt(r))
      .catch(e => console.log(e));
  }, [])

  return (
    <div style={{margin: '20px'}}>
      <pre>{JSON.stringify(jwt, null, 2)}</pre>
      <div style={{marginTop: '20px'}}>
        <button onClick={() => signOut('https://www.pomerium.io')} type="button">Sign Out Test</button>
      </div>
    </div>
  );
}

export default App;
```
