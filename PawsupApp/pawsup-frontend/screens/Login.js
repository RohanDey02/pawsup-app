import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';

// Formik
import { Formik } from "formik";

// Icons
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons"

import {
    BackgroundStyle,
    StyledContainer2,
    InnerContainer,
    StyledFormArea,
    LeftIcon,
    RightIcon,
    StyledInputLabel,
    StyledTextInput,
    StyledButton,
    MsgBox,
    ExtraView,
    ExtraText,
    TextLink,
    TextLinkContent,
    Colours,
    ButtonText,
} from './../components/styles';
import { View, ActivityIndicator, ImageBackground } from 'react-native';

// Colours
const { brand, darkLight, primary } = Colours;

// API Client
import axios from 'axios';

const Login = ({ navigation }) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

    /*
     * Handles querying the database via axios and server to attempt to signin. 
    */
    const handleLogin = (credentials, setSubmitting) => {
        handleMessage(null);
        const url = "https://protected-shelf-96328.herokuapp.com/api/signin";

        axios
            .post(url, credentials)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;
                
                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                } else {
                    if(data[0].accounttype == 'Petowner'){
                        navigation.navigate('PetOwnerMain', { ...data });
                    } else if(data[0].accounttype == 'Petsitter'){
                        navigation.navigate('PetSitterMain', { ...data });
                    } else if(data[0].accounttype == 'Admin'){
                        navigation.navigate('AdminMain', { ...data });
                    }
                }
                setSubmitting(false);
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
                        initialValues={{ email: '', password: '' }}
                        onSubmit={(values, { setSubmitting }) => {
                            if (values.email == '' || values.password == '') {
                                handleMessage('Fill out all fields!');
                                setSubmitting(false);
                            } else {
                                handleLogin(values, setSubmitting);
                            }
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                            <StyledFormArea>
                                <MyTextInput
                                    label="Email Address"
                                    icon="mail"
                                    placeholder="Email"
                                    placeholderTextColor={darkLight}
                                    ///onChangeText={handleChange('email')}
                                    //onBlur={handleBlur('email')}
                                    value={values.email}
                                    keyboardType="email-address"
                                />

                                <MyTextInput
                                    label="Password"
                                    icon="lock"
                                    placeholder="Password"
                                    placeholderTextColor={darkLight}
                                    //onChangeText={handleChange('password')}
                                    //onBlur={handleBlur('password')}
                                    value={values.password}
                                    secureTextEntry={hidePassword}
                                    isPassword={true}
                                    hidePassword={hidePassword}
                                    setHidePassword={setHidePassword}
                                />

                                <MsgBox type={messageType}>{message}</MsgBox>

                                {!isSubmitting && (
                                    <StyledButton onPress={handleSubmit}>
                                        <ButtonText>Login</ButtonText>
                                    </StyledButton>
                                )}

                                {isSubmitting && (
                                    <StyledButton disabled={true}>
                                        <ActivityIndicator size="large" color={primary} />
                                    </StyledButton>
                                )}

                                <ExtraView>
                                    <ExtraText>Don't have an account? </ExtraText>
                                    <TextLink onPress={() => navigation.navigate('Signup')}>
                                        <TextLinkContent>Signup</TextLinkContent>
                                    </TextLink>
                                </ExtraView>
                            </StyledFormArea>
                        )}
                    </Formik>
            </InnerContainer>
        </ImageBackground>
    </StyledContainer2>
    );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
    return (
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props} />
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

export default Login;