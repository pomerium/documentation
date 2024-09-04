```javascript
import { useEffect, useState } from 'react';
import { getBrowserUser, signOut } from '@pomerium/js-sdk';

function App() {

   const [userInfo, setUserInfo] = useState('');

  useEffect(() => {
    getBrowserUser()
      .then(u => setUserInfo(u))
      .catch(e => console.log(e));
  }, [])

  return (
    <div style={{margin: '20px'}}>
      <pre>{JSON.stringify(userInfo, null, 2)}</pre>
      <div style={{marginTop: '20px'}}>
        <button onClick={() => signOut('https://www.pomerium.io')} type="button">Sign Out Test</button>
      </div>
    </div>
  );
}

export default App;
```
