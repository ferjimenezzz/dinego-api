import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/login', { email, password });
            
            // Guardamos el token
            localStorage.setItem('token', response.data.token);
            navigate('/'); // Lo mandamos directo a ver los restaurantes
        } catch (err) {
            setError(err.response?.data?.message || 'Error al iniciar sesión. Revisa tus datos.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Iniciar Sesión</h1>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Correo Electrónico</label>
                        <input 
                            type="email" 
                            className="form-control"
                            placeholder="ferxxo@test.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            className="form-control"
                            placeholder="********" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-primary">Entrar</button>
                </form>

                <div className="auth-links">
                    <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
                    <p><Link to="/">← Volver al Inicio</Link></p>
                </div>
            </div>
        </div>
    );
}