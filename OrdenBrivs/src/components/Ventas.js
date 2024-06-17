import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert, Modal, Button } from "react-native";
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { useNavigation } from '@react-navigation/native';

const ListaVentas = () => {
  const navigation = useNavigation();
  const [ordenes, setOrdenes] = useState([]);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [gananciasHoy, setGananciasHoy] = useState(null);
  const [gananciasSemana, setGananciasSemana] = useState(null);
  const [gananciasMes, setGananciasMes] = useState(null);
  const [gananciasTodoElTiempo, setGananciasTodoElTiempo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchOrdenes();
    fetchGanancias();
  }, []);

  const fetchOrdenes = async () => {
    try {
      const response = await axios.get('https://evolving-man-proud.ngrok-free.app/api/ordenes');
      setOrdenes(response.data.ordenes);
    } catch (error) {
      console.error('Error fetching ordenes:', error);
    }
  };

  const fetchGanancias = async () => {
    try {
      const [hoy, semana, mes, todoElTiempo] = await Promise.all([
        axios.get('https://evolving-man-proud.ngrok-free.app/api/ganancias/hoy'),
        axios.get('https://evolving-man-proud.ngrok-free.app/api/ganancias/semana'),
        axios.get('https://evolving-man-proud.ngrok-free.app/api/ganancias/mes'),
        axios.get('https://evolving-man-proud.ngrok-free.app/api/ganancias/todo-el-tiempo')
      ]);
      setGananciasHoy(hoy.data.ganancias);
      setGananciasSemana(semana.data.ganancias);
      setGananciasMes(mes.data.ganancias);
      setGananciasTodoElTiempo(todoElTiempo.data.ganancias);
    } catch (error) {
      console.error('Error fetching ganancias:', error);
    }
  };

  const handleOrdenPress = (orden) => {
    setSelectedOrden(orden);
    setModalVisible(true);
  };

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
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Lista de Ordenes Vendidas</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ganancias Hoy</Text>
          <Text style={styles.cardText}>Ganancias: ${gananciasHoy !== null && parseFloat(gananciasHoy) !== 0 ? parseFloat(gananciasHoy).toFixed(2) : '0.00'}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ganancias Semana</Text>
          <Text style={styles.cardText}>Ganancias: ${gananciasSemana !== null && parseFloat(gananciasSemana) !== 0 ? parseFloat(gananciasSemana).toFixed(2) : '0.00'}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ganancias Mes</Text>
          <Text style={styles.cardText}>Ganancias: ${gananciasMes !== null && parseFloat(gananciasMes) !== 0 ? parseFloat(gananciasMes).toFixed(2) : '0.00'}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ganancias Todo el Tiempo</Text>
          <Text style={styles.cardText}>Ganancias: ${gananciasTodoElTiempo !== null && parseFloat(gananciasTodoElTiempo) !== 0 ? parseFloat(gananciasTodoElTiempo).toFixed(2) : '0.00'}</Text>
        </View>
        <FlatList
          data={ordenes}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => handleOrdenPress(item)}>
              <Text style={styles.text}>Número de Orden: {item['Numero de Orden']}</Text>
              <Text style={styles.text}>Menú: {item['Menu']}</Text>
              <Text style={styles.text}>Nombre del Plato: {item['Nombre del Plato']}</Text>
              <Text style={styles.text}>Cantidad: {item['Cantidad']}</Text>
              <Text style={styles.text}>Estado: {item['Estado']}</Text>
              <Text style={styles.text}>Total (COP): {item['Total (COP)']}</Text>
              <Text style={styles.text}>Fecha: {item['Fecha']}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item['Numero de Orden'].toString()}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Detalles de la Orden</Text>
              {selectedOrden && (
                <ScrollView style={styles.cardContent}>
                  <Text style={styles.cardText}>Número de Orden: {selectedOrden['Numero de Orden']}</Text>
                  <Text style={styles.cardText}>Menú: {selectedOrden['Menu']}</Text>
                  <Text style={styles.cardText}>Nombre del Plato: {selectedOrden['Nombre del Plato']}</Text>
                  <Text style={styles.cardText}>Cantidad: {selectedOrden['Cantidad']}</Text>
                  <Text style={styles.cardText}>Estado: {selectedOrden['Estado']}</Text>
                  <Text style={styles.cardText}>Total (COP): {selectedOrden['Total (COP)']}</Text>
                  <Text style={styles.cardText}>Fecha: {selectedOrden['Fecha']}</Text>
                </ScrollView>
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Cerrar Detalles</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
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
          <TouchableOpacity onPress={() => handleNavigation("MesasAdmin")}>
            <Icon name="table" size={30} color="#FFF" style={styles.icon} />
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
    backgroundColor: "#f0f0f0",
    paddingTop:25,
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
    marginHorizontal: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  item: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: '#555',
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  cardContent: {
    maxHeight: 200,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#2C8CF3",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    width: '100%',
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    
  },
});

export default ListaVentas;
