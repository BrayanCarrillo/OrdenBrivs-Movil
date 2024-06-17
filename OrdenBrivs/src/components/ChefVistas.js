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
      const ordenesFiltradas = response.data.orders.filter(orden => orden.orderDetails.length > 0 && orden.orderDetails[0].menuItemName);
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
        <Table style={styles.tableContainer}>
          <Row data={["Número de Orden", "Mesa", "Plato", "Estado"]} style={styles.head} textStyle={styles.headText}/>
          {ordenesPaginadas.map((orden, index) => (
            <Row
              key={index}
              data={[
                orden.orderID,
                orden.mesaID,
                orden.orderDetails[0].menuItemName || '',
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
              ]}
              style={[styles.row, index % 2 === 0 ? styles.evenRow : null]}
              textStyle={styles.text}
            />
          ))}
        </Table>
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
    paddingTop:50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  head: { height: 40, backgroundColor: "#2C8CF3" },
  headText: { fontWeight: "bold", textAlign: "center", color: "#fff" },
  text: { textAlign: "center" },
  row: { height: 40 },
  evenRow: { backgroundColor: "#C6E3FD" },
  picker: {
    width: 150,
    height: Platform.OS === 'ios' ? 120 : 40, // Ajuste de altura para iOS
  },

  tableContainer: { // Cambia el color del borde según lo necesites
    marginBottom: 20,
    borderRadius: 5,
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
    alignItems: "center", // Alinear elementos verticalmente
  },
});

export default ChefVistas;
