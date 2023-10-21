import React,{useState, useEffect,Component} from 'react';
import { View, Image, StyleSheet, Text, Dimensions, Touchable, TouchableOpacity, Platform,Alert } from 'react-native';
const NUMCOLS = 1;
const WIDTH = Dimensions.get('window').width - 40;
import {  AirbnbRating } from 'react-native-ratings';
import SERVER_URL from '../server-url';
import axios from 'axios';
const ListingRating = ({ item, onPress }) => {
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const handleRating = (listingowner, rating) => {
    // const url = "https://protected-shelf-96328.herokuapp.com/api/addListingRating";   
    const url = `http://${SERVER_URL}/api/addListingRating`;   
    var credentials = { listingowner: listingowner, rating: rating };
    axios
        .put(url, credentials)
        .then((response) => {
            const result = response.data;
            const { status, message } = result;
            if (status !== 'SUCCESS') {
                if(message === "Error: Start Date is within 2 days of current time") {
                    Alert.alert('FAILURE', 'Cannot add rating within 2 days.', [
                        {text: 'OK'}
                    ]);
                }
                handleMessage(message, status);
            } else {
                console.log(rating);
            }
        })
        .catch((error) => {
            handleMessage('An error occurred. Check your network and try again');
        });
}
const handleMessage = (message, type = 'FAILED') => {
  setMessage(message);
  setMessageType(type);
};

  return(
    <AirbnbRating
    size = {WIDTH/30}
    defaultRating = {3}
    onFinishRating = {rating => handleRating(item.reason,rating)}
    />
  );
};

const styles = StyleSheet.create( {
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop:Platform.OS ==='ios'?20:0
  }
} );
export default ListingRating;