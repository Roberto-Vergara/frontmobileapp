import React from 'react';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';
import Home from '../pages/Home';

export default function RootNavigation() {
  const { isAuthenticated } = useAuth();

  // Aquí es donde ocurre la autorización a nivel de ruta
  return isAuthenticated ? <Home /> : <Login />;
}