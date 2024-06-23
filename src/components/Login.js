import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Login = ({ navigation }) => {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [contraseñaIngresada, setContraseñaIngresada] = useState('');

    const onPress = async () => {
        try {
            const response = await fetch('https://evolving-man-proud.ngrok-free.app/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: nombreUsuario,
                    password: contraseñaIngresada,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                switch (data.role) {
                    case 'admin':
                        navigation.navigate('VistaAdmin');
                        break;
                    case 'chef':
                        navigation.navigate('ChefVistas');
                        break;
                    case 'mesero':
                        navigation.navigate('Orden');
                        break;
                    default:
                        Alert.alert('Error', 'Error al iniciar sesión');
                        break;
                }
            } else {
                if (response.status === 403 && data.error === "Usuario desactivado") {
                    Alert.alert('Error', 'Usuario desactivado. No puede ingresar.');
                } else {
                    Alert.alert('Error', data.error || 'Error al iniciar sesión');
                }
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            Alert.alert('Error', 'Error al iniciar sesión');
        }
    };

    return (
        <ImageBackground source={{ uri: 'https://i.postimg.cc/ZRSCKG10/pixelcut-export-1-RHlga-Nek8-transformed.jpg' }} style={styles.background}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Iniciar Sesión</Text>
                    <View style={styles.inputBox}>
                        <FontAwesome name="user" size={24} color="white" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Usuario"
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={nombreUsuario}
                            onChangeText={setNombreUsuario}
                        />
                    </View>
                    <View style={styles.inputBox}>
                        <FontAwesome name="lock" size={24} color="white" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Clave"
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                            autoCorrect={false}
                            secureTextEntry
                            value={contraseñaIngresada}
                            onChangeText={setContraseñaIngresada}
                        />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={onPress}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Iniciar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        padding: 24,
        borderRadius: 10,
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Fondo negro con opacidad
        width: 300,
    },
    cardTitle: {
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff", // Texto blanco
        marginBottom: 20,
    },
    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#fff'
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#fff", // Texto blanco
    },
    button: {
        backgroundColor: "#2C8CF3", // Azul claro
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        height: 50,
    },
});

export default Login;
