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
    InnerContainer2,
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
} from '../components/styles';
import { Platform, Text, View, ActivityIndicator, ImageBackground, TouchableOpacity, Alert } from 'react-native';

import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";

import DateTimePicker from '@react-native-community/datetimepicker';

// Colours
const { brand, darkLight, primary } = Colours;

// API Client
import axios from 'axios';

const PetSitterModifyListing = ({ navigation, route }) => {
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
    const {accounttype, dateofbirth, email, fullname, password, pettype, phonenumber} = route.params;

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

    /*
     * Handles querying the database via axios and server to find the listing and edit its details. 
    */
    const handleModify = (credentials, setSubmitting) => {
        handleMessage(null);
        const url = "https://protected-shelf-96328.herokuapp.com/api/modifyListing";
        var modifyValues={ listingowner: credentials.listingowner, title: credentials.title, description: credentials.description, location: credentials.location, features: credentials.features,  price: credentials.price};
        var blockValues={ listingowner: credentials.listingowner, reason: credentials.reason, startdate: startDate, enddate: endDate};
        axios
            .put(url, modifyValues)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;
                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                    setSubmitting(false);
                } else {
                    if (credentials.booked) {
                        handleBlock(blockValues, setSubmitting);
                    }
                    setSubmitting(false);
                    Alert.alert('SUCCESS', 'Your changes have been saved.', [
                        {text: 'OK', onPress: () => navigation.navigate('PetSitterMain', { ...route })}
                    ]);
                }
            })
            .catch((error) => {
                setSubmitting(false);
                handleMessage('An error occurred. Check your network and try again');
            });
    }

    const handleBlock = (credentials, setSubmitting) => {
        handleMessage(null);
        const url = "https://protected-shelf-96328.herokuapp.com/api/makeBooking";

        axios
            .put(url, credentials)
            .then ((response) => {
                const result = response.data;
                const { status, message, data } = result;
            })
            .catch((error) => {
                handleMessage('An error in blocking occurred. Check your network and try again')
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
                <InnerContainer2>
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
                        initialValues={{ listingowner: email, description: '', features: '', title: '', startDateBlock: '', endDateBlock: '', reason: '', booked: '', price: ''}}
                        onSubmit={(values, { setSubmitting }) => {
                            values = { ...values, startDateBlock: startDate , endDateBlock: endDate};
                            if (values.title == '') {
                                handleMessage('Please provide a title!');
                                setSubmitting(false);
                            } else if (values.description == '') {
                                handleMessage('Please provide a description!');
                                setSubmitting(false);
                            } else if (values.price == '') {
                                handleMessage('Please provide the price per day in CAD!');
                                setSubmitting(false);
                            } else if (values.features == '') {
                                handleMessage('Please provide information on the features of your listings!');
                                setSubmitting(false); 
                            } else {
                                if (startSet && !endSet) {
                                    handleMessage('Choose the end date of the block.');
                                    setSubmitting(false);
                                } else if (!startSet && endSet) {
                                    handleMessage('Choose the start date of the block.');
                                    setSubmitting(false);
                                } else if (startSet && endSet) {
                                    if (startDate.getTime() > endDate.getTime()) {
                                        handleMessage('The end date must come after the start date!');
                                        setSubmitting(false);
                                    } else {
                                        values.booked = true;
                                        values.reason = 'BLOCKED';
                                        setSubmitting(true);
                                        handleModify(values, setSubmitting);
                                    }
                                } else {
                                    values.booked = false;
                                    setSubmitting(true);
                                    handleModify(values, setSubmitting);
                                }
                            }
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                            <StyledFormArea>

                                <MyTextInput
                                    label="Title"
                                    icon="pencil"
                                    placeholder="Title"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('title')}
                                    onBlur={handleBlur('title')}
                                    value={values.title}
                                />

                                <MyTextInput1
                                    label="Description"
                                    icon="book"
                                    placeholder="Description"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('description')}
                                    onBlur={handleBlur('description')}
                                    value={values.description}
                                />

                                <MyTextInput
                                    label="Price Per Day (in CAD)"
                                    icon="clippy"
                                    placeholder="Price"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('price')}
                                    onBlur={handleBlur('price')}
                                    value={values.price}
                                    keyboardType="number-pad"
                                />

                                <MyTextInput1
                                    label="Features"
                                    icon="star"
                                    placeholder="Features"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('features')}
                                    onBlur={handleBlur('features')}
                                    value={values.features}
                                />

                                <MyTextInput1
                                    label="Location"
                                    icon="location"
                                    placeholder="Street Number Street Name, City, Province, Postal Code"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('location')}
                                    onBlur={handleBlur('location')}
                                    value={values.location}
                                />

                                <ExtraView1>
                                    <ExtraText1>Want to remove a block of days from your pet-stting schedule? </ExtraText1>
                                </ExtraView1>
                                <MyTextInput
                                    label="Choose Start Date of Block"
                                    placeholder="YYYY/MM/DD"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('startDateBlock')}
                                    onBlur={handleBlur('startDateBlock')}
                                    value={startDate ? startDate.toDateString() : ''}
                                    icon="calendar"
                                    editable={false}
                                    isDate={true}
                                    showDatePicker={showDatePicker}
                                />

                                <MyTextInput
                                    label="Choose End Date of Block"
                                    placeholder="YYYY/MM/DD"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('endDateBlock')}
                                    onBlur={handleBlur('endDateBlock')}
                                    value={endDate ? endDate.toDateString() : ''}
                                    icon="calendar"
                                    editable={false}
                                    isDate={true}
                                    showDatePicker={showDatePicker1}
                                />

                                <MsgBox type={messageType}>{message}</MsgBox>

                                {!isSubmitting && (
                                    <StyledButton onPress={handleSubmit}>
                                        <ButtonText>Submit</ButtonText>
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
                                    navigation.navigate('PetSitterMain', { ...route } ); }
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
            </InnerContainer2>
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

const MyTextInput1 = ({ label, icon, isDate, showDatePicker, ...props }) => {
    return (
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput1 {...props} />
        </View>
    );
}; 
export default PetSitterModifyListing;
