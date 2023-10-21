import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, Alert, ImageBackground } from "react-native";
// import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";

import {
    BackgroundStyle,
    StyledButton,
    ButtonText,
} from './../components/styles';

// Axios
import axios from 'axios';
import SERVER_URL from "../server-url";

const Checkout = ({ navigation, route }) => {
    const [email, setEmail] = useState();
    const [cardDetails, setCardDetails] = useState();
    const [price, setPrice] = useState();
    // const { confirmPayment, loading } = useConfirmPayment();
    const [firstRender, setFirstRender] = useState(false);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

    // Handle Purchasing Items
    const handleCart = () => {
        // const url = "https://protected-shelf-96328.herokuapp.com/api/itemCheckout";
        const url = `http://${SERVER_URL}/api/itemCheckout`;
        var values = {email: route.params.routeParams.email};
        axios
            .put(url, values)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;
                console.log(message);
                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                } else {
                    console.log("Purchase Successful");
                }
            })
            .catch((error) => {
                handleMessage('An error occurred. Check your network and try again');
            })
    }
    
    const handleBooking = () => {
        handleMessage(null);
        // const url = "https://protected-shelf-96328.herokuapp.com/api/makeBooking";
        const url = `http://${SERVER_URL}/api/makeBooking`;
        var values = {listingowner: route.params.listingemail, reason: route.params.reason, cost: route.params.cost, startdate: route.params.startdate, enddate: route.params.enddate}

        axios
            .put(url, values)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;
                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                } else {
                    console.log("Booking Successful");
                }
            })
            .catch((error) => {
                setSubmitting(false);
                handleMessage('An error in booking occurred. Check your network and try again');
            });
    }

    const fetchPaymentIntentClientSecret = async (amount) => {
        const response = await fetch(`http://${SERVER_URL}/api/createPaymentIntent?amount=` + amount, {
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
                // const { paymentIntent, error } = await confirmPayment(data, {
                //     type: "Card",
                //     billingDetails: billingDetails,
                // });
                if (error) {
                    alert(`Payment Confirmation Error: ${error.message}`);
                } else if (paymentIntent) {
                    if(route.params.checkoutType == "CART") {
                        console.log("Payment successful\n", paymentIntent);
                        handleCart();
                        
                        // Cleanup Data
                        delete route.params.checkoutType;

                        if(route.params.routeParams.accounttype == "Petowner") {
                            Alert.alert('SUCCESS', message, [
                                {text: 'OK', onPress: () => navigation.navigate('PetOwnerMain', route.params.routeParams)}
                            ]);
                        } else if(route.params.routeParams.accounttype == "Petsitter") {
                            Alert.alert('SUCCESS', message, [
                                {text: 'OK', onPress: () => navigation.navigate('PetSitterMain', route.params.routeParams)}
                            ]);
                        }
                        
                    } else if(route.params.checkoutType == "BOOKING") {
                        console.log("Payment successful\n", paymentIntent);
                        handleBooking();

                        // Cleanup Data
                        delete route.params.checkoutType;
                        delete route.params.listingemail;
                        delete route.params.reason;
                        delete route.params.cost;
                        delete route.params.startdate;
                        delete route.params.enddate;

                        if(route.params.routeParams.accounttype == "Petowner") {
                            Alert.alert('SUCCESS', message, [
                                {text: 'OK', onPress: () => navigation.navigate('PetOwnerMain', route.params.routeParams)}
                            ]);
                        } else if(route.params.routeParams.accounttype == "Petsitter") {
                            Alert.alert('SUCCESS', message, [
                                {text: 'OK', onPress: () => navigation.navigate('PetSitterMain', route.params.routeParams)}
                            ]);
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    // Get the cart
    const handleGetCart = (email) => {
        // const url = "https://protected-shelf-96328.herokuapp.com/api/getInCart?email=" + email;
        const url = `http://${SERVER_URL}/api/getInCart?email=` + email;
        axios
            .get(url)
            .then((response) => {
                const result = response.data;
                const { status, message, data, totalPrice } = result;
                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                } else {
                    if(totalPrice>=0){
                        setPrice(totalPrice);
                    } else{
                        setPrice(0);
                    }
                }
            })
            .catch((error) => {
                handleMessage('An error occurred. Check your network and try again');
            });
    };

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    };

    if(route.params.checkoutType == "CART"){
        useEffect(() => {
            if(!firstRender) {
                handleGetCart(route.params.routeParams.email);
                setFirstRender(true);
            }
        });
    } else if(route.params.checkoutType == "BOOKING"){
        useEffect(() => {
            if(!firstRender) {
                setPrice(route.params.cost);
                setFirstRender(true);
            }
        });
    }

    return (
        <ImageBackground
            source={require('./../assets/WallpapersAndLogo/CheckoutPage.png')} resizeMode="cover" style={BackgroundStyle.image}>
            <View style={styles.container}>
            <Text style={styles.titleText}>Pawsup Checkout</Text>
                <Text style={styles.headerText}>Price: {price}</Text>
                <TextInput
                    autoCapitalize="none"
                    placeholder="E-mail"
                    keyboardType="email-address"
                    onChange={value => setEmail(value.nativeEvent.text)}
                    style={styles.input}
                />
                {/* <CardField
                    postalCodeEnabled={true}
                    placeholder={{
                        number: "4242 4242 4242 4242",
                    }}
                    cardStyle={styles.card}
                    style={styles.cardContainer}
                    onCardChange={cardDetails => {
                        setCardDetails(cardDetails);
                    }}
                /> */}
                <StyledButton onPress={() => handlePayPress(price*100)} disabled={false} >
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
    titleText: {
        fontSize: 40,
        fontWeight: "bold",
        color: '#002233',
        textAlign: 'center',
    },
    headerText: {
        fontSize: 30,
        color: '#002233',
        textAlign: 'center',
        marginBottom: 100
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