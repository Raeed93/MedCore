import { useState, useEffect } from 'react';

// Define what a "Patient" looks like
interface Patient {
  id: number;
  name: string;
  age: number;
  condition: string;
}

export default function PatientManager() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [condition, setCondition] = useState('');

  // 1. Function to fetch data from Backend
  const fetchPatients = async () => {
    try {
      const res = await fetch('http://localhost:3000/patients');
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      console.error("Error fetching:", err);
    }
  };

  // 2. Run this when the page loads
  useEffect(() => {
    fetchPatients();
  }, []);

  // 3. Function to send new data to Backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3000/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age: Number(age), condition }),
      });
      // Clear form and reload list
      setName('');
      setAge('');
      setCondition('');
      fetchPatients(); 
    } catch (err) {
      console.error("Error adding:", err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Doctor's Dashboard</h1>
      
      {/* Input Form */}
      <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Add New Patient</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            placeholder="Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
            style={{ padding: '8px' }}
          />
          <input 
            placeholder="Age" 
            type="number" 
            value={age} 
            onChange={e => setAge(e.target.value)} 
            required 
            style={{ padding: '8px' }}
          />
          <input 
            placeholder="Condition/Symptoms" 
            value={condition} 
            onChange={e => setCondition(e.target.value)} 
            required 
            style={{ padding: '8px' }}
          />
          <button type="submit" style={{ padding: '10px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>
            Add Patient
          </button>
        </form>
      </div>

      {/* List Display */}
      <h3>Patient List</h3>
      {patients.length === 0 ? <p>No patients found.</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {patients.map((p) => (
            <li key={p.id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
              <strong>{p.name}</strong> (Age: {p.age}) <br />
              <span style={{ color: 'red' }}>Condition: {p.condition}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}