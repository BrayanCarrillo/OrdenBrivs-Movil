import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const HomeScreen = ({ navigation }) => {
  const [userType, setUserType] = useState("admin"); // Puedes cambiar el tipo de usuario según sea necesario

  const handleLogout = () => {
    // Limpiar el estado de autenticación (por ejemplo, borrar el token de acceso)
    setAuthToken(null);
    
    // Limpiar el almacenamiento local (por ejemplo, borrar el token de acceso de AsyncStorage)
    AsyncStorage.removeItem('authToken');
  
    // Redirigir al usuario a la pantalla de inicio de sesión
    navigation.navigate('Login');
  };
  

  return (
    <View style={styles.container}>
      <Text>Bienvenido {userType === "admin" ? "Administrador" : "Empleado"}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f00",
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default HomeScreen;
