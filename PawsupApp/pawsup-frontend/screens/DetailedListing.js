import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';

import {
    BackgroundStyle,
    StyledContainer2,
    InnerContainer,
    ButtonTextMain,
    StyledButtonMainPage
} from './../components/styles';
import axios from 'axios';
import {TextInput , StyleSheet, Image, TouchableHighlight, Dimensions,ImageBackground, SafeAreaView, Button, Text, TouchableOpacity, View } from 'react-native';
const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');
const email='ali@gmail.com';

const DetailedListing = ({ navigation, route }) => {
    //const data = route.params;
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    //const [listing, setListing] = useState();
    const handleGetListing = (listingowner) => {
        //handleMessage(null);
        const url = "https://protected-shelf-96328.herokuapp.com/api/getListing";
        axios
        .get(url, {
            params: {
              listingowner: email
            }
          })
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;
                if (status !== 'SUCCESS') {
                    //handleMessage(message, status);
                } else {
                    setListing(result.data);
                }
            })
            .catch((error) => {
                //handleMessage('An error occurred. Check your network and try again');
            });
            console.log(listingowner);
    }
    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }
    //handleGetListing(email);
    const listing={
        "data": 
            {
                "_id": "616f12a7328edf63c5478b4b",
                "listingowner": "ali@gmail.com",
                "title": "l",
                "description": "l",
                "features": "l",
                "bookings": [
                    {
                        "reason": "BLOCKED",
                        "startdate": "2021/10/25",
                        "enddate": "2021/10/27",
                        "_id": "616f12b5328edf63c5478b51"
                    }
                ],
            },
            "location": "2780 7th Ave, Calgary, AB, T2P0W4",
                   
    };
    return (
        
            <SafeAreaView style={styles.container}>
                
                <ImageBackground
                    source={require('./../assets/WallpapersAndLogo/ServicesPage.png')}
                    resizeMode="cover"
                    style={BackgroundStyle.image}
                >
                    <Image
                        style={styles.catstyle}
                        source={require('./../assets/WallpapersAndLogo/ChillingCat.png')}
                    />
                    <Text numberOfLines={1} style={styles.text2}>
                    {listing.data.listingowner}
                    </Text>
                    <Text numberOfLines={1} style={styles.text}>
                        {listing.location}
                    </Text>
                    <Text numberOfLines={1} style={styles.innertext}>
                    {listing.data.description}
                    </Text>
                    <TouchableOpacity style={styles.button1}>
                        <Text numberOfLines={1} style={styles.innertext2}>
                            Add Booking to Cart
                        </Text>
                    </TouchableOpacity>
                </ImageBackground>
                
            </SafeAreaView>
        );
};

const styles = StyleSheet.create({
    settingsicon: {
        top: "-40%",
        right: "10%",
        width: 50,
        height: 50,
        position: 'absolute',
    },
    text: {
        width: '80%',
        height: '10%',
        top: 0.53 * SCREEN_HEIGHT,
        borderWidth:1,
        marginLeft: "9%",
        marginRight: "9%",
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        backgroundColor: "white",
    },
    text2: {
        width: '80%',
        height: '5%',
        top: 0.47 * SCREEN_HEIGHT,
        borderWidth:1,
        marginLeft: "9%",
        marginRight: "9%",
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        backgroundColor: "white",
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    innertext: {
        width: '80%',
        height: '10%',
        borderWidth:1,
        top: 0.64 * SCREEN_HEIGHT,
        marginLeft: "9%",
        marginRight: "9%",
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        backgroundColor: "white",
    },
    catstyle:
    {
        width: '80%',
        height: '30%',
        top: 0.15 * SCREEN_HEIGHT,
        marginLeft: "9%",
        marginRight: "9%",
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
    },
    button1: {
        width: '70%',
        height: '10%',
        top: 0.75 * SCREEN_HEIGHT,
        marginRight: "15%",
        marginLeft: "15%",
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        backgroundColor: "red",
    },
    innertext2: {
        textAlign: 'center',
        fontSize: 0.02 * (SCREEN_WIDTH + SCREEN_HEIGHT),
        marginTop: 0,
        marginLeft: "15%",
        marginRight: "15%",
        justifyContent: 'center',
        alignItems: 'center',
        width: 0.7*SCREEN_WIDTH,
        position: 'absolute',
    },
});

export default DetailedListing;