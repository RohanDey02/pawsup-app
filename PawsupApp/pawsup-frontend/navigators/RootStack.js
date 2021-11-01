import React from 'react';

// Colours
import { Colours } from './../components/styles';
const { darkLight, brand, primary, tertiary, secondary } = Colours;

// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import Login from './../screens/Login';
import Signup from './../screens/Signup';
import AdminMain from './../screens/AdminMain';
import PetOwnerMain from './../screens/PetOwnerMain';
import PetSitterMain from './../screens/PetSitterMain';
import Services from './../screens/Services';
import Setting from './../screens/Setting';
import PetSitterModifyListing from '../screens/PetSitterModifyListing';
import DetailedListing from '../screens/DetailedListing';
import UpcomingAppointment from '../screens/UpcomingAppointment';
import AdminAddProduct from '../screens/AdminAddProduct';
import AdminRemoveProduct from '../screens/AdminRemoveProduct';

const Stack = createStackNavigator();

const RootStack = () => {
    return (
        <NavigationContainer style={{ backgroundColor: 'red' }}>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: 'transparent',
                    },
                    headerTintColor: tertiary,
                    headerTransparent: true,
                    headerTitle: '',
                    headerLeftContainerStyle: {
                        paddingLeft: 20,
                    },
                }}
                initialRouteName="Login"
            >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="PetOwnerMain" component={PetOwnerMain} />
                <Stack.Screen name="Services" component={Services} />
                <Stack.Screen name="AdminMain" component={AdminMain} />
                <Stack.Screen name="PetSitterMain" component={PetSitterMain} />
                <Stack.Screen name="Settings" component={Setting} />
                <Stack.Screen name="PetSitterModifyListing" component={PetSitterModifyListing} />
                <Stack.Screen name="DetailedListing" component={DetailedListing} />
                <Stack.Screen name="UpcomingAppointment" component={UpcomingAppointment} />
                <Stack.Screen name="AdminAddProduct" component={AdminAddProduct} />
                <Stack.Screen name="AdminRemoveProduct" component={AdminRemoveProduct} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootStack;

