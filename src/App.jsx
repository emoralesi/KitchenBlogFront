import { SnackbarProvider } from 'notistack';
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import UserForm from './components/Login-Register/UserForm';
import MainContent from './components/Menu/Main';
import { ListaDeCompra } from './components/Menu/Seccion//ListaDeCompra';
import { Testing1 } from './components/Menu/Seccion//Testing1';
import { Testing2 } from './components/Menu/Seccion//Testing2';
import { Bienvenido } from './components/Menu/Seccion/Bienvenido';
import { MiPerfil } from './components/Menu/Seccion/MiPerfil';
import SessionGuard from './components/SessionGuard/SessionGuard';
import { FullPagePost } from './components/Menu/Seccion/FullPagePost';

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
          <Route path="/main" element={<SessionGuard element={<MainContent />} />}>
            <Route path="bienvenido" element={<Bienvenido />} />
            <Route path="miPerfil" element={<MiPerfil />} />
            <Route path="listaDeCompra" element={<ListaDeCompra />} />
            <Route path="testing1" element={<Testing1 />} />
            <Route path="testing2" element={<Testing2 />} />
            <Route path="p/:idPost" element={<FullPagePost />} />
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
        </Routes>
      </SnackbarProvider>
    </Router>
  );
}

export default App;
