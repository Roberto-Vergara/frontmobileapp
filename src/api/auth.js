import { Alert } from 'react-native'; // Asegúrate de importar Alert

// // const API_URL = "http://186.67.187.227:3001/auth";
// const API_URL = "http://localhost:3001";
const url_ext = process.env.EXPO_PUBLIC_API_EXT_URL;
const url_local = process.env.EXPO_PUBLIC_API_LOCAL_URL;


export const loginRequest = async (email, password) => {
    try {
        // 1. Alert de Debug (solo para probar, luego lo quitas)
        // Alert.alert("Intentando conectar", `${API_URL}/login`);

        const response = await fetch(`${url_local}/auth/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (!response.ok) {
            throw { status: response.status, message: result.message || "Error en el servidor" };
        }

        return {
            status: response.status,
            data: result.data
        };

    } catch (error) {
        // 2. ESTO ES CLAVE: Si falla, el celular te dirá por qué.
        // console.error("Error en loginRequesta:", error);
        
        let mensajeError = "No se pudo conectar con el servidor.";
        if (error.message) mensajeError = error.message;
        

        Alert.alert("Error de Conexión", 
            `${mensajeError}`
        );
        // Alert.alert("Error de Conexión", 
        //     `${mensajeError}\n\nVerifica que la IP ${url_local} sea correcta y que el servidor esté encendido.`
        // );
        
        throw error; 
    }
};