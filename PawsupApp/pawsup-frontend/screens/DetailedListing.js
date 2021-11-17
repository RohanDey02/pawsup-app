import React, { useState , useEffect} from "react";

import { BackgroundStyle } from './../components/styles';
import axios from 'axios';
import { AirbnbRating } from 'react-native-ratings';
import { View,StyleSheet, Image, Dimensions, ImageBackground, SafeAreaView, Text, TouchableOpacity } from 'react-native';
const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const DetailedListing = ({ navigation, route }) => {
    const [listing, setListing] = useState([]);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [firstRender, setFirstRender] = useState(false);


    const handleGetListing = (listingowner) => {
        const url = "https://protected-shelf-96328.herokuapp.com/api/getListing?listingowner=" + listingowner;

        axios
            .get(url)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;
                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                } else {
                    setListing(data[0]);
                }
            })
            .catch((error) => {
                handleMessage('An error occurred. Check your network and try again');
            });
    };

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    };

    
    useEffect(() => {
        if(!firstRender) {
            handleGetListing(route.params.listingemail);
            setFirstRender(true);
        }
    });

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
                <Text numberOfLines={1} style={styles.listingOwnerText}>
                    Contact: {listing.listingowner}
                </Text>
                <Text numberOfLines={2} style={styles.priceText}>
                    Price: ${listing.price}/day {"\n"}Rating: {Number(Number((listing.rating)).toFixed(1))}/1
                </Text>
                <Text numberOfLines={1} style={styles.locationText}>
                    Location: {listing.location}
                </Text>
                <Text numberOfLines={3} style={styles.descriptionText}>
                    {listing.description}
                </Text>
                <Text numberOfLines={3} style={styles.featuresText}>
                    {listing.features}
                </Text>
                <TouchableOpacity style={styles.button}>
                    <Text numberOfLines={1} style={styles.buttonText}>
                        Add Booking to Cart
                    </Text>
                </TouchableOpacity>

            </ImageBackground>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    catstyle: {
        width: '80%',
        height: '30%',
        top: 0.10 * SCREEN_HEIGHT,
        marginLeft: "9%",
        marginRight: "9%",
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
    },
    listingOwnerText: {
        width: '36%',
        height: '5%',
        top: 0.35 * SCREEN_HEIGHT,
        borderWidth: 1,
        marginLeft: "9%",
        marginRight: "9%",
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        backgroundColor: "white",
        paddingLeft: 7
    },
    priceText: {
        width: '35%',
        height: '5%',
        top: 0.35 * SCREEN_HEIGHT,
        borderWidth: 1,
        marginLeft: "53%",
        marginRight: "10%",
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        backgroundColor: "white",
        paddingLeft: 7
    },
    locationText: {
        width: '80%',
        height: '5%',
        top: 0.42 * SCREEN_HEIGHT,
        borderWidth: 1,
        marginLeft: "9%",
        marginRight: "9%",
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        backgroundColor: "transparent",
        paddingLeft: 7
    },
    descriptionText: {
        width: '80%',
        height: '10%',
        borderWidth: 1,
        top: 0.49 * SCREEN_HEIGHT,
        marginLeft: "9%",
        marginRight: "9%",
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        backgroundColor: "transparent",
        paddingLeft: 7
    },
    featuresText: {
        width: '80%',
        height: '10%',
        borderWidth: 1,
        top: 0.61 * SCREEN_HEIGHT,
        marginLeft: "9%",
        marginRight: "9%",
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        backgroundColor: "transparent",
        paddingLeft: 7
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 0.02 * (SCREEN_WIDTH + SCREEN_HEIGHT),
        marginTop: 0,
        marginLeft: "15%",
        marginRight: "15%",
        justifyContent: 'center',
        alignItems: 'center',
        width: 0.7 * SCREEN_WIDTH,
        position: 'absolute'
    },
    button: {
        width: '70%',
        height: '10%',
        top: 0.75 * SCREEN_HEIGHT,
        marginRight: "15%",
        marginLeft: "15%",
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        backgroundColor: "red",
        borderRadius: 30
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
});

export default DetailedListing;