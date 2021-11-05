import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';

// Formik
import { Formik } from "formik";

// Icons
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons"

import {
    BackgroundStyle,
    StyledContainer,
    StyledContainer2,
    InnerContainer4,
    InnerContainer5,
    StyledFormArea,
    StyledInputLabel,
    StyledTextInput,
    StyledTextInput1,
    StyledButton,
    StyledButton1,
    MsgBox,
    ExtraView1,
    ExtraText1,
    LeftIcon,
    Colours,
    ButtonText,
    PageTitle
} from '../components/styles';
import { Platform, Text, View, ActivityIndicator, ImageBackground, TouchableOpacity, Alert } from 'react-native';

import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";

// Colours
const { brand, darkLight, primary } = Colours;

// API Client
import axios from 'axios';

const AdminRemoveProduct = ({ navigation, route }) => {
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [isCancelling, setCancel] = useState(false);

    const handleModify = (credentials, setSubmitting) => {
        handleMessage(null);
        const url = "https://protected-shelf-96328.herokuapp.com/api/deleteItem?name=" + credentials.title;
        axios
            .delete(url)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;
                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                    setSubmitting(false);
                } else {
                    setSubmitting(false);
                    Alert.alert('SUCCESS', 'Product has been removed from the store.', [
                        {text: 'OK', onPress: () => navigation.navigate('AdminMain', { ...route })}
                    ]);
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
        <StyledContainer>
            <StatusBar style="dark" />
            <ImageBackground
                 source={require('./../assets/WallpapersAndLogo/ServicesPage.png')} resizeMode="cover" style={BackgroundStyle.image}>
            </ImageBackground>
            <KeyboardAvoidingWrapper>
                <InnerContainer4>
                <PageTitle style={{color: 'black', marginTop: 10}}>Remove Store Product</PageTitle>
                <InnerContainer5>
                    
                    <Formik
                        initialValues={{ title: '' }}
                        onSubmit={(values, { setSubmitting }) => {
                            values = { ...values};
                            if (values.title == '') {
                                handleMessage('Please provide the name of the item to remove!');
                                setSubmitting(false);
                            } else {
                                    setSubmitting(true);
                                    handleModify(values, setSubmitting);
                                }
                            }
                        }
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                            <StyledFormArea>

                                <MyTextInput
                                    label="Product Name"
                                    icon="pencil"
                                    placeholder="Name"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('title')}
                                    onBlur={handleBlur('title')}
                                    value={values.title}
                                />

                                <MsgBox type={messageType}>{message}</MsgBox>

                                {!isSubmitting && (
                                    <StyledButton1 onPress={handleSubmit}>
                                        <ButtonText>Remove Product</ButtonText>
                                    </StyledButton1>
                                )}

                                {isSubmitting && (
                                    <StyledButton1 disabled={true}>
                                        <ActivityIndicator size="large" color={primary} />
                                    </StyledButton1>
                                )}

                                {!isCancelling && (
                                    <StyledButton onPress={() => {
                                    setCancel(true); 
                                    navigation.navigate('AdminMain', { ...route } ); }
                                    }>
                                        <ButtonText>Cancel</ButtonText>
                                    </StyledButton>
                                )}

                                {isCancelling && (
                                    <StyledButton disabled={true}>
                                        <ActivityIndicator size="large" color={primary} />
                                    </StyledButton>
                                )}
                            </StyledFormArea>
                        )}
                    </Formik>
                    </InnerContainer5>
            </InnerContainer4>
            </KeyboardAvoidingWrapper>
        </StyledContainer>
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

export default AdminRemoveProduct;