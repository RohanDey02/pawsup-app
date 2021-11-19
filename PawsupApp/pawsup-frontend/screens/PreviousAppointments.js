import React, {useState, useEffect} from 'react';
import { SafeAreaView, ImageBackground, View, FlatList, StyleSheet, Text, StatusBar, Dimensions, LogBox } from 'react-native';
import ListingRating from '../components/ListingRating';
import Entry2 from '../components/Entry2';
import axios from 'axios';

import {
    BackgroundStyle,
    StyledContainer2,
    PageTitle
} from '../components/styles';

LogBox.ignoreLogs([
    'Encountered two children with the same key',
]);

const PreviousAppointments = ({ navigation, route }) => {
    const [listing, setListing] = useState([]);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [firstRender, setFirstRender] = useState(false);


    const handleGetListing = (listingowner) => {
        const url = "https://protected-shelf-96328.herokuapp.com/api/getPreviousBookings?petowner=" + listingowner;
        axios
            .get(url)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;
                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                } else {
                    //console.log(data);
                    setListing(data);
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

    const WIDTH = Dimensions.get("window").width - 20;
    const SPACING = 20;
    const screenWidth = Dimensions.get("window").width;
    const numColumns = 1;
    const tileSize = screenWidth ;

    const Item = ({ title }) => (
	    <View style={styles.item}>
		    <Text style={styles.title}>{title}</Text>
	    </View>
    );
    

    useEffect(() => {
        if(!firstRender) {
            handleGetListing(route.params.email);
            console.log(listing);
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
					data={listing}
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
                            <Entry2 item={item} />
                            <ListingRating item={item} />
                        </View>
					}}
                
                    ListHeaderComponent = {() => {
                        return <PageTitle>Previous Appointments</PageTitle>
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

export default PreviousAppointments;