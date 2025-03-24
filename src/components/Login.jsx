import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    empresa: '',
    usuario: '',
    contraseña: ''
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/users.json')
      .then(response => {
        if (!response.ok) throw new Error('Error cargando usuarios');
        return response.json();
      })
      .then(data => setUsers(data))
      .catch(error => {
        console.error('Error:', error);
        setError('Error al cargar los usuarios');
      });
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userExists = users.some(user =>
      user.empresa === formData.empresa &&
      user.usuario === formData.usuario &&
      user.contraseña === formData.contraseña
    );

    if (userExists) {
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('empresa', formData.empresa);
      localStorage.setItem('usuario', formData.usuario);
      navigate('/');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-section">
      <header>
        <img 
          src="/src/images/marka_informatica.jpg" 
          alt="Logo empresa" 
          className="logo"
        />
      </header>

      <h2 className="login-titulo">Bienvenido</h2>
      
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="empresaInput">Empresa</label>
        <input
          type="text"
          id="empresaInput"
          value={formData.empresa}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="usuarioInput">Usuario</label>
        <input
          type="text"
          id="usuarioInput"
          value={formData.usuario}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="contraseñaInput">Contraseña</label>
        <input
          type="password"
          id="contraseñaInput"
          value={formData.contraseña}
          onChange={handleInputChange}
          required
        />

        <button type="submit" className="btn-acceder">
          Acceder
        </button>
      </form>

      {error && <p className="error-msg">{error}</p>}
    </div>
  );
};

export default Login;