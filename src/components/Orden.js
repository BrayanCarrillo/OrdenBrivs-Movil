import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Alert, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker'; // Importar Picker

const MenuItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={styles.menuItemText}>{item.menuItemName}</Text>
  </TouchableOpacity>
);

const CategoriaPlato = ({ categoria, onSelectPlato }) => (
  <View style={styles.categoriaContainer}>
    <Text style={styles.categoriaTitle}>{categoria.menuName}</Text>
    <View style={styles.menuItemsContainer}>
      {categoria.items.map(item => (
        <MenuItem key={item.itemID} item={item} onPress={() => onSelectPlato(item)} />
      ))}
    </View>
  </View>
);

const OrdenComponent = () => {
  const navigation = useNavigation();
  const [categoriasPlatos, setCategoriasPlatos] = useState([]);
  const [platosSeleccionados, setPlatosSeleccionados] = useState([]);
  const [mesaID, setMesaID] = useState('');
  const [mesas, setMesas] = useState([]); // Estado para las mesas
  const [totalCompra, setTotalCompra] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedPlato, setSelectedPlato] = useState(null);
  const [isQuantityModalVisible, setIsQuantityModalVisible] = useState(false);

  useEffect(() => {
    obtenerCategoriasPlatos();
    obtenerMesas(); // Obtener las mesas al cargar el componente
  }, []);

  const obtenerCategoriasPlatos = async () => {
    try {
      const response = await axios.get('https://evolving-man-proud.ngrok-free.app/api/categorias-platos');
      setCategoriasPlatos(response.data.categorias);
    } catch (error) {
      console.error('Error al obtener categorías y platos:', error);
    }
  };

  const obtenerMesas = async () => {
    try {
      const response = await axios.get('https://evolving-man-proud.ngrok-free.app/api/mesas');
      setMesas(response.data);
    } catch (error) {
      console.error('Error al obtener las mesas:', error);
    }
  };

  const seleccionarPlato = (plato) => {
    setSelectedPlato(plato);
    openQuantityModal();
  };

  const calcularTotalPedido = (platos) => {
    const total = platos.reduce((acumulador, plato) => acumulador + (plato.quantity * plato.price), 0);
    setTotalCompra(total);
  };

  const openQuantityModal = () => {
    setIsQuantityModalVisible(true);
  };

  const closeQuantityModal = () => {
    setIsQuantityModalVisible(false);
    setSelectedPlato(null);
    setSelectedQuantity(1);
  };

  const enviarOrden = async () => {
    try {
      if (mesaID === '' || platosSeleccionados.length === 0) {
        Alert.alert('Por favor, selecciona una mesa y al menos un plato para enviar la orden.');
        return;
      }
  
      const ordenData = {
        mesaID: parseInt(mesaID),
        items: platosSeleccionados.map(plato => ({
          itemID: plato.itemID,
          quantity: plato.quantity,
          menuID: plato.menuID
        }))
      };
  
      const response = await axios.post('https://evolving-man-proud.ngrok-free.app/api/insertar-orden', ordenData);
      console.log('Respuesta del servidor:', response.data);
  
      setPlatosSeleccionados([]);
      setMesaID('');
      setTotalCompra(0);
  
      Alert.alert('Orden enviada correctamente!');
    } catch (error) {
      console.error('Error al enviar la orden:', error);
      Alert.alert('Error al enviar la orden. Por favor, inténtalo de nuevo.');
    }
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

  const agregarPlatoConCantidad = () => {
    if (selectedPlato) {
      const platoConCantidad = { ...selectedPlato, quantity: selectedQuantity };
      setPlatosSeleccionados([...platosSeleccionados, platoConCantidad]);
      calcularTotalPedido([...platosSeleccionados, platoConCantidad]);
      closeQuantityModal();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isQuantityModalVisible}
          onRequestClose={closeQuantityModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccionar Cantidad</Text>
              <TextInput
                style={styles.quantityInput}
                placeholder="Cantidad"
                value={selectedQuantity.toString()}
                onChangeText={(text) => setSelectedQuantity(parseInt(text) || 0)}
                keyboardType="numeric"
              />
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity style={[styles.modalButton, styles.modalButtonAgregar]} onPress={agregarPlatoConCantidad}>
                  <Text style={styles.modalButtonText}>Agregar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancelar]} onPress={closeQuantityModal}>
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.menu}>
          <Text style={styles.title}>Menú</Text>
          {categoriasPlatos.map(categoria => (
            <CategoriaPlato
              key={categoria.menuID}
              categoria={categoria}
              onSelectPlato={seleccionarPlato}
            />
          ))}
          <View style={styles.platosSeleccionadosContainer}>
            <Text style={styles.platosSeleccionadosTitle}>Platos Seleccionados:</Text>
            {platosSeleccionados.map(plato => (
              <Text key={plato.itemID} style={styles.platoSeleccionadoText}>
                {plato.menuItemName} - Cantidad: {plato.quantity}
              </Text>
            ))}
          </View>
          <Text style={styles.totalCompra}>Total de la Compra: ${totalCompra}</Text>
          <Picker
            selectedValue={mesaID}
            onValueChange={(itemValue) => setMesaID(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione una mesa" value="" />
            {mesas.map(mesa => (
              <Picker.Item key={mesa.mesaID} label={`Mesa ${mesa.mesaID}`} value={mesa.mesaID} />
            ))}
          </Picker>
          <Button title="Enviar Orden" onPress={enviarOrden} />
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarContent}>
          <TouchableOpacity onPress={() => handleNavigation("Orden")}>
            <Icon name="pencil" size={30} color="#FFF" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigation("ListaOrdenes")}>
            <Icon name="clipboard" size={30} color="#FFF" style={styles.icon} />
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
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 25,
    paddingBottom: 60, // Espacio para la barra inferior
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  quantityInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
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
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#011',
    paddingVertical: 15
    ,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    zIndex: 100,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  bottomBarContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 10,
  },
  menu: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: 'left',
  },
  categoriaContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  categoriaTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  menuItemsContainer: {
    marginTop: 1,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#2C8CF3',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  platosSeleccionadosContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 20,
  },
  platosSeleccionadosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  platoSeleccionadoText: {
    fontSize: 16,
  },
  totalCompra: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  mesaInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  modalButton: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalButtonAgregar: {
    backgroundColor: '#2C8CF3',
  },
  modalButtonCancelar: {
    backgroundColor: '#dc3545',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OrdenComponent;
