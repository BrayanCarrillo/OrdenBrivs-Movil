import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import VistaAdmin from "../src/components/VistaAdmin";
import Menu from "../src/components/Menu";
import EmpleadosAdmin from "../src/components/EmpleadosAdmin";
import MesasAdmin from "../src/components/MesasAdmin";
import Ventas from "../src/components/Ventas";
import Ajustes from "../src/components/Ajustes";

const Stack = createNativeStackNavigator();

const AdminStack = () => {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator>
                <Stack.Screen name="VistaAdmin" component={VistaAdmin} />
                <Stack.Screen name="Menu" component={Menu} />
                <Stack.Screen name="EmpleadosAdmin" component={EmpleadosAdmin} />
                <Stack.Screen name="MesasAdmin" component={MesasAdmin} />
                <Stack.Screen name="Ventas" component={Ventas} />
                <Stack.Screen name='Ajustes' component={Ajustes}/>




            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AdminStack;
