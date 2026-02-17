import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { style } from "../styles/Login.style";
import { loginRequest } from "../api/auth"; // Importas tu api
import { useAuth } from "../context/AuthContext"; // Importas el contexto
import Toast from "react-native-toast-message";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth(); // Función del contexto

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await loginRequest(email, password);
            login(response.data.user, response.data.token); // Guardamos en el estado global
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error de autenticación',
                text2: error.message, // "Credenciales inválidas"
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 50, // Ajuste de posición si tienes notch/barra estado
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={style.container}>
            <View style={style.headerContainer}>
                <Text style={style.title}>Control De Calidad</Text>
                <Text style={style.subtitle}>Vidrios Dellorto</Text>
            </View>

            <View style={style.inputContainer}>
                <TextInput 
                    style={style.input}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    onChangeText={setEmail}
                    value={email}
                />
            </View>

            <View style={style.inputContainer}>
                <TextInput 
                    style={style.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#999"
                    secureTextEntry
                    onChangeText={setPassword}
                    value={password}
                />
            </View>

            <TouchableOpacity style={style.button} onPress={handleLogin} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={style.buttonText}>Iniciar sesion</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}