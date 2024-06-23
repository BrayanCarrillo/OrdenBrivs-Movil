import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../src/components/Login";
import Orden from "../src/components/Orden";
import EmpleoPanel from "../src/components/EmpleoPanel";
import VistaAdmin from "../src/components/VistaAdmin";
import Menu from "../src/components/Menu";
import EmpleadosAdmin from "../src/components/EmpleadosAdmin";
import MesasAdmin from "../src/components/MesasAdmin";
import Ventas from "../src/components/Ventas";
import ListaOrdenes from "../src/components/ListaOrdenes";
import Ajustes from "../src/components/Ajustes";
import ChefVistas from "../src/components/ChefVistas";

const Stack = createNativeStackNavigator();

const MainStack = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false // Ocultar el header en todas las pantallas
                }}
            >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Orden" component={Orden} />
                <Stack.Screen name="EmpleoPanel" component={EmpleoPanel} />
                <Stack.Screen name="VistaAdmin" component={VistaAdmin} />
                <Stack.Screen name="Menu" component={Menu} />
                <Stack.Screen name="EmpleadosAdmin" component={EmpleadosAdmin} />
                <Stack.Screen name="MesasAdmin" component={MesasAdmin} />
                <Stack.Screen name="Ventas" component={Ventas} />
                <Stack.Screen name="ListaOrdenes" component={ListaOrdenes} />
                <Stack.Screen name='Ajustes' component={Ajustes} />
                <Stack.Screen name="ChefVistas" component={ChefVistas}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default MainStack;
