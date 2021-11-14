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
    InnerContainer,
    InnerContainer6,
    StyledFormArea,
    StyledInputLabel,
    StyledTextInput,
    StyledTextInput1,
    StyledButton,
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

import DateTimePicker from '@react-native-community/datetimepicker';

// Colours
const { brand, darkLight, primary } = Colours;

// API Client
import axios from 'axios';
const BookAppointment = ({ navigation, route }) => {
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [date, setDate] = useState(new Date(Date.now()));
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [startSet, setStartSet] = useState(false);
    const [endSet, setEndSet] = useState(false);
    const [isCancelling, setCancel] = useState(false);

    const showDatePicker = () => {
        setShow(true);
    };

    const showDatePicker1 = () => {
        setShow1(true);
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setStartDate(currentDate);
        setStartSet(true);
    };

    const onChange1 = (event, selectedDate1) => {
        const currentDate1 = selectedDate1 || date;
        setShow1(false);
        setEndDate(currentDate1);
        setEndSet(true);
    };

    const handleBook = (credentials, setSubmitting) => {
        handleMessage(null);
        const url = "https://protected-shelf-96328.herokuapp.com/api/checkBookings";
        var itemValues={ listingowner: route.params.listingemail, startdate: credentials.startdate, enddate: credentials.enddate };
        axios
            .put(url, itemValues)
            .then((response) => {
                const { status, message } = response.data;
                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                    setSubmitting(false);
                } else {
                    if (message !== 'EMPTY') {
                        handleMessage('This slot has already been booked. Please select a different slot.');
                        setSubmitting(false);
                    } else {
                        setSubmitting(false);
                        navigation.navigate('Checkout', { ...route.params, ...credentials });
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
            <StatusBar style="dark" />
            <ImageBackground
                 source={require('./../assets/WallpapersAndLogo/StorePage.png')} resizeMode="cover" style={BackgroundStyle.image}>
            </ImageBackground>
            <PageTitle style={{color: 'black', marginTop: 5}}>Book Appointment</PageTitle>
            <KeyboardAvoidingWrapper>
            <InnerContainer>
                <InnerContainer6>
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
                {show1 && (
                        <DateTimePicker
                            testID="dateTimePicker1"
                            value={date}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onChange1}
                            style={{
                                backgroundColor: 'yellow',
                            }}
                        />
                    )}
                    
                    <Formik
                        initialValues={{ reason: route.params.routeParams.email, startdate: '', enddate: '', checkoutType: 'BOOKING'}}
                        onSubmit={(values, { setSubmitting }) => {
                                if (!startSet && !endSet) {
                                    handleMessage('Choose the start and the end dates of the booking.');
                                    setSubmitting(false);
                                }
                                if (startSet && !endSet) {
                                    handleMessage('Choose the end date of the booking.');
                                    setSubmitting(false);
                                } else if (!startSet && endSet) {
                                    handleMessage('Choose the start date of the booking.');
                                    setSubmitting(false);
                                } else if (startSet && endSet) {
                                    if (startDate.getTime() > endDate.getTime()) {
                                        handleMessage('The end date must come after the start date!');
                                        setSubmitting(false);
                                    } else {
                                        setSubmitting(true);
                                        var days = endDate.getTime() - startDate.getTime();
                                        var totalCost = route.params.cost + (route.params.cost * (Math.floor(days / (1000 * 60 * 60 * 24))));
                                        values = { ...values, startdate: startDate, enddate: endDate, cost: totalCost};
                                        handleBook(values, setSubmitting);
                                    }
                                }
                        }}
                    >
                    {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                            <StyledFormArea>
                                <MyTextInput
                                    label="Choose Start Date of Booking"
                                    placeholder="YYYY/MM/DD"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('startdate')}
                                    onBlur={handleBlur('startdate')}
                                    value={startDate ? startDate.toDateString() : ''}
                                    icon="calendar"
                                    editable={false}
                                    isDate={true}
                                    showDatePicker={showDatePicker}
                                />

                                <MyTextInput
                                    label="Choose End Date of Booking"
                                    placeholder="YYYY/MM/DD"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('enddate')}
                                    onBlur={handleBlur('enddate')}
                                    value={endDate ? endDate.toDateString() : ''}
                                    icon="calendar"
                                    editable={false}
                                    isDate={true}
                                    showDatePicker={showDatePicker1}
                                />

                                <MsgBox type={messageType}>{message}</MsgBox>

                                {!isSubmitting && (
                                    <StyledButton onPress={handleSubmit}>
                                        <ButtonText>Proceed to Checkout</ButtonText>
                                    </StyledButton>
                                )}

                                {isSubmitting && (
                                    <StyledButton disabled={true}>
                                        <ActivityIndicator size="large" color={primary} />
                                    </StyledButton>
                                )}

                                {!isCancelling && (
                                    <StyledButton onPress={() => {
                                        setCancel(true);
                                        navigation.navigate('DetailedListing', { 
                                            ...route.params } ); }
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
                    </InnerContainer6>
            </InnerContainer>
            </KeyboardAvoidingWrapper>
        </StyledContainer>
    );
};

const MyTextInput = ({ label, icon, isDate, showDatePicker, ...props }) => {
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
        </View>
    );
};
export default BookAppointment;
