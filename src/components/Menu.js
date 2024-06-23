import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, TextInput, Modal, Alert, Switch } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { useNavigation } from '@react-navigation/native';

const Menu = () => {
    const navigation = useNavigation();
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryActivate, setNewCategoryActivate] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [platos, setPlatos] = useState([]);
    const [loadingPlatos, setLoadingPlatos] = useState(true);
    const [newPlatoName, setNewPlatoName] = useState('');
    const [newPlatoPrice, setNewPlatoPrice] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null); 
    const [editPlatoModalVisible, setEditPlatoModalVisible] = useState(false);
    const [editPlatoId, setEditPlatoId] = useState(null);
    const [editPlatoName, setEditPlatoName] = useState('');
    const [editPlatoPrice, setEditPlatoPrice] = useState('');
    const [editCategoryModalVisible, setEditCategoryModalVisible] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch("https://evolving-man-proud.ngrok-free.app/api/menu-categories");
            const data = await response.json();
            setCategories(data);
            setLoadingCategories(false);
        } catch (error) {
            console.error("Error al obtener las categorías:", error);
            setLoadingCategories(false);
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
    const addCategory = async () => {
        try {
            const response = await fetch("https://evolving-man-proud.ngrok-free.app/api/menu-categories", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    nombre: newCategoryName,
                    activate: newCategoryActivate
                }),
            });
            if (response.ok) {
                const data = await response.json();
                setCategories([...categories, data]);
                setNewCategoryName('');
                setNewCategoryActivate(false);
                Alert.alert('Éxito', '¡Categoría agregada exitosamente!');
            } else {
                throw new Error('Error al agregar la categoría');
            }
        } catch (error) {
            console.error("Error al agregar la categoría:", error);
        }
    };

    const editCategory = async () => {
        try {
            const response = await fetch(`https://evolving-man-proud.ngrok-free.app/api/menu-categories/${editCategoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    nombre: editCategoryName 
                }),
            });
            if (response.ok) {
                const updatedCategories = categories.map(category => {
                    if (category.menuID === editCategoryId) {
                        return { ...category, menuName: editCategoryName };
                    }
                    return category;
                });
                setCategories(updatedCategories);
                setEditCategoryModalVisible(false);
                Alert.alert('Éxito', '¡Categoría editada exitosamente!');
            } else {
                throw new Error('Error al editar la categoría');
            }
        } catch (error) {
            console.error("Error al editar la categoría:", error);
            Alert.alert('Error', 'Ocurrió un error al editar la categoría. Por favor, inténtalo de nuevo.');
        }
    };

    const deleteCategory = async (categoryId) => {
        try {
            const response = await fetch(`https://evolving-man-proud.ngrok-free.app/api/menu-categories/${categoryId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const updatedCategories = categories.filter(category => category.menuID !== categoryId);
                setCategories(updatedCategories);
                Alert.alert('Éxito', '¡Categoría eliminada exitosamente!');
            } else {
                throw new Error('Error al eliminar la categoría');
            }
        } catch (error) {
            console.error("Error al eliminar la categoría:", error);
        }
    };

    const handleEditCategory = (categoryId, categoryName) => {
        setEditCategoryId(categoryId);
        setEditCategoryName(categoryName);
        setEditCategoryModalVisible(true);
    };

    const saveEditedCategory = () => {
        editCategory();
    };

    const cancelEditCategory = () => {
        setEditCategoryModalVisible(false);
        setEditCategoryName('');
    };

    const fetchPlatosPorCategoria = async (menuID) => {
        try {
            const response = await fetch(`https://evolving-man-proud.ngrok-free.app/api/menu-platos/categoria/${menuID}`);
            const data = await response.json();
            setPlatos(data);
            setLoadingPlatos(false);
        } catch (error) {
            console.error("Error al obtener los platos por categoría:", error);
            setLoadingPlatos(false);
        }
    };

    const handleCategoryPress = (menuID) => {
        setSelectedCategory(menuID);
        fetchPlatosPorCategoria(menuID);
    };

    const addPlato = async () => {
        try {
            const response = await fetch("https://evolving-man-proud.ngrok-free.app/api/menu-platos", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    menuItemName: newPlatoName, 
                    price: parseFloat(newPlatoPrice),
                    menuID: selectedCategory 
                }),
            });
            if (response.ok) {
                const data = await response.json();
                setPlatos([...platos, data]);
                setNewPlatoName('');
                setNewPlatoPrice('');
                Alert.alert('Éxito', '¡Plato agregado exitosamente!');
            } else {
                throw new Error('Error al agregar el plato');
            }
        } catch (error) {
            console.error("Error al agregar el plato:", error);
        }
    };

    const editPlato = async () => {
        try {
            const response = await fetch(`https://evolving-man-proud.ngrok-free.app/api/menu-platos/${editPlatoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre: editPlatoName, precio: editPlatoPrice }),
            });
            if (response.ok) {
                const updatedPlatos = platos.map(plato => {
                    if (plato.itemID === editPlatoId) {
                        return { ...plato, menuItemName: editPlatoName, price: editPlatoPrice };
                    }
                    return plato;
                });
                setPlatos(updatedPlatos);
                setEditPlatoModalVisible(false);
                Alert.alert('Éxito', '¡Plato editado exitosamente!');
            } else {
                throw new Error('Error al editar el plato');
            }
        } catch (error) {
            console.error("Error al editar el plato:", error);
            Alert.alert('Error', 'Ocurrió un error al editar el plato. Por favor, inténtalo de nuevo.');
        }
    };

    const deletePlato = async (platoId) => {
        try {
            const response = await fetch(`https://evolving-man-proud.ngrok-free.app/api/menu-platos/${platoId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const updatedPlatos = platos.filter(plato => plato.itemID !== platoId);
                setPlatos(updatedPlatos);
                Alert.alert('Éxito', '¡Plato eliminado exitosamente!');
            } else {
                throw new Error('Error al eliminar el plato');
            }
        } catch (error) {
            console.error("Error al eliminar el plato:", error);
        }
    };

    const openEditPlatoModal = (platoId, platoName, platoPrice) => {
        setEditPlatoId(platoId);
        setEditPlatoName(platoName);
        setEditPlatoPrice(platoPrice);
        setEditPlatoModalVisible(true);
    };

    const renderItem = ({ item }) => (
        <View style={styles.platoItem}>
            <Text style={styles.platoName}>{item.menuItemName}</Text>
            <Text style={styles.price}>Precio: {item.price}</Text>
            <View style={styles.platoActions}>
                <TouchableOpacity onPress={() => openEditPlatoModal(item.itemID, item.menuItemName, item.price)}>
                    <Icon name="edit" size={20} color="#3399FF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deletePlato(item.itemID)}>
                    <Icon name="trash" size={20} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderPlatoCard = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.menuItemName}</Text>
            <Text style={styles.cardPrice}>Precio: {item.price}</Text>
            <View style={styles.cardActions}>
                <TouchableOpacity style={styles.cardButton} onPress={() => openEditPlatoModal(item.itemID, item.menuItemName, item.price)}>
                    <Text style={styles.cardButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.cardButton, { backgroundColor: '#FF6666' }]} onPress={() => deletePlato(item.itemID)}>
                    <Text style={styles.cardButtonText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderCategoryCard = ({ item }) => (
        <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress(item.menuID)}>
            <Text style={styles.categoryCardText}>{item.menuName}</Text>
            <View style={styles.categoryActions}>
                <TouchableOpacity onPress={() => handleEditCategory(item.menuID, item.menuName)}>
                    <Icon name="edit" size={20} color="#3399FF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteCategory(item.menuID)}>
                    <Icon name="trash" size={20} color="red" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Menú de Categorías y Platos</Text>
                <View style={styles.categoryContainer}>
                    <Text style={styles.subtitle}>Categorías</Text>
                    <FlatList
                        data={categories}
                        renderItem={renderCategoryCard}
                        keyExtractor={(item) => item.menuID.toString()} // Asegúrate de que las claves sean únicas
                        // Cambiando de horizontal a vertical
                        horizontal={false} // Esto asegura que funcione en Android también
                        numColumns={1}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Nueva Categoría"
                        value={newCategoryName}
                        onChangeText={setNewCategoryName}
                    />
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>Activar:</Text>
                        <Switch
                            value={newCategoryActivate}
                            onValueChange={setNewCategoryActivate}
                        />
                    </View>
                    <TouchableOpacity style={styles.addButton} onPress={addCategory}>
                        <Text style={styles.addButtonText}>Agregar Categoría</Text>
                    </TouchableOpacity>
                </View>
                {selectedCategory && (
                    <View style={styles.platoContainer}>
                        <Text style={styles.subtitle}>Platos</Text>
                        <FlatList
                            data={platos}
                            renderItem={renderPlatoCard}
                            keyExtractor={(item) => item.itemID.toString()} // Asegúrate de que las claves sean únicas
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Nuevo Plato"
                            value={newPlatoName}
                            onChangeText={setNewPlatoName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Precio"
                            value={newPlatoPrice}
                            onChangeText={setNewPlatoPrice}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity style={styles.addButton} onPress={addPlato}>
                            <Text style={styles.addButtonText}>Agregar Plato</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <Modal visible={editCategoryModalVisible} animationType="slide">
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Editar Categoría</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Nombre de la Categoría"
                            value={editCategoryName}
                            onChangeText={setEditCategoryName}
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.modalButton} onPress={saveEditedCategory}>
                                <Text style={styles.modalButtonText}>Guardar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#FF6666' }]} onPress={cancelEditCategory}>
                            <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal visible={editPlatoModalVisible} animationType="slide">
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Editar Plato</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Nombre del Plato"
                            value={editPlatoName}
                            onChangeText={setEditPlatoName}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Precio del Plato"
                            value={editPlatoPrice}
                            onChangeText={setEditPlatoPrice}
                            keyboardType="numeric"
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.modalButton} onPress={editPlato}>
                                <Text style={styles.modalButtonText}>Guardar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#FF6666' }]} onPress={() => setEditPlatoModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
            <View style={styles.bottomBar}>
                {/* Aquí colocarás los elementos de tu barra inferior */}
                <View style={styles.bottomBarContent}>
                <TouchableOpacity onPress={() => handleNavigation("VistaAdmin")}>
                    <Icon name="user-circle" size={30} color="#FFF" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigation("Ajustes")}>
          <Icon name="cogs" size={30} color="#FFF" style={styles.icon} />
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F0F0",
    },
    scrollContainer: {
        flexGrow: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    categoryContainer: {
        marginBottom: 20,
    },
    platoContainer: {
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#3399FF',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 5,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardPrice: {
        fontSize: 16,
        color: '#777',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    cardButton: {
        backgroundColor: '#3399FF',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    cardButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    categoryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 5,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryCardText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    categoryActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 60,
    },
    platoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        paddingVertical: 10,
    },
    platoName: {
        fontSize: 16,
    },
    price: {
        fontSize: 16,
        color: '#777',
    },
    platoActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 60,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        backgroundColor: '#3399FF',
        borderRadius: 5,
        padding: 10,
        alignItems:
        'center',
        flex: 1,
        marginHorizontal: 5,
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
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
});

export default Menu;
