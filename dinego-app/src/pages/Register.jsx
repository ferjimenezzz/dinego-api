import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Consumimos tu endpoint POST /api/register
            await api.post('/register', { name, email, password });
            
            alert('¡Registro exitoso! Ya puedes iniciar sesión. 🎉');
            navigate('/login'); // Lo mandamos al login
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrar usuario');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Crear Cuenta</h1>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label>Nombre Completo</label>
                        <input 
                            type="text" 
                            className="form-control"
                            placeholder="Ej. Fernando Jimenez" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required 
                        />
                    </div>
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
                            placeholder="Mínimo 8 caracteres" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-primary">Registrarse</button>
                </form>
                
                <div className="auth-links">
                    <p>¿Ya tienes cuenta? <Link to="/login">Inicia Sesión aquí</Link></p>
                    <p><Link to="/">← Volver al Inicio</Link></p>
                </div>
            </div>
        </div>
    );
}