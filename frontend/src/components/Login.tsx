import React, { useState } from 'react';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api-token-auth/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) {
                throw new Error('Login failed');
            }
            const data = await response.json();
            setToken(data.access); // use access token
            localStorage.setItem('token', data.access); // Store access token
            setError(null);
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div style={{ maxWidth: '300px', margin: '20px auto'}}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                />
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red'}}>{error}</p>}
            {token && <p>Logged in with token: {token}</p>}
        </div>
    );
};

export default Login;