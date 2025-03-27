import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Panel from './components/Panel';
import Login from './components/Login';
import './util/estilos/styles.css';

function App() {
  return (
    <Router basename="/prueba3">
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Panel />
          </ProtectedRoute>
        }/>
        <Route path="/login" element={<Login />}/>
        <Route path="*" element={<Navigate to="/" replace />}/>
      </Routes>
    </Router>
  );
}


const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default App;