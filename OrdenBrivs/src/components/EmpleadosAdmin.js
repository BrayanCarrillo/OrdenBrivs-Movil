import React, { useState, useEffect } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert } from "react-native";
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const EmpleadosAdmin = () => {
    const navigation = useNavigation();
    const [empleados, setEmpleados] = useState([]);
    const [nombreEmpleado, setNombreEmpleado] = useState('');
    const [cargoEmpleado, setCargoEmpleado] = useState('');
    const [editingEmpleadoId, setEditingEmpleadoId] = useState(null);

    useEffect(() => {
        fetchEmpleados();
    }, []);

    const fetchEmpleados = async () => {
        try {
            const response = await axios.get('https://evolving-man-proud.ngrok-free.app/api/empleados');
            setEmpleados(response.data.empleados);
        } catch (error) {
            console.error('Error fetching empleados:', error);
        }
    };

    const handleEditEmpleado = (id) => {
        console.log(`Editando empleado con ID: ${id}`);
        const empleado = empleados.find(emp => emp.staffID === id);
        setNombreEmpleado(empleado.username);
        setCargoEmpleado(empleado.role);
        setEditingEmpleadoId(id);
    };

    const handleDeleteEmpleado = async (id) => {
        try {
            await axios.delete(`https://evolving-man-proud.ngrok-free.app/api/empleados/${id}`);
            setEmpleados(empleados.filter(empleado => empleado.staffID !== id));
            Alert.alert("Empleado eliminado", "El empleado ha sido eliminado correctamente.");
        } catch (error) {
            console.error('Error deleting empleado:', error);
        }
    };

    const handleAgregarEditarEmpleado = async () => {
        if (cargoEmpleado.trim() === '') {
            Alert.alert("Por favor selecciona el cargo del empleado.");
            return;
        }

        try {
            if (editingEmpleadoId) {
                await axios.put(`https://evolving-man-proud.ngrok-free.app/api/empleados/${editingEmpleadoId}/rol`, {
                    role: cargoEmpleado.trim()
                });
                const updatedEmpleados = empleados.map(emp => {
                    if (emp.staffID === editingEmpleadoId) {
                        return { ...emp, role: cargoEmpleado.trim() };
                    }
                    return emp;
                });
                setEmpleados(updatedEmpleados);
                setEditingEmpleadoId(null);
                Alert.alert("Empleado editado", "El empleado ha sido editado correctamente.");
            } else {
                const response = await axios.post('https://evolving-man-proud.ngrok-free.app/api/empleados', {
                    username: nombreEmpleado.trim(),
                    status: 'Activo', // Establece el estado predeterminado aquí
                    role: cargoEmpleado.trim()
                });
                setEmpleados([...empleados, response.data]);
                Alert.alert("Empleado agregado", "El empleado ha sido agregado correctamente.");
            }
            setNombreEmpleado('');
            setCargoEmpleado('');
        } catch (error) {
            console.error('Error adding/editing empleado:', error);
        }
    };

    const handleCancelar = () => {
        setNombreEmpleado('');
        setCargoEmpleado('');
        setEditingEmpleadoId(null);
    };

    const renderEmpleadoItem = ({ item }) => (
        <View style={styles.empleadoItem}>
            <Text style={styles.empleadoText}>ID: {item.staffID}</Text>
            <Text style={styles.empleadoText}>Nombre: {item.username}</Text>
            <Text style={styles.empleadoText}>Estado: {item.status}</Text>
            <Text style={styles.empleadoText}>Cargo: {item.role}</Text>
            <View style={styles.empleadoOptions}>
                <TouchableOpacity onPress={() => handleEditEmpleado(item.staffID)}>
                    <Icon name="edit" size={20} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteEmpleado(item.staffID)}>
                    <Icon name="trash" size={20} color="red" />
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
            <View style={styles.tableContainer}>
                <Text style={styles.title}>Lista de Empleados</Text>
                <FlatList
                    data={empleados}
                    renderItem={renderEmpleadoItem}
                    keyExtractor={(item) => item.staffID.toString()}
                />
            </View>
            <View style={styles.agregarEmpleadoCard}>
                <TextInput
                    placeholder="Nombre del empleado"
                    style={styles.input}
                    value={nombreEmpleado}
                    onChangeText={setNombreEmpleado}
                    editable={!editingEmpleadoId} // Deshabilita la edición del nombre si está en modo de edición
                />
                <Picker
                    selectedValue={cargoEmpleado}
                    onValueChange={(itemValue) => setCargoEmpleado(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Seleccionar cargo" value="" />
                    <Picker.Item label="Chef" value="Chef" />
                    <Picker.Item label="Mesero" value="Mesero" />
                </Picker>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancelar}>
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addButton} onPress={handleAgregarEditarEmpleado}>
                        <Text style={styles.buttonText}>{editingEmpleadoId ? 'Editar Empleado' : 'Agregar Empleado'}</Text>
</TouchableOpacity>
</View>
</View>
{/* Barra inferior */}
<View style={styles.bottomBar}>
<TouchableOpacity onPress={() => handleNavigation("Ajustes")}>
                        <Icon name="cogs" size={30} color="#FFF" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNavigation("VistaAdmin")}>
                        <Icon name="user-circle" size={30} color="#FFF" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNavigation("Menu")}>
                        <Icon name="file-text" size={30} color="#FFF" style={styles.icon} />
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
};

const styles = StyleSheet.create({
container: {
flex: 1,
paddingTop: 0.5,
},
topBar: {
flexDirection: 'row',
alignItems: 'center',
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
flex: 1,
flexDirection: 'row',
justifyContent: 'space-around',
alignItems: 'center',
},
icon: {
marginHorizontal: 14,
},
content: {
flex: 1,
paddingHorizontal: 10,
paddingTop: 11,
},
title: {
fontSize: 22,
fontWeight: 'bold',
marginBottom: 20,
color: '#333',
},
tableContainer: {
flex: 1,
padding: 22,
paddingTop:50,
backgroundColor: "#ffffff"
},
empleadoItem: {
borderWidth: 1,
borderColor: "#ccc",
borderRadius: 10,
padding: 10,
marginBottom: 10,
},
empleadoText: {
fontSize: 16,
marginBottom: 5,
},
empleadoOptions: {
flexDirection: "row",
justifyContent: "flex-end",
marginTop: 10,
},
agregarEmpleadoCard: {
backgroundColor: "#f0f0f0",
borderRadius: 0,
padding: 12,
marginTop: 2,
},
input: {
borderWidth: 1,
borderColor: "#ccc",
borderRadius: 5,
padding: 10,
marginBottom: 10,
},
picker: {
borderWidth: 1,
borderColor: "#ccc",
borderRadius: 5,
marginBottom: 10,
},
addButton: {
backgroundColor: "#2C8CF3",
paddingVertical: 15, // Ajusta la altura de los botones aquí
borderRadius: 5,
alignItems: "center",
width: '48%', // Ajusta el ancho aquí
},
cancelButton: {
backgroundColor: "#dc3545",
paddingVertical: 15, // Ajusta la altura de los botones aquí
borderRadius: 5,
alignItems: "center",
width: '48%', // Ajusta el ancho aquí
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
bottomBar: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: '#011',
paddingVertical: 15,
paddingHorizontal: 20,
elevation: 4,
shadowColor: '#000',
shadowOpacity: 0.2,
shadowOffset: { width: 0, height: -2 },
shadowRadius: 2,
zIndex: 100,
},
});

export default EmpleadosAdmin;