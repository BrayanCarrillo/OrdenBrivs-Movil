import React, { useState, useEffect } from "react";
import { View, Text,ScrollView, StyleSheet, TouchableOpacity, TextInput, FlatList } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';

const Ajustes = () => {
    const navigation = useNavigation();
    const [empleados, setEmpleados] = useState([]);
    const [passwords, setPasswords] = useState({});

    useEffect(() => {
        fetchEmpleados();
    }, []);

    const fetchEmpleados = async () => {
        try {
            const response = await axios.get('https://evolving-man-proud.ngrok-free.app/api/empleados');
            setEmpleados(response.data.empleados);
        } catch (error) {
            console.error('Error fetching empleados:', error);
            alert('Error al obtener la lista de empleados');
        }
    };

    const handlePasswordChange = async (id, newPassword) => {
        try {
            await axios.put(`https://evolving-man-proud.ngrok-free.app/api/empleados/${id}/cambiar-contrasena`, { password: newPassword });
            setPasswords(prevPasswords => ({
                ...prevPasswords,
                [id]: ''
            }));
            alert('Contraseña cambiada correctamente');
        } catch (error) {
            console.error('Error cambiando contraseña:', error);
            alert('Error al cambiar la contraseña');
        }
    };

    const renderEmpleadoItem = ({ item }) => (
        <View style={styles.empleadoItem}>
            <Text style={styles.empleadoName}>{item.username}</Text>
            <TextInput
                style={styles.input}
                placeholder="Nueva contraseña"
                secureTextEntry={true}
                value={passwords[item.staffID] || ''}
                onChangeText={text => setPasswords(prevPasswords => ({
                    ...prevPasswords,
                    [item.staffID]: text
                }))}
            />
            <TouchableOpacity style={styles.button} onPress={() => handlePasswordChange(item.staffID, passwords[item.staffID])}>
                <Icon name="key" size={20} color="white" />
            </TouchableOpacity>
        </View>
    );

    const handleLogout = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }]
        });
    };

    const handleNavigation = (screenName) => {
        navigation.navigate(screenName);
    };

    const renderBottomBar = () => (
        <View style={styles.bottomBar}>
            <View style={styles.bottomBarContent}>
                <TouchableOpacity onPress={() => handleNavigation("VistaAdmin")}>
                    <Icon name="user-circle" size={30} color="#FFF" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigation("Menu")}>
                    <Icon name="file-text" size={30} color="#FFF" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigation("EmpleadosAdmin")}>
                    <Icon name="users" size={30} color="#FFF" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigation("MesasAdmin")}>
                    <Icon name="table" size={30} color="#FFF" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigation("Ventas")}>
                    <Icon name="dollar" size={30} color="#FFF" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout}>
                    <Icon name="sign-out" size={30} color="#FFF" style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Configuración</Text>
                <View style={styles.cardContainer}>
                    <FlatList
                        data={empleados}
                        renderItem={renderEmpleadoItem}
                        keyExtractor={(item) => item.staffID.toString()}
                    />
                </View>
</ScrollView>
            {renderBottomBar()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
        backgroundColor: "#F0F0F0",
        padding: 20,
        paddingBottom: 60, // Espacio para la barra inferior
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#333",
    },
    cardContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 19,
        elevation: 3,
        flex: 1,
    },
    empleadoItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingVertical: 10,
        marginBottom: 10,
    },
    empleadoName: {
        fontSize: 16,
        flex: 1,
        color: "#333",
        fontWeight: 'bold',
    },
    input: {
        flex: 2,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        color: "#333",
        borderWidth: 1,
        borderColor: "#ccc",
    },
    button: {
        backgroundColor: '#3399FF',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: "center",
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#011',
        paddingVertical: 28,
        paddingHorizontal: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 2,
        zIndex: 100,
    },
    bottomBarContent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    icon: {
        marginHorizontal: 10,
    },
});

export default Ajustes;
