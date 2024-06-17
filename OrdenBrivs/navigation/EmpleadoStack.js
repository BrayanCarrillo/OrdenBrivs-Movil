import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Orden from "../src/components/Orden";
import EmpleoPanel from "../src/components/EmpleoPanel";
import ListaOrdenes from "../src/components/ListaOrdenes";
import Ajustes from "../src/components/Ajustes";

const Stack = createNativeStackNavigator();

const EmpleadoStack = () => {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator>
                <Stack.Screen name="Orden" component={Orden} />
                <Stack.Screen name="EmpleoPanel" component={EmpleoPanel} />
                <Stack.Screen name="ListaOrdenes" component={ListaOrdenes} />
                <Stack.Screen name='Ajustes' component={Ajustes}/>

            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default EmpleadoStack;
