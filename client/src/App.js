import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [conductores, setConductores] = useState([]);
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'propietario' });

  const handleLogin = async () => {
    const res = await axios.post(`${API}/users/login`, { email: form.email, password: form.password });
    setUser(res.data.user);
    localStorage.setItem('token', res.data.token);
  };

  const getConductores = async () => {
    const res = await axios.get(`${API}/conductors/by-propietario/${user._id}`);
    setConductores(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      {!user ? (
        <div>
          <h2>Login</h2>
          <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} /><br />
          <input placeholder="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} /><br />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h2>Bienvenido, {user.name}</h2>
          <button onClick={getConductores}>Ver conductores</button>
          <ul>
            {conductores.map(c => (
              <li key={c._id}>{c.nombre} {c.apellido} - {c.placa}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
