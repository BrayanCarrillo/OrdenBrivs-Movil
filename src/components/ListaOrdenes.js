import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ListaOrdenes = ({ }) => {
  const navigation = useNavigation();
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const response = await axios.get('https://evolving-man-proud.ngrok-free.app/api/ordenes/listas');
        const ordenesListas = response.data.ordenes.filter(orden => orden.estado === 'listo');
        setOrdenes(ordenesListas.slice(0, 5));
      } catch (error) {
        console.error('Error fetching órdenes:', error);
      }
    };

    fetchOrdenes();
  }, []);

  const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }]
    });
  };

  const renderOrdenItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.highlight}>
        <Text style={styles.bold}>Orden ID:</Text> {item.orderID}
      </Text>
      <Text style={styles.highlight}>
        <Text style={styles.bold}>Estado:</Text> {item.estado}
      </Text>
      <Text style={styles.highlight}>
        <Text style={styles.bold}>Total:</Text> {item.total}
      </Text>
      <Text style={styles.highlight}>
        <Text style={styles.bold}>Fecha de orden:</Text> {item.fecha_orden}
      </Text>
      <Text style={styles.highlight}>
        <Text style={styles.bold}>Mesa ID:</Text> {item.mesaID}
      </Text>
    </View>
  );

  return (   
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Lista de Órdenes</Text>
          {ordenes.map((item, index) => (
            <View key={index} style={styles.ordenContainer}>
              {renderOrdenItem({ item })}
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => handleNavigation("Orden")} style={styles.bottomBarButton}>
          <Icon name="pencil" size={30} color="#FFF" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation("ListaOrdenes")} style={styles.bottomBarButton}>
          <Icon name="clipboard" size={30} color="#FFF" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.bottomBarButton}>
          <Icon name="sign-out" size={30} color="#FFF" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 45,
    paddingBottom: 60, // Espacio para la barra inferior
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  ordenContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  highlight: {
    fontSize: 16,
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#011',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -2 }, // Cambiado a -2 para sombra hacia arriba
    shadowRadius: 2,
    zIndex: 100,
  },
  bottomBarButton: {
    marginHorizontal: 10,
  },
  icon: {
    marginHorizontal: 43,
  },
});

export default ListaOrdenes;
