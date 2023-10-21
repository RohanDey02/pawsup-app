import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';

// Formik
import { Formik } from "formik";

// Icons
import { Octicons, Ionicons } from "@expo/vector-icons"

import {
    BackgroundStyle,
    StyledContainer,
    InnerContainer,
    PageTitle,
    StyledFormArea,
    LeftIcon,
    RightIcon,
    StyledInputLabel,
    StyledTextInput,
    StyledButton,
    MsgBox,
    Colours,
    ButtonText
} from './../components/styles';
import { View, ActivityIndicator, ImageBackground } from 'react-native';

// Colours
const { brand, darkLight, primary } = Colours;

// API Client
import axios from 'axios';
import SERVER_URL from "../server-url";

const Setting = ({ navigation, route }) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const password = route.params.password;
    const pettype = route.params.pettype;

    /*
     * Handles pushing the new user data to the server which will push to the database. 
    */
    const handleUpdate = (credentials, setSubmitting) => {
        handleMessage(null);
        // const url = "https://protected-shelf-96328.herokuapp.com/api/update";
        const url = `http://${SERVER_URL}/api/update`;

        var itemValues = {email: route.params.email, password: credentials.password, pettype: credentials.pettype}

        axios
            .put(url, itemValues)
            .then((response) => {
                const { status, message, data } = response.data;
                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                    setSubmitting(false);
                } else {
                    console.log(route.params)
                    if(route.params.accounttype == "Petowner"){
                        navigation.navigate('PetOwnerMain', { ...route.params });
                    } else if(route.params.accounttype == "Petsitter"){
                        navigation.navigate('PetSitterMain', { ...route.params });
                    } else if(route.params.accounttype == "Admin"){
                        navigation.navigate('AdminMain', { ...route.params });
                    }
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
            <ImageBackground
            source={require('./../assets/WallpapersAndLogo/ServicesPage.png')} 
            resizeMode="cover" 
            style={BackgroundStyle.image}>
            </ImageBackground>
            <StatusBar style="dark" />
            <PageTitle>Pawsup Settings</PageTitle>
            
            <InnerContainer>
                <Formik
                    initialValues={{  password: password, pettype: pettype }}
                    onSubmit={(values, { setSubmitting }) => {
                        if ( values.password == ''  && values.pettype == '') {
                            handleMessage('Fill out a field!');
                            setSubmitting(false);
                        } else {
                            handleUpdate(values, setSubmitting);
                        }
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                        <StyledFormArea>
                            <MyTextInput
                                label="New Password"
                                icon="lock"
                                placeholder="New Password"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                secureTextEntry={hidePassword}
                                isPassword={true}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword}
                            />

                            <MyTextInput
                                label="Pet Type"
                                icon="squirrel"
                                placeholder="Cat/Dog/Monkey"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('pettype')}
                                onBlur={handleBlur('pettype')}
                                value={values.pettype}
                            />

                            <MsgBox type={messageType}>{message}</MsgBox>
                            
                            {!isSubmitting && (
                                <StyledButton onPress={handleSubmit}>
                                    <ButtonText>Change Information</ButtonText>
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
        </StyledContainer>
          
    );
};

// Style of Icons and DatePicker
const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
    return (
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            { <StyledTextInput {...props} />}
            
            {isPassword && (
                <RightIcon
                    onPress={() => {
                        setHidePassword(!hidePassword);
                    }}
                >
                    <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkLight} />
                </RightIcon>
            )}
        </View>
    );
};

export default Setting;