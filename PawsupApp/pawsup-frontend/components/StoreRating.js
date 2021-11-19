import React,{useState, useEffect,Component} from 'react';
import { View, Image, StyleSheet, Text, Dimensions, Touchable, TouchableOpacity, Platform,Alert } from 'react-native';
const NUMCOLS = 1;
import axios from 'axios';
const WIDTH = Dimensions.get('window').width - 40;
import {  AirbnbRating } from 'react-native-ratings';

const StoreRating = ({ item, onPress }) => {
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const handleRating = (item, rating) => {
    const url = "https://protected-shelf-96328.herokuapp.com/api/addItemRating";   
    var credentials = { item: item, rating: rating };
    axios
        .put(url, credentials)
        .then((response) => {
            const result = response.data;
            const { status, message, data } = result;

            if (status !== 'SUCCESS') {
                if(message === "Error: Start Date is within 2 days of current time") {
                    Alert.alert('FAILURE', 'Cannot add rating.', [
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
      onFinishRating = {rating => handleRating(item.name,rating)}
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

export default StoreRating;