import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from "react-native";
import { Table, Row } from "react-native-table-component";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

const ChefVistas = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [paginaActual, setPaginaActual] = useState(0);

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const cargarOrdenes = async () => {
    try {
      const response = await axios.get('https://evolving-man-proud.ngrok-free.app/api/chef/all-orders');
      const ordenesFiltradas = response.data.orders.filter(orden => 
        orden.orderDetails.length > 0 && 
        orden.orderDetails[0].menuItemName && 
        orden.orderDetails[0].estado !== 'listo'
      );
      setOrdenes(ordenesFiltradas);
    } catch (error) {
      console.error('Error al obtener las órdenes:', error);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      console.log('Datos enviados:', { status: newStatus });
      await axios.put(`https://evolving-man-proud.ngrok-free.app/api/chef/update-order-status/${orderId}`, { status: newStatus });
      await cargarOrdenes();
    } catch (error) {
      console.error('Error al actualizar el estado de la orden:', error);
    }
  };

  const limpiarOrdenesListas = () => {
    const ordenesNoListasNoCanceladas = ordenes.filter(orden => 
      orden.orderDetails[0].estado !== 'listo' && 
      orden.orderDetails[0].estado !== 'cancelado'
    );
    setOrdenes(ordenesNoListasNoCanceladas);
  };

  const ordenesPaginadas = ordenes.slice(paginaActual, paginaActual + 10);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Órdenes</Text>
        {ordenesPaginadas.map((orden, index) => (
          <View key={index} style={[styles.card, index % 2 === 0 ? styles.evenCard : null]}>
            <Text style={styles.cardTitle}>Orden #{orden.orderID}</Text>
            <Text style={styles.cardText}>Mesa: {orden.mesaID}</Text>
            <Text style={styles.cardText}>Plato: {orden.orderDetails[0].menuItemName}</Text>
            <Text style={styles.cardText}>Estado: {orden.orderDetails[0].estado}</Text>
            <Picker
              selectedValue={orden.orderDetails[0].estado || ''}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                handleUpdateStatus(orden.orderID, itemValue)
              }
            >
              <Picker.Item label="Preparando" value="preparando" />
              <Picker.Item label="Listo" value="listo" />
              <Picker.Item label="Cancelado" value="cancelado" />
            </Picker>
          </View>
        ))}
        <TouchableOpacity onPress={limpiarOrdenesListas} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Ocultar Órdenes Listas y Canceladas</Text>
        </TouchableOpacity>
        <View style={styles.pagination}>
          <TouchableOpacity onPress={() => setPaginaActual(Math.max(paginaActual - 10, 0))}>
            <Text>← Anterior</Text>
          </TouchableOpacity>
          <Text>Página {Math.floor(paginaActual / 10) + 1}</Text>
          <TouchableOpacity onPress={() => setPaginaActual(paginaActual + 10)}>
            <Text>Siguiente →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    elevation: 2, // For Android
    shadowColor: "#000", // For iOS
    shadowOffset: { width: 0, height: 2 }, // For iOS
    shadowOpacity: 0.1, // For iOS
    shadowRadius: 1.5, // For iOS
  },
  evenCard: {
    backgroundColor: "#F0F0F0",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 120 : 40,
    marginTop: 10,
  },
  clearButton: {
    backgroundColor: "#FD0202",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ChefVistas;
