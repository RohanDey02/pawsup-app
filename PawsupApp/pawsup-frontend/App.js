import React from "react";
import RootStack from "./navigators/RootStack";
import { StripeProvider } from "@stripe/stripe-react-native";

export default function App() {
    return (
        <StripeProvider publishableKey="pk_test_51JuLH0JReyjnby8oC8maNyfaVdFojSjYkPSXKnYjkC6FpeSYq8F28oAW6X4FzafORx4kUustkwvdB6kegnLh1RLL00AKUD17mC">
            <RootStack />
        </StripeProvider>
    );
}