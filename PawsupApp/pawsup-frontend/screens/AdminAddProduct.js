import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import SelectBox from 'react-native-multi-selectbox'
import { xorBy } from 'lodash'

// Formik
import { Formik } from "formik";

// Icons
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons"

import {
    BackgroundStyle,
    StyledContainer,
    StyledContainer2,
    InnerContainer,
    InnerContainer7,
    InnerContainer2,
    StyledFormArea,
    StyledInputLabel,
    StyledTextInput,
    StyledTextInput1,
    StyledButton,
    MsgBox,
    ExtraView2,
    ExtraText1,
    LeftIcon,
    Colours,
    ButtonText,
    PageTitle
} from '../components/styles';
import { Platform, Text, View, ActivityIndicator, ImageBackground, TouchableOpacity, Alert } from 'react-native';

import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import KeyboardAvoidingWrapper2 from "../components/KeyboardAvoidingWrapper2";


// Colours
const { brand, darkLight, primary } = Colours;

// API Client
import axios from 'axios';
import { ScrollView } from "react-native-gesture-handler";

const AdminAddProduct = ({ navigation, route }) => {
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [isCancelling, setCancel] = useState(false);
    const K_OPTIONS = [
        { item: 'Angelfish', id: '1' },
        { item: 'Axolotl', id: '2' },
        { item: 'Betta', id: '3' },
        { item: 'Canary', id: '4' },
        { item: 'Cat', id: '5' },
        { item: 'Catfish', id: '6' },
        { item: 'Chicken', id: '7' },
        { item: 'Chinese Water Dragon', id: '8' },
        { item: 'Cockatiel', id: '9' },
        { item: 'Cockatoo', id: '10' },
        { item: 'Dog', id: '11' },
        { item: 'Finch', id: '12' },
        { item: 'Gecko', id: '13' },
        { item: 'Goldfish', id: '14' },
        { item: 'Green Anole', id: '15' },
        { item: 'Hamster', id: '16' },
        { item: 'Iguana', id: '17' },
        { item: 'Kitten', id: '18' },
        { item: 'Lovebird', id: '19' },
        { item: 'Mouse', id: '20' },
        { item: 'Pacman Frog', id: '21' },
        { item: 'Parrot', id: '22' },
        { item: 'Parakeet', id: '23' },
        { item: 'Puppy', id: '24' },
        { item: 'Rabbit', id: '25' },
        { item: 'Tiger Salamander', id: '26' },
        { item: 'Tortoise', id: '27' },
        { item: 'Tree Frog', id: '28' },
        { item: 'Tropical Fish', id: '29' },
        { item: 'Turtle', id: '30' }
    ];

    const handleModify = (credentials, setSubmitting, selectedPets) => {
        handleMessage(null);
        var newArr = [];
        for (var i = 0; i < selectedPets.length; i++) {
            newArr.push(selectedPets[i]['item']);
        }
        const url = "https://protected-shelf-96328.herokuapp.com/api/makeItem";
        var itemValues={ name: credentials.title, price: credentials.price, description: credentials.description, quantity: credentials.quantity, image: credentials.image, pets: newArr };
        axios
            .post(url, itemValues)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;
                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                    setSubmitting(false);
                } else {
                    setSubmitting(false);
                    Alert.alert('SUCCESS', 'Product has been added to the store.', [
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

    const [selectedPets, setSelectedPets] = useState([])
    function onMultiChange() {
        return (item) => setSelectedPets(xorBy(selectedPets, [item], 'id'))
    }
    
    return (
        <StyledContainer>
            <StatusBar style="dark" />
            <ImageBackground
                 source={require('./../assets/WallpapersAndLogo/ServicesPage.png')} resizeMode="cover" style={BackgroundStyle.image}>
            </ImageBackground>
            <KeyboardAvoidingWrapper2>
                <InnerContainer>
                <PageTitle style={{color: 'black', marginTop: 10}}>Add Store Product</PageTitle>
                <InnerContainer7>
                <StyledFormArea>
                <ExtraView2>
                        <ExtraText1>Choose the pets this product is applicable for: </ExtraText1>
                        </ExtraView2>
                                <SelectBox
                                        label=""
                                        options={K_OPTIONS}
                                        selectedValues={selectedPets}
                                        onMultiSelect={onMultiChange()}
                                        onTapClose={onMultiChange()}
                                        isMulti
                                />
                                <View style={{ height: 10 }}/>
                </StyledFormArea>
                </InnerContainer7>
                </InnerContainer>
                </KeyboardAvoidingWrapper2>
            <KeyboardAvoidingWrapper>
                <InnerContainer>
                    <InnerContainer2>
                    <Formik
                        initialValues={{ title: '', price: '', description: '', quantity: '', image: '' }}
                        onSubmit={(values, { setSubmitting }) => {
                            values = { ...values};
                            if (values.title == '') {
                                handleMessage('Please provide a product name!');
                                setSubmitting(false);
                            } else if (values.description == '') {
                                handleMessage('Please provide a description!');
                                setSubmitting(false);
                            } else if (values.price == '') {
                                handleMessage('Please provide the price of the item in CAD!');
                                setSubmitting(false);
                            } else if (values.image == '') {
                                handleMessage("Please provide the an image's URL!");
                                setSubmitting(false);
                            }else if (values.quantity == '') {
                                handleMessage("Please provide the quantity");
                                setSubmitting(false);
                            } else {
                                setSubmitting(true);
                                handleModify(values, setSubmitting, selectedPets);
                            }
                        }}
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
                                    label="Price (in CAD)"
                                    icon="clippy"
                                    placeholder="Price"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('price')}
                                    onBlur={handleBlur('price')}
                                    value={values.price}
                                    keyboardType="number-pad"
                                />

                                <MyTextInput
                                    label="Product Image URL"
                                    icon="file-media"
                                    placeholder="Image URL"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('image')}
                                    onBlur={handleBlur('image')}
                                    value={values.image}
                                />

                                <MyTextInput
                                    label="Quantity"
                                    icon="list-ordered"
                                    placeholder="Quantity"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('quantity')}
                                    onBlur={handleBlur('quantity')}
                                    value={values.quantity}
                                    keyboardType="number-pad"
                                />

                                

                                <MsgBox type={messageType}>{message}</MsgBox>

                                {!isSubmitting && (
                                    <StyledButton onPress={handleSubmit}>
                                        <ButtonText>Add Product</ButtonText>
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
                    </InnerContainer2>
                    </InnerContainer>
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

const MyTextInput1 = ({ label, icon, ...props }) => {
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

export default AdminAddProduct;
