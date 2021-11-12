import React, { useState } from "react";
import { View, StyleSheet, TextInput, Alert, ImageBackground } from "react-native";
import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";

import {
    BackgroundStyle,
    PageTitleCheckout,
    StyledButton,
    ButtonText,
    SubTitleCheckout,
} from './../components/styles';

const Checkout = ({ navigation, route }) => {
    console.log(route);
    const [email, setEmail] = useState();
    const [cardDetails, setCardDetails] = useState();
    const { confirmPayment, loading } = useConfirmPayment();

    const fetchPaymentIntentClientSecret = async (amount) => {
        const response = await fetch("https://protected-shelf-96328.herokuapp.com/api/createPaymentIntent?amount=" + amount, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const { status, message, data } = await response.json();
        return { status, message, data };
    };

    const handlePayPress = async (amount) => {
        // Gather the customer's billing information (e.g., email)
        if (!cardDetails?.complete || !email) {
            Alert.alert("Please Enter Complete Card Details and Email");
            return;
        }
        const billingDetails = {
            email: email,
        };
        try {
            const { status, message, data } = await fetchPaymentIntentClientSecret(amount);
            //2. confirm the payment
            if (status !== "SUCCESS") {
                console.log("Unable to process payment");
            } else {
                const { paymentIntent, error } = await confirmPayment(data, {
                    type: "Card",
                    billingDetails: billingDetails,
                });
                if (error) {
                    alert(`Payment Confirmation Error: ${error.message}`);
                } else if (paymentIntent) {
                    alert(message);
                    console.log("Payment successful\n", paymentIntent);
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    var x = "$422"
    var y = x.substring(1);
    return (
        <ImageBackground
            source={require('./../assets/WallpapersAndLogo/MainPageDirectory.png')} resizeMode="cover" style={BackgroundStyle.image}>
            <View style={styles.container}>
                <PageTitleCheckout style={{marginBottom: 5}}>Pawsup Checkout</PageTitleCheckout>
                <SubTitleCheckout style={{marginBottom: 50}}>Price: {x}</SubTitleCheckout>
                <TextInput
                    autoCapitalize="none"
                    placeholder="E-mail"
                    keyboardType="email-address"
                    onChange={value => setEmail(value.nativeEvent.text)}
                    style={styles.input}
                />
                <CardField
                    postalCodeEnabled={true}
                    placeholder={{
                        number: "4242 4242 4242 4242",
                    }}
                    cardStyle={styles.card}
                    style={styles.cardContainer}
                    onCardChange={cardDetails => {
                        setCardDetails(cardDetails);
                    }}
                />
                <StyledButton onPress={() => handlePayPress(y*100)} disabled={loading} >
                    <ButtonText>Pay</ButtonText>
                </StyledButton>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
        marginTop: 80
    },
    input: {
        backgroundColor: "#efefefef",
        borderRadius: 8,
        fontSize: 20,
        height: 50,
        padding: 10,
    },
    card: {
        backgroundColor: "#efefefef",
    },
    cardContainer: {
        height: 50,
        marginVertical: 30,
    },
});

export default Checkout;