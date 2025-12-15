import { useEffect, useState } from 'react';
import PatientManager from './components/patientManager';

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
      <PatientManager />
    </div>
  );
}

export default App;