import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../util/imagenes/marka_informatica.jpg';
//import usuarios from '../util/json/users.json';

const Login = () => {
  const [formData, setFormData] = useState({
    empresa: '',
    usuario: '',
    contraseña: ''
  });
  //const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

/*useEffect(() => {
    setUsers(usuarios);
  }, []);*/

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  /*
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
  };*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      console.log(process.env.REACT_APP_BASE_URL);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/Usuario/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          EmpresaId: parseInt(formData.empresa, 10),
          Usuario: formData.usuario,
          Contraseña: formData.contraseña
        })
      });
  
      const clonedResponse = response.clone();
      const responseBody = await clonedResponse.text();
      console.log("Cuerpo de respuesta:", responseBody);
      console.log("Respuesta de la API:", response);
  
      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }
  
      const data = await response.json();
      console.log("Usuario recibido:", data);  // Se espera que data contenga usuarioId, nombre, etc.
      
      // Almacena el usuarioId en localStorage para que Dashboard lo pueda usar
      localStorage.setItem('usuarioId', data.usuarioId);
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('empresa', formData.empresa);
      localStorage.setItem('usuario', data.nombre);
      
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">

    <header className="logo-container">
      <img 
        src={logo}
        alt="Logo empresa"
        className="logo"
      />
    </header>

    <div className="login-section">
      <h2 className="login-titulo">Bienvenido</h2>
      
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="empresa">Empresa</label>
        <input
          type="text"
          id="empresa"
          value={formData.empresa}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="usuario">Usuario</label>
        <input
          type="text"
          id="usuario"
          value={formData.usuario}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="contraseña">Contraseña</label>
        <input
          type="password"
          id="contraseña"
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

  </div>
  );
};

export default Login;