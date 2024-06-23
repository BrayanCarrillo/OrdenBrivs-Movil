import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const VistaAdmin = () => {
  const [data, setData] = useState({ ordenes: [], empleados: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://evolving-man-proud.ngrok-free.app/api/ordenes/listas');
        const ordenes = response.data.ordenes.filter(orden => orden.estado === 'listo'); // Filtrar solo órdenes en estado "listo"
        const empleadosResponse = await axios.get('https://evolving-man-proud.ngrok-free.app/api/empleados');
        const empleados = empleadosResponse.data.empleados.map(empleado => ({
          ...empleado,
          status: empleado.status === 1 ? 'Activo' : 'Inactivo' // Ajustar estado del empleado
        }));
        setData({ ordenes, empleados });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

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
        <TouchableOpacity onPress={() => handleNavigation("Ajustes")}>
          <Icon name="cogs" size={30} color="#FFF" style={styles.icon} />
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

  const renderPagination = () => (
    <View style={styles.pagination}>
      <TouchableOpacity
        onPress={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
        disabled={currentPage === 1}
        style={styles.paginationButton}
      >
        <Text style={styles.paginationText}>Anterior</Text>
      </TouchableOpacity>
      <Text style={styles.paginationText}>{currentPage}</Text>
      <TouchableOpacity
        onPress={() =>
          setCurrentPage(currentPage < Math.ceil(data.ordenes.length / itemsPerPage) ? currentPage + 1 : currentPage)
        }
        disabled={currentPage === Math.ceil(data.ordenes.length / itemsPerPage)}
        style={styles.paginationButton}
      >
        <Text style={styles.paginationText}>Siguiente</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrdenes = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const ordenesToShow = data.ordenes.slice(startIndex, endIndex);

    return (
      <View>
        <Text style={styles.subtitle}>Últimas Órdenes</Text>
        {ordenesToShow.length === 0 ? (
          <Text style={styles.noData}>No hay órdenes disponibles</Text>
        ) : (
          <FlatList
            data={ordenesToShow}
            renderItem={({ item }) => (
              <View style={styles.orderItem}>
                <Text style={styles.orderID}>Orden ID: {item.orderID}</Text>
                <Text style={styles.orderDetails}>Estado: {item.estado}</Text>
                <Text style={styles.orderDetails}>Total: {item.total}</Text>
                <Text style={styles.orderDetails}>Fecha de orden: {new Date(item.fecha_orden).toLocaleDateString()}</Text>
                <Text style={styles.orderDetails}>Mesa ID: {item.mesaID}</Text>
                <Text style={styles.orderDetails}>Nombre del Plato: {item.menuItemName}</Text>
              </View>
            )}
            keyExtractor={item => item.orderID}
          />
        )}
        {renderPagination()}
      </View>
    );
  };

  const renderEmpleados = () => (
    <View>
      <Text style={styles.subtitle}>Empleados</Text>
      <FlatList
        data={data.empleados}
        renderItem={({ item }) => (
          <View style={styles.employeeCard}>
            <View style={styles.employeeInfo}>
              <Text style={styles.employeeName}>{item.username}</Text>
              <Text style={[styles.employeeStatus, { color: item.status === 'Activo' ? 'green' : 'red' }]}>
                {item.status === 'Activo' ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={item => item.staffID}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Administrador</Text>
          {renderOrdenes()}
          {renderEmpleados()}
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
    paddingTop: 35,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    marginTop: 10,
    paddingBottom: 60, // Para dar espacio al bottom bar
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  noData: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
  },
  orderItem: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  orderID: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orderDetails: {
    marginBottom: 5,
  },
  employeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  employeeStatus: {
    fontSize: 14,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  bottomBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    marginHorizontal: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationButton: {
    padding: 10,
  },
  paginationText: {
    fontSize: 16,
    color: '#333',
  },
});

export default VistaAdmin;
