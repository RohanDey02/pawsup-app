import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';

// Formik
import { Formik } from "formik";

// Icons
import { Octicons, Ionicons } from "@expo/vector-icons"

// Datetimepicker
import DateTimePicker from '@react-native-community/datetimepicker';

import {
    BackgroundStyle,
    StyledContainer2,
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
    ExtraView,
    ExtraText,
    TextLink,
    TextLinkContent,
    Colours,
    ButtonText
} from './../components/styles';
import { View,StyleSheet ,TouchableOpacity, ActivityIndicator, Settings,ImageBackground } from 'react-native';

// Colours
const { brand, darkLight, primary } = Colours;

// Keyboard Avoiding Wrapper
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";

// API Client
import axios from 'axios';
import { TabRouter } from "@react-navigation/routers";

const Setting = ({ navigation ,route}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const password = route.password; 
    const phonenumber = route.phonenumber;
    const pettype = route.pettype;
    

    // Actual Date of Birth value to be sent
    const [dob, setDob] = useState();

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
        setDob(currentDate);
    };

    /*
     * Makes DatePicker visible when called
    */
    const showDatePicker = () => {
        setShow('date');
    };

    /*
     * Handles pushing the signup data to the server which will push to the database. 
    */
    const handleSignup = (credentials, setSubmitting) => {
        handleMessage(null);
        const url = "https://protected-shelf-96328.herokuapp.com/user/signup";

        axios
            .post(url, credentials)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;

                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                } else {
                    navigation.navigate('Welcome', { ...data });
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
                        initialValues={{  password: password, phonenumber: phonenumber, pettype: pettype }}
                        onSubmit={(values, { setSubmitting }) => {
                            values = { ...values, dateofbirth: dob };
                            if ( values.password == ''  && values.phonenumber == '' && values.pettype == '') {
                                handleMessage('Fill out a field!');
                                setSubmitting(false);
                            } else {
                                handleSignup(values, setSubmitting);
                            }
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                            <StyledFormArea>
                                

                                <MyTextInput
                                    label="New Phone Number"
                                    icon="megaphone"
                                    placeholder="New Phone Number"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('phonenumber')}
                                    onBlur={handleBlur('phonenumber')}
                                    value={values.phonenumber}
                                />

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