import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import UserForm from './components/UserForm';
import { SnackbarProvider } from 'notistack';
import { Bienvenido } from './components/Bienvenido';
import MainContent from './components/Main';

function App() {

  const ProtectedRoute = ({ element: Element, ...rest }) => {
    const isAuthenticated = localStorage.getItem('UserLogged');
    return <Route {...rest} element={isAuthenticated ? <Navigate to="/main/bienvenido" replace /> : <Element />} />;
  };

  return (
    <Router>
      <SnackbarProvider maxSnack={3}>
        <Routes>
          <Route path="/login" element={localStorage.getItem('UserLogged') ? (
            <Navigate to="/main/bienvenido" replace />
          ) : (
            <UserForm formType={true} />
          )}>
          </Route >
          <Route path="/register" element={localStorage.getItem('UserLogged') ? (
            <Navigate to="/main/bienvenido" replace />
          ) : (
            <UserForm formType={false} />
          )}>
          </Route >
          <Route path="/main" element={<MainContent />}>
            <Route path="bienvenido" element={<Bienvenido />} />
          </Route>
          <Route
            path="*"
            element={
              localStorage.getItem('UserLogged') ? (
                <Navigate to="/main/bienvenido" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          {/* Otras rutas de la aplicación */}
        </Routes>
      </SnackbarProvider>
    </Router>
  );
}

export default App;
