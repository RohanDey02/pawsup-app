import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';

// Formik
import { Formik } from "formik";

// Icons
import { Octicons } from "@expo/vector-icons"

import {
    BackgroundStyle,
    StyledContainer2,
    InnerContainer,
    StyledFormArea,
    LeftIcon,
    StyledInputLabel,
    StyledTextInput,
    StyledButton,
    MsgBox,
    Colours,
    ButtonText,
} from './../components/styles';

import { View, ActivityIndicator, ImageBackground, LogBox } from 'react-native';

// Colours
const { brand, darkLight, primary } = Colours;

import SERVER_URL from '../server-url';

// API Client
import axios from 'axios';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

const AddToCart = ({ navigation, route }) => {
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

    const handleAddToCart = (credentials, setSubmitting) => {
        handleMessage(null);
        // const url = "https://protected-shelf-96328.herokuapp.com/api/addToCart";
        const url = `http://${SERVER_URL}/api/addToCart`;
        var quant = parseInt(credentials.quantity);
        var itemValues={ email: route.params.routeParams.email, item: route.params.itemname, quantity: quant };
        axios
            .put(url, itemValues)
            .then((response) => {
                const { status, message } = response.data;
                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                    setSubmitting(false);
                } else {
                    console.log(route.params)
                    navigation.navigate('DetailedItem', { ...route.params })
                }
            })
            .catch((error) => {
                setSubmitting(false);
                handleMessage('An error occurred. Check your network and try again');
            });
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    return (
        <StyledContainer2>
            <ImageBackground
                source={require('./../assets/PawsupMainPage.png')} resizeMode="cover" style={BackgroundStyle.image}>
            <StatusBar style="dark" />
            <InnerContainer>
                <Formik
                    initialValues={{ quantity: '' }}
                    onSubmit={(values, { setSubmitting }) => {
                        if (values.quantity == '') {
                            handleMessage('Fill out all fields!');
                            setSubmitting(false);
                        } else {
                            handleAddToCart(values, setSubmitting);
                        }
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                        <StyledFormArea>
                            <MyTextInput
                                label="Quantity"
                                icon="law"
                                placeholder="Quantity"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('quantity')}
                                onBlur={handleBlur('quantity')}
                                value={values.quantity}
                            />

                            <MsgBox type={messageType}>{message}</MsgBox>

                            {!isSubmitting && (
                                <StyledButton onPress={handleSubmit}>
                                    <ButtonText>Add To Cart</ButtonText>
                                </StyledButton>
                            )}

                            {isSubmitting && (
                                <StyledButton disabled={true}>
                                    <ActivityIndicator size="large" color={primary} />
                                </StyledButton>
                            )}
                        </StyledFormArea>
                    )}
                </Formik>
            </InnerContainer>
            </ImageBackground>
        </StyledContainer2>
    );
};

const MyTextInput = ({ label, icon, ...props }) => {
    return (
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props} />
        </View>
    );
};

export default AddToCart;