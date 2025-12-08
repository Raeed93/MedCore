import { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState<string>('Loading...');

  useEffect(() => {
    fetch('http://localhost:3000/')
      .then((res) => res.text())
      .then((data) => setStatus(data))
      .catch(() => setStatus('Error connecting to server'));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Hospital AI Assistant</h1>
      <p>Backend Status: <strong>{status}</strong></p>
    </div>
  );
}

export default App;