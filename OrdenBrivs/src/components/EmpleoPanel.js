import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

const EmpleoPanel = () => {
  const mesas = [
    { id: 1, nombre: "Mesa 1", ordenId: 101 },
    { id: 2, nombre: "Mesa 2", ordenId: 102 },
    { id: 3, nombre: "Mesa 3", ordenId: 103 },
  ];

  const ordenes = [
    { id: 101, mesaId: 1, estado: "En proceso" },
    { id: 102, mesaId: 2, estado: "Listo" },
    { id: 103, mesaId: 3, estado: "Listo" },
  ];

  const handleEliminarOrden = (ordenId) => {
    console.log(`Eliminar orden con ID: ${ordenId}`);
  };

  const renderOrdenItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleEliminarOrden(item.id)}>
      <View style={[styles.itemContainer, { backgroundColor: item.estado === "Listo" ? "#0BBD1467" : "#F6EF139C" }]}>
        <Text style={styles.itemText}>Mesa: {item.mesaId}</Text>
        <Text style={styles.itemText}>Estado: {item.estado}</Text>
        {item.estado === "Listo" && (
          <Icon name="trash" size={20} color="#FFF" />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderMesaItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Mesa: {item.nombre}</Text>
      <Text style={styles.itemText}>ID de Orden: {item.ordenId}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de Empleo</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Lista de Órdenes</Text>
        <FlatList
          data={ordenes}
          renderItem={renderOrdenItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Mesas</Text>
        <FlatList
          data={mesas}
          renderItem={renderMesaItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#E8E6E6",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    width: "100%",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  itemContainer: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
});

export default EmpleoPanel;
