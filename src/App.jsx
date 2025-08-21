import { SnackbarProvider } from "notistack";
import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import UserForm from "./components/Login-Register/UserForm";
import MainContent from "./components/Menu/Main";
import { Bienvenido } from "./components/Menu/Bienvenido/Bienvenido";
import { DescubrirChefs } from "./components/Menu/DescubrirChef/DescubrirChefs";
import { FullPageReceta } from "./components/Menu/Others/FullPageReceta";
import { Perfiles } from "./components/Menu/Perfil/Perfiles";
import SessionGuard from "./components/SessionGuard/SessionGuard";
import { ShoppingList2 } from "./components/Menu/ShoppingList/ShoppingList2";
import { ImageContent } from "./components/Menu/Others/EmailContent";
import { DescoveryRecipe } from "./components/Menu/DescubrirReceta/DescoveryRecipe";
import { Analytics } from "@vercel/analytics/next"

function App() {
  const ProtectedRoute = ({ element: Element, ...rest }) => {
    const isAuthenticated = localStorage.getItem("UserLogged");
    return (
      <Route
        {...rest}
        element={
          isAuthenticated ? (
            <Navigate to="/main/bienvenido" replace />
          ) : (
            <Element />
          )
        }
      />
    );
  };

  return (
    <Router>
      <SnackbarProvider maxSnack={3}>
        <Routes>
          <Route
            path="/login"
            element={
              localStorage.getItem("UserLogged") ? (
                <Navigate to="/main/bienvenido" replace />
              ) : (
                <UserForm formType={true} />
              )
            }
          ></Route>
          <Route
            path="/register"
            element={
              localStorage.getItem("UserLogged") ? (
                <Navigate to="/main/bienvenido" replace />
              ) : (
                <UserForm formType={false} />
              )
            }
          ></Route>
          <Route
            path="/main"
            element={<SessionGuard element={<MainContent />} />}
          >
            <Route path="bienvenido" element={<Bienvenido />} />
            <Route path="profile/:username" element={<Perfiles />} />
            <Route path="discoveryChefs" element={<DescubrirChefs />} />
            <Route path="discoveryRecipes" element={<DescoveryRecipe />} />
            <Route path="shoppingList" element={<ShoppingList2 />} />
            <Route path="p/:idReceta" element={<FullPageReceta />} />
          </Route>
          <Route
            path="*"
            element={
              localStorage.getItem("UserLogged") ? (
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
