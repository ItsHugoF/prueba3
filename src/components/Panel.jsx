import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSatelliteDish } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import logo from '../util/imagenes/marka_informatica.jpg';

const Dashboard = () => {
  // Añadimos un estado isFichado que dice si está fichado o no
  const [isFichado, setIsFichado] = useState(false);
  const [tiempoInicio, setTiempoInicio] = useState(localStorage.getItem('fichadoStart') || null );
  const [cronometro, setCronometro] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [iconColor, setIconColor] = useState('rojo');
  const navigate = useNavigate();

  useEffect(() => {
    const fichado = localStorage.getItem('isFichado') === 'true';
    setIsFichado(fichado);
  }, []);

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
    if (isFichado) {
      interval = setInterval(() => {
        const ahora = Date.now();
        const transcurrido = ahora - parseInt(tiempoInicio, 10);
        setCronometro(formatearTiempo(transcurrido));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFichado, tiempoInicio]);

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
/*
  const handleFichar = () => {
    if (!navigator.geolocation) {
      setMensaje('Geolocalización no soportada en este navegador');
      return;
    }

    localStorage.setItem('isFichado', 'true');
    setIsFichado(true); 

    const startTime = Date.now();
    localStorage.setItem('fichadoStart', startTime.toString());
    setTiempoInicio(startTime);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords;

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/Fichaje/Iniciar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // Se asume que el usuario ya está logueado y su id se guarda en localStorage
            UsuarioId: parseInt(localStorage.getItem('usuarioId')), 
            LatInicio: latitude,
            LonInicio: longitude
          })
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Fichaje iniciado:", data);
          localStorage.setItem('fichajeId', data.fichajeId);
        } else {
          console.error("Error iniciando fichaje:", response.statusText);
          setMensaje("Error iniciando fichaje");
        }
      } catch (error) {
        console.error("Error en la petición de fichaje:", error);
        setMensaje("Error iniciando fichaje");
      }

      setMensaje(`Fichando:
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
*/
  /*const handleSalir = () => {
    localStorage.removeItem('isFichado');
    localStorage.removeItem('fichadoStart');
    setIsFichado(false); 

    setCronometro('');
    setMensaje('Has salido (pero sigues logueado)');
  };*/

  const handleFichar = () => {
    if (!navigator.geolocation) {
      setMensaje('Geolocalización no soportada en este navegador');
      return;
    }
    // Marcamos el estado como fichado y guardamos el inicio
    localStorage.setItem('isFichado', 'true');
    setIsFichado(true);
    const startTime = Date.now();
    localStorage.setItem('fichadoStart', startTime.toString());
    setTiempoInicio(startTime);
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        const usuarioId = parseInt(localStorage.getItem('usuarioId'));
        console.log("UsuarioId obtenido:", usuarioId);
        if (isNaN(usuarioId)) {
          alert("Error: usuarioId no está definido correctamente en localStorage");
          return;
        }
        
        try {
          const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/Fichaje/Iniciar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              UsuarioId: usuarioId,
              LatInicio: latitude,
              LonInicio: longitude
            })
          });
          console.log("Respuesta de la petición:", response);
          if (response.ok) {
            const data = await response.json();
            console.log("Datos recibidos del fichaje:", data);
            alert("Fichaje creado: " + JSON.stringify(data));
            // Verifica que la propiedad exista (puede llamarse fichajeId o FichajeId)
            if (data.fichajeId || data.FichajeId) {
              localStorage.setItem('fichajeId', data.fichajeId || data.FichajeId);
            } else {
              console.error("No se encontró la propiedad 'fichajeId' en la respuesta");
              alert("No se encontró la propiedad 'fichajeId' en la respuesta");
            }
          } else {
            console.error("Error iniciando fichaje:", response.statusText);
            setMensaje("Error iniciando fichaje");
          }
        } catch (error) {
          console.error("Error en la petición de fichaje:", error);
          setMensaje("Error iniciando fichaje");
        }
        
        setMensaje(`Fichando:
  Latitud: ${latitude.toFixed(6)}
  Longitud: ${longitude.toFixed(6)}
  Precisión: ±${Math.round(accuracy)} metros`);
      },
      (error) => {
        setIconColor('rojo');
        setMensaje(`Error de geolocalización: ${error.message}`);
      }
    );
  };
  
  const handleSalir = async () => {
    if (!navigator.geolocation) {
      setMensaje('Geolocalización no soportada en este navegador');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const fichajeId = localStorage.getItem('fichajeId');
        if (fichajeId) {
          try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/Fichaje/Finalizar/${fichajeId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                LatFin: latitude,
                LonFin: longitude
              })
            });
            if (response.ok) {
              console.log("Fichaje finalizado correctamente");
              setMensaje("Fichaje finalizado correctamente");
              localStorage.removeItem('fichajeId');
            } else {
              console.error("Error finalizando fichaje:", response.statusText);
              setMensaje("Error finalizando el fichaje");
            }
          } catch (error) {
            console.error("Error en la petición de finalizar fichaje:", error);
            setMensaje("Error finalizando el fichaje");
          }
        } else {
          setMensaje("No se encontró un fichaje activo");
        }
        // Limpiar variables de fichaje
        localStorage.removeItem('isFichado');
        localStorage.removeItem('fichadoStart');
        setIsFichado(false);
        setCronometro('');
      },
      (error) => {
        console.error("Error obteniendo posición final:", error);
        setMensaje(`Error de geolocalización: ${error.message}`);
      }
    );
  };


  const handleCerrarSesion = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="container">
      <header>
        <img 
          src={logo} 
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
        {/* Deshabilitamos el botón "Entrar" si ya está fichado */}
        <button onClick={handleFichar} disabled={isFichado}>
          Entrar
        </button>

        {/* Deshabilitamos "Salir" si NO está fichado */}
        <button onClick={handleSalir} disabled={!isFichado}>
          Salir
        </button>
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





    /*navigator.geolocation.getCurrentPosition(
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
  };*/