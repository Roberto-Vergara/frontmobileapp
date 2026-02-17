import React from 'react';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { AuthProvider } from "./src/context/AuthContext";
import { RechazoProvider } from "./src/context/RechazoContext"; 
import RootNavigation from "./src/navigation/RootNavigation";

export default function App() {
  return (
    <AuthProvider>
      <RechazoProvider> 
        <StatusBar style="auto" />
        <RootNavigation />
        <Toast />
      </RechazoProvider>
    </AuthProvider>
  );
}