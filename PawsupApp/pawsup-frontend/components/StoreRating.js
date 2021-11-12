import React,{Component} from 'react';
import { View, Image, StyleSheet, Text, Dimensions, Touchable, TouchableOpacity, Platform,Alert } from 'react-native';
//import { Rating, AirbnbRating } from 'react-native-elements';
const NUMCOLS = 1;
const WIDTH = Dimensions.get('window').width - 40;
import { Rating, AirbnbRating } from 'react-native-ratings';

const StoreRating = ({ item, onPress }) => {
  const ratingCompleted = (rating) => {
    console.log("Rating is: " + rating)
  };
  return(
    <AirbnbRating 
    onFinishRating = {rating => console.log(rating)}
    />
  );
};

const styles = StyleSheet.create( {
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop:Platform.OS ==='ios'?20:0
  },
  childView: {
    justifyContent: 'center',
    flexDirection:'row',
    marginTop:30
  },
  button: {
    justifyContent: 'center',
    flexDirection:'row',
    marginTop:30,
    padding:15,
    backgroundColor: '#34495e'
  },
  StarImage: {
    width: 40,
    height: 40,
    resizeMode:'cover'
  },
  textStyle: {
    fontSize: 23,
    marginTop: 15,
    textAlign: 'center',
    color: '#000'
  },
  textStyleSmall: {
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
    color: '#000'
  }
} );

export default StoreRating;