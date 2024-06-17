import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Login = ({ navigation }) => {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [contraseñaIngresada, setContraseñaIngresada] = useState('');

    const onPress = () => {
        const usuarioNormal = { nombre: 'juan', contraseña: 'juan123' };
        const usuarioAdmin = { nombre: 'admin', contraseña: 'admin123' };
        const usuarioChef = { nombre: 'Pedro', contraseña: 'pedro123' }; // Arreglado el typo en "contraseña"
    
        if (nombreUsuario === usuarioNormal.nombre && contraseñaIngresada === usuarioNormal.contraseña) {
            navigation.navigate('Orden');
        } else if (nombreUsuario === usuarioAdmin.nombre && contraseñaIngresada === usuarioAdmin.contraseña) {
            navigation.navigate('VistaAdmin');
        } else if (nombreUsuario === usuarioChef.nombre && contraseñaIngresada === usuarioChef.contraseña) {
            navigation.navigate('ChefVistas'); // Agregar la navegación para el rol de chef
        } else {
            alert('Contraseña incorrecta');
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
        backgroundColor: "#011", // Fondo gris oscuro con opacidad
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
