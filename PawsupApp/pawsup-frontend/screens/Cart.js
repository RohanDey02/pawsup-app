import React, {useState, useEffect } from 'react';
import { SafeAreaView, ImageBackground, View, FlatList, StyleSheet, Text, StatusBar, Dimensions, Alert } from 'react-native';
import EntryCart from '../components/EntryCart';
import axios from 'axios';
import {
    BackgroundStyle,
    StyledContainer2,
    PageTitle,
    ButtonText,
    StyledButtonAppointmentPage
} from '../components/styles';

const Cart = ({ navigation, route }) => {
    const WIDTH = Dimensions.get("window").width - 20;
    const SPACING = 20;
    const screenWidth = Dimensions.get("window").width;
    const numColumns = 1;
    const tileSize = screenWidth ;

    const nav = route.params;
    console.log(route.params.routeParams.email);

    const [cart, setCart] = useState([]);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [price, setPrice] = useState();
    const [firstRender, setFirstRender] = useState(false);


    const handleGetCart = (email) => {
        const url = "https://protected-shelf-96328.herokuapp.com/api/getInCart?email=" + email;
        axios
            .get(url)
            .then((response) => {
                const result = response.data;
                const { status, message, data ,totalPrice} = result;
                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                } else {
                    setCart(data);
                    if(totalPrice >= 0) setPrice(totalPrice);
                    else setPrice(0);
                    console.log("done");
                    console.log(data);
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

    /*
     * Handles cancelling booking which updates database
     * Pass in email of email, startdate and enddate of appointment, i.e. email, startdate, enddate
     * dates must be in YYYY/MM/DD format
    */
    const handleCancel = (email,item) => {
        const url = "https://protected-shelf-96328.herokuapp.com/api/removeFromCart";
        var credentials = { email: email, item: item, quantity:'1'};
        axios
            .put(url, credentials)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;
                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                } else {
                    console.log(route.params);
                    Alert.alert('SUCCESS', 'Your booking has been cancelled.', [
                        {text: 'OK'}
                    ]);
                }
            })
            .catch((error) => {
                handleMessage('An error occurred. Check your network and try again');
            });
    }
    

    const Item = ({ title }) => (
	    <View style={styles.item}>
		    <Text style={styles.title}>{title}</Text>
	    </View>
    );

    
    useEffect(() => {
        if(!firstRender) {
            handleGetCart(route.params.routeParams.email);
            setFirstRender(true);
        }
    });

    return (
        <StyledContainer2>
			<ImageBackground
				source={require('./../assets/WallpapersAndLogo/ServicesPage.png')}
				resizeMode="cover"
				style={BackgroundStyle.image}
            >
			</ImageBackground>

			<StatusBar style="light" />
			
			<SafeAreaView style={styles.container}>
				<FlatList
					data={cart}
					style={{
						margin:5,
						flex: 1
					}}
					contentContainerStyle={{
						padding: SPACING,
                        justifyContent: 'center'
					}}
					
					numColumns={1}
					renderItem={({item}) => {
						return <View>
                            <EntryCart item={item} />
                            <StyledButtonAppointmentPage onPress={() => handleCancel(route.params.routeParams.email, item.name)}>
                                <ButtonText>Remove</ButtonText>
                            </StyledButtonAppointmentPage>
                        </View>
					}}
                    ListHeaderComponent = {() => {
                        return <PageTitle>Cart</PageTitle>
                    }}
                    ListFooterComponent = {() => {
                        return <View>
                        <View style={{flex:1}}>
                        <Text style={{fontWeight: "bold", fontSize: 17, alignSelf: 'center'}}>
                            {'Total: ' + price}
                        </Text>
                        </View>
                        <StyledButtonAppointmentPage onPress={() => navigation.navigate('UpcomingAppointment', nav)}>
                                <ButtonText>Checkout</ButtonText>
                        </StyledButtonAppointmentPage>
                    </View>
                    }}
					keyExtractor={item => item._id}
				/>
			</SafeAreaView>
		</StyledContainer2>    
    );
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 5,
		flex: 1,
		marginTop: StatusBar.currentHeight ?  StatusBar.currentHeight : 0,
	},
	item: {
		backgroundColor: '#f9c2ff',
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,  
	},
	title: {
		fontSize: 32,
	},
	bgimg: {
		flex: 1,
		justifyContent: "center"
	}
});

export default Cart;