import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSatelliteDish } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [tiempoInicio, setTiempoInicio] = useState(
    localStorage.getItem('fichadoStart') || null
  );
  const [cronometro, setCronometro] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [iconColor, setIconColor] = useState('rojo');
  const navigate = useNavigate();

  // Efecto para el reloj
  useEffect(() => {
    const actualizarReloj = () => {
      const ahora = new Date();
      const fechaHoraElement = document.getElementById('fechaHora');
      if (fechaHoraElement) {
        fechaHoraElement.textContent = 
          `Hoy es ${ahora.toLocaleDateString('es-ES')}, hora: ${ahora.toLocaleTimeString('es-ES')}`;
      }
    };

    const interval = setInterval(actualizarReloj, 1000);
    return () => clearInterval(interval);
  }, []);

  // Efecto para el cronómetro
  useEffect(() => {
    let interval;
    if (localStorage.getItem('isFichado') === 'true') {
      interval = setInterval(() => {
        const ahora = Date.now();
        const transcurrido = ahora - parseInt(tiempoInicio, 10);
        setCronometro(formatearTiempo(transcurrido));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [tiempoInicio]);

  // Efecto para la conexión
  useEffect(() => {
    const actualizarIcono = () => {
      if (!navigator.onLine) {
        setIconColor('rojo');
        return;
      }

      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (!connection) {
        setIconColor('verde');
        return;
      }

      const tipo = connection.effectiveType;
      switch (tipo) {
        case '4g':
        case 'wifi':
          setIconColor('verde');
          break;
        case '3g':
          setIconColor('amarillo');
          break;
        default:
          setIconColor('rojo');
      }
    };

    window.addEventListener('online', actualizarIcono);
    window.addEventListener('offline', actualizarIcono);
    if (navigator.connection) {
      navigator.connection.addEventListener('change', actualizarIcono);
    }

    return () => {
      window.removeEventListener('online', actualizarIcono);
      window.removeEventListener('offline', actualizarIcono);
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', actualizarIcono);
      }
    };
  }, []);

  const formatearTiempo = (ms) => {
    const totalSegundos = Math.floor(ms / 1000);
    const horas = String(Math.floor(totalSegundos / 3600)).padStart(2, '0');
    const minutos = String(Math.floor((totalSegundos % 3600) / 60)).padStart(2, '0');
    const segundos = String(totalSegundos % 60).padStart(2, '0');
    return `${horas}:${minutos}:${segundos}`;
  };

  const handleFichar = () => {
    if (!navigator.geolocation) {
      setMensaje('Geolocalización no soportada en este navegador');
      return;
    }

    localStorage.setItem('isFichado', 'true');
    const startTime = Date.now();
    localStorage.setItem('fichadoStart', startTime.toString());
    setTiempoInicio(startTime);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setMensaje(`
          Estás fichando en:
          Latitud: ${latitude.toFixed(6)}
          Longitud: ${longitude.toFixed(6)}
          Precisión: ±${Math.round(accuracy)} metros
        `);
      },
      (error) => {
        setIconColor('rojo');
        setMensaje(`Error de geolocalización: ${error.message}`);
      }
    );
  };

  const handleSalir = () => {
    localStorage.removeItem('isFichado');
    localStorage.removeItem('fichadoStart');
    setCronometro('');
    setMensaje('Has salido (pero sigues logueado)');
  };

  const handleCerrarSesion = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="container">
      <header>
        <img 
          src="/src/images/marka_informatica.jpg" 
          alt="Logo empresa" 
          className="logo"
        />
        <h1>Control de Presencia</h1>
      </header>

      <div className="icon-container">
        <FontAwesomeIcon 
          icon={faSatelliteDish} 
          className={`icono-${iconColor}`} 
          size="3x"
        />
      </div>

      <div className="botones">
        <button onClick={handleFichar}>Entrar</button>
        <button onClick={handleSalir}>Salir</button>
      </div>

      <div className="tiempo-info">
        <p id="fechaHora"></p>
      </div>
      <p className="cronometro">{cronometro}</p>

      <div className="mensaje">
        {mensaje.split('\n').map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <footer className="barra-inferior">
        <button>Opción 1</button>
        <button disabled>Iniciar Sesión</button>
        <button onClick={handleCerrarSesion}>Cerrar Sesión</button>
      </footer>
    </div>
  );
};

export default Dashboard;