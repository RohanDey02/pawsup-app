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
    InnerContainer3,
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

import { View, StyleSheet,TouchableOpacity, ActivityIndicator ,ImageBackground} from 'react-native';

// Colours
const { brand, darkLight, primary } = Colours;

// Keyboard Avoiding Wrapper
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";

// API Client
import axios from 'axios';

const Signup = ({ navigation }) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date(2000, 0, 1));
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

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
        <KeyboardAvoidingWrapper>
        <StyledContainer>
            
                <ImageBackground
                source={require('./../assets/WallpapersAndLogo/PawsupMainPage.png')} resizeMode="cover" style={BackgroundStyle.image}>
                </ImageBackground>
                <StatusBar style="dark" />
                <InnerContainer3>
                     

                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                            style={{
                                backgroundColor: 'yellow',
                            }}
                        />
                    )}

                    <Formik
                        initialValues={{ email: '', password: '', fullname: '', dateofbirth: '', phonenumber: '', accounttype: '', pettype: 'null' }}
                        onSubmit={(values, { setSubmitting }) => {
                            values = { ...values, dateofbirth: dob };
                            if (values.email == '' || values.password == '' || values.fullname == '' || values.dateofbirth == '' || values.phonenumber == '' || values.accounttype == '' || values.pettype == '') {
                                handleMessage('Fill out all fields!');
                                setSubmitting(false);
                            } else {
                                handleSignup(values, setSubmitting);
                            }
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                            <StyledFormArea>
                                <MyTextInput
                                    label="Email Address"
                                    placeholder="Email Address"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    keyboardType="email-address"
                                    icon="mail"
                                />

                                <MyTextInput
                                    label="Password"
                                    icon="lock"
                                    placeholder="Password"
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
                                    label="Full Name"
                                    placeholder="Full Name"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('fullname')}
                                    onBlur={handleBlur('fullname')}
                                    value={values.fullname}
                                    icon="person"
                                />

                                <MyTextInput
                                    label="Date of Birth"
                                    placeholder="YYYY/MM/DD"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('dateofbirth')}
                                    onBlur={handleBlur('dateofbirth')}
                                    value={dob ? dob.toDateString() : ''}
                                    icon="calendar"
                                    editable={false}
                                    isDate={true}
                                    showDatePicker={showDatePicker}
                                />

                                <MyTextInput
                                    label="Phone Number"
                                    icon="megaphone"
                                    placeholder="Phone Number"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('phonenumber')}
                                    onBlur={handleBlur('phonenumber')}
                                    value={values.phonenumber}
                                />

                                <MyTextInput
                                    label="Account Type"
                                    icon="person"
                                    placeholder="Petowner/Petsitter"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('accounttype')}
                                    onBlur={handleBlur('accounttype')}
                                    value={values.accounttype}
                                />


                                <MsgBox type={messageType}>{message}</MsgBox>

                                {!isSubmitting && (
                                    <StyledButton onPress={handleSubmit}>
                                        <ButtonText>Signup</ButtonText>
                                    </StyledButton>
                                )}

                                {isSubmitting && (
                                    <StyledButton disabled={true}>
                                        <ActivityIndicator size="large" color={primary} />
                                    </StyledButton>
                                )}

                                <ExtraView>
                                    <ExtraText>Already have an account? </ExtraText>
                                    <TextLink onPress={() => navigation.navigate('Login')}>
                                        <TextLinkContent>Login</TextLinkContent>
                                    </TextLink>
                                </ExtraView>
                            </StyledFormArea>
                        )}
                    </Formik>
                </InnerContainer3>
                
            </StyledContainer>
            </KeyboardAvoidingWrapper>
    );
};

// Style of Icons and DatePicker
const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, isDate, showDatePicker, ...props }) => {
    return (
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            {!isDate && <StyledTextInput {...props} />}
            {isDate && (
                <TouchableOpacity onPress={showDatePicker}>
                    <StyledTextInput {...props} />
                </TouchableOpacity>
            )}
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

export default Signup;