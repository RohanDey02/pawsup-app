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
import Welcome from './../screens/Welcome';

const Stack = createStackNavigator();

// Credentials Context
import { CredentialsContext } from './../components/CredentialsContext';

const RootStack = () => {
    return (
        // <CredentialsContext.Consumer>
        // {({ storedCredentials }) => (
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
                {/* {storedCredentials ? (
                <Stack.Screen
                    options={{
                    headerTintColor: primary,
                    }}
                    name="Login"
                    component={Login}
                />
                ) :(
                <>
                    <Stack.Screen name="Signup" component={Signup} />
                </>
                )} */}
            </Stack.Navigator>
            </NavigationContainer>
        // )}
        // </CredentialsContext.Consumer>
    );
};

export default RootStack;

