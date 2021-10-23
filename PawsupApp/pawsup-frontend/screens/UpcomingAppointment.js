import React, {useState} from 'react';
import { SafeAreaView, ImageBackground, View, FlatList, StyleSheet, Text, StatusBar, Image, Dimensions } from 'react-native';
import Entry2 from '../components/Entry2';
import axios from 'axios';
import {
    BackgroundStyle,
    StyledContainer2,
    StyledContainer,
    InnerContainer,
    PageTitle,
    StyledFormArea,
    LeftIcon,
    RightIcon,
    StyledInputLabel,
    StyledTextInput,
    StyledButton,
    MsgBox,
    ExtraView,
    ExtraText,
    TextLink,
    TextLinkContent,
    Colours,
    ButtonText,
    StyledButtonAppointmentPage
} from '../components/styles';

const UpcomingAppointment = ({ navigation ,route}) => {
   //get a list of appointments from database 
    //this is temp list
    //const [message, setMessage] = useState();
//const [messageType, setMessageType] = useState();
    //const email = route.email;
    /*
    const appointment = [];

    const handleGetAppointment = (email) => {
        handleMessage(null);
        const url = "https://protected-shelf-96328.herokuapp.com/api/getListing";
        axios
            .get(url, email)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;
                
                appointment.push(data[0].bookings);
                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                }
                console.log(appointment);
                setSubmitting(false);
            })
            .catch((error) => {
                setSubmitting(false);
                handleMessage('An error occurred. Check your network and try again');
            });
    }
    */
    const DATA = [
        {
            id: 'bd7acbea-c1b1-c-aed5-3ad53abb28ba',
            time: 'Thu October 21',
            name: 'Ali Orozgani',
        },
        {
            id: 'b2',
            time: 'Fri October 22',
            name: 'Josh',
        },
        {
            id: 'b3',
            time: 'Sat October 23',
            name: 'Zozozozozozozozoz',
        },
        {
            id: 'bd7]acbea-c1b1-46c2-aed5-3ad53abb28b',
            time: 'Sun October 24',
            name: 'Sir Oswald',
        },
        {
            id: 'bd7acbea-c1asdfb1-46c2-aed5-3ad53ab28b',
            time: 'Mon October 25',
            name: 'Ray',
        },
        {
            id: 'bd7acbefnela-c1asdfb1-46c2-aed5-3ad53ab28b',
            time: 'Tue October 26',
            name: 'Ray',
        },
    ];
    const WIDTH = Dimensions.get("window").width - 20;
    const SPACING = 20;
    const screenWidth = Dimensions.get("window").width;
    const numColumns = 1;
    const tileSize = screenWidth ;

        /*
     * Handles cancelling booking which updates database
     * Pass in email of listingowner, startdate and enddate of appointment, i.e. listingowner, startdate, enddate
     * dates must be in YYYY/MM/DD format
    */
   /*
    const handleCancel = (credentials, setSubmitting) => {
    handleMessage(null);
    const url = "https://protected-shelf-96328.herokuapp.com/api/cancelAppointment";

    axios
        .put(url, credentials)
        .then((response) => {
            const result = response.data;
            const { status, message, data } = result;

            if (status !== 'SUCCESS') {
                handleMessage(message, status);
            }
            setSubmitting(false);
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
    */
    const Item = ({ title }) => (
	    <View style={styles.item}>
		    <Text style={styles.title}>{title}</Text>
	    </View>
    );
     //handleGetAppointment(email);
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
					data={DATA}
					style={{
						margin:5,
						flex: 1
					}}
					contentContainerStyle={{
						padding: SPACING,
                        justifyContent: 'center'
					}}
					
					numColumns={1}
					renderItem={({item, index}) => {
						return <View>
                            
							    <Entry2 item={item} />
                                <View>
                        <StyledButtonAppointmentPage onPress={() => navigation.navigate('Services', data)}>
                            <ButtonText>Cancel</ButtonText>
                        </StyledButtonAppointmentPage>
                        </View>
						    </View>
                      
					}}
                
                    ListHeaderComponent = {()=>{
                        return <PageTitle>Upcoming Appointments</PageTitle>
                    }}
                    
					keyExtractor={item => item.id}
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

export default UpcomingAppointment;