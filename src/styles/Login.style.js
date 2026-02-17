import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#F8F9FB', // Un gris casi blanco más moderno
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1A1C1E',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#6C757D',
    },
    inputContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#4A90E2', // El borde azul de la imagen
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 55,
        marginBottom: 20,
        // Sombra para iOS
        shadowColor: "#4A90E2",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        // Sombra para Android
        elevation: 3,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#333',
    },
    forgotText: {
        alignSelf: 'flex-end',
        color: '#6C757D',
        marginBottom: 25,
        fontSize: 14,
    },
    button: {
        backgroundColor: '#2563EB', // Azul vibrante
        paddingVertical: 16,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        shadowColor: "#2563EB",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerText: {
        marginTop: 25,
        color: '#6C757D',
        fontSize: 15,
    },
    signUpText: {
        color: '#2563EB',
        fontWeight: 'bold',
    }
});