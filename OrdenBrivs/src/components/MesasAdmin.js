import React, { useState, useEffect } from "react";
import { ScrollView, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, RefreshControl, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const MesasAdmin = () => {
    const navigation = useNavigation();
    const [mesas, setMesas] = useState([]);
    const [nombreMesa, setNombreMesa] = useState('');
    const [editingMesaId, setEditingMesaId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchMesas();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchMesas();
        setRefreshing(false);
    };

    const fetchMesas = async () => {
        try {
            const response = await axios.get('https://evolving-man-proud.ngrok-free.app/api/mesas');
            const mesasData = response.data.map(mesa => ({ id: mesa.mesaID.toString(), nombre: mesa.mesaID.toString() }));
            setMesas(mesasData);
        } catch (error) {
            console.error('Error fetching mesas:', error);
        }
    };

    const handleAgregarEditarMesa = async () => {
        if (nombreMesa.trim() === '') {
            Alert.alert("Por favor ingresa el nombre de la mesa.");
            return;
        }

        try {
            if (editingMesaId) {
                await axios.put(`https://evolving-man-proud.ngrok-free.app/api/mesas/${editingMesaId}`, {
                    mesaID: nombreMesa.trim()
                });
                const updatedMesas = mesas.map(mesa => {
                    if (mesa.id === editingMesaId) {
                        return { ...mesa, nombre: nombreMesa.trim() };
                    }
                    return mesa;
                });
                setMesas(updatedMesas);
                setEditingMesaId(null);
                setNombreMesa(''); // Limpiar el nombre de la mesa después de la edición
                Alert.alert("Mesa Editada", "La mesa ha sido editada correctamente.");
            } else {
                const response = await axios.post('https://evolving-man-proud.ngrok-free.app/api/mesas', {
                    mesaID: nombreMesa.trim()
                });
                setMesas([...mesas, { id: response.data.mesaID.toString(), nombre: response.data.mesaID.toString() }]);
                setNombreMesa(''); // Limpiar el nombre de la mesa después de agregarla
                Alert.alert("Mesa Agregada", "La mesa ha sido agregada correctamente.");
            }
        } catch (error) {
            console.error('Error adding/editing mesa:', error);
        }
    };

    const handleEditarMesa = (id) => {
        console.log(`Editando mesa con ID: ${id}`);
        const mesa = mesas.find(mesa => mesa.id === id);
        setNombreMesa(mesa.nombre);
        setEditingMesaId(id);
    };

    const handleBorrarMesa = async (id) => {
        try {
            await axios.delete(`https://evolving-man-proud.ngrok-free.app/api/mesas/${id}`);
            setMesas(mesas.filter(mesa => mesa.id !== id));
            Alert.alert("Mesa Eliminada", "La mesa ha sido eliminada correctamente.");
        } catch (error) {
            console.error('Error deleting mesa:', error);
        }
    };

    const handleInputChange = (text) => {
        // Validar para admitir solo números
        if (/^\d*$/.test(text)) {
            setNombreMesa(text);
        }
    };

    const handleCancelar = () => {
        setNombreMesa('');
        setEditingMesaId(null);
    };

    const renderMesaItem = ({ item }) => (
        <View style={styles.mesaItem}>
            <Text>Mesa: {item.nombre}</Text>
            <View style={styles.mesaOptions}>
                <TouchableOpacity onPress={() => handleEditarMesa(item.id)}>
                    <Icon name="edit" size={20} color="#333" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleBorrarMesa(item.id)}>
                    <Icon name="trash" size={20} color="red" style={styles.icon} />
                </TouchableOpacity>
            </View>
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

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <Text style={styles.title}>Lista de Mesas</Text>
                <FlatList
                    data={mesas}
                    renderItem={renderMesaItem}
                    keyExtractor={(item) => item.id}
                />
            </ScrollView>
            <View style={styles.agregarMesaCard}>
                <TextInput
                    placeholder="Numero de la mesa"
                    style={styles.input}
                    value={nombreMesa}
                    onChangeText={handleInputChange}
                    keyboardType="numeric" // Permitir solo números
                />
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancelar}>
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addButton} onPress={handleAgregarEditarMesa}>
                        <Text style={styles.buttonText}>{editingMesaId ? 'Editar Mesa' : 'Agregar Mesa'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.topBar}>
                <View style={styles.topBarContent}>
                    <TouchableOpacity onPress={() => handleNavigation("Ajustes")}>
                        <Icon name="cogs" size={30} color="#FFF" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNavigation("VistaAdmin")}>
                        <Icon name="user-circle" size={30} color="#FFF" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNavigation("Menu")}>
                        <Icon name="file-text" size={30} color="#FFF" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNavigation("EmpleadosAdmin")}>
                        <Icon name="users" size={30} color="#FFF" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNavigation("Ventas")}>
                        <Icon name="dollar" size={30} color="#FFF" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout}>
                        <Icon name="sign-out" size={30} color="#FFF" style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingTop:25,
    },
    topBar: {
        
        backgroundColor: '#011',
        paddingVertical: 15,
        paddingHorizontal: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
        zIndex: 100,
    },
    topBarContent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    icon: {
        marginHorizontal: 10,
    },
    scrollContent: {
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    mesaItem: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        flexDirection: "column",
    },
    mesaOptions: {
        flexDirection: "row",
        marginTop: 10,
    },
    agregarMesaCard: {
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        padding: 20,
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: "#2C8CF3",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        flex: 1,
        marginLeft: 5,
    },
    cancelButton: {
        backgroundColor: "#dc3545",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        flex: 1,
        marginRight: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default MesasAdmin;
