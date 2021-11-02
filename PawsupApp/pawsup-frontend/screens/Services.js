import React, { useState } from 'react';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView, TouchableOpacity, ImageBackground, ToastAndroid, View, FlatList, StyleSheet, Text, StatusBar, Image, Dimensions, ViewPagerAndroidComponent} from 'react-native';
import Entry from '../components/Entry';
import { BackgroundStyle, StyledContainer2, PageTitle, } from './../components/styles';


const CAT_IMG = 'https://www.pethealthnetwork.com/sites/default/files/urine-testing-in-cats185922494.png';
const FILTER_IMG = require('./../assets/icons/filter.png');
const SORT_IMG = require('./../assets/icons/sort.png');
const WIDTH = Dimensions.get("window").width;
const SPACING = 20;

const Services = ({ navigation, route }) => {
	//const data = route.params;
	//const currentUser = data["0"];
	//route.params.additional = "temp";

    var tempData = [
        {
            id: 'alio@gmail.com',
            fullname: 'qAli Orozgani',
            rating: 5,
            image: CAT_IMG, 
            email: 'alio@gmail.com',
            price: 15.99,
            description: 'hi i am ali and i will pet your dog very well!',
        },
        {
            id: 'josh@gmail.com',
            fullname: 'Josh',
            rating: 5,
            image: CAT_IMG, 
            email: 'josh@gmail.com',
            price: 69.99,
            description: 'give pet pls',
        },
    ];

	const [filterVisible, setFilterVisible] = useState(false);
	const [selectedPrice, setSelectedPrice] = useState();
	const [selectedDistance, setSelectedDistance] = useState();
	const [displayData, setDisplayData] = useState(tempData);
    const [showStartDate, setShowStartDate] = useState(false);
    const [showEndDate, setShowEndDate] = useState(false);
    const [date, setDate] = useState(new Date(2000, 0, 1));
    const [startDate, setStartDate] = useState("tap to choose");
    const [endDate, setEndDate] = useState("tap to choose");
    var state = {
        textValue: 'tap to choose'
    }


    const onChangeStartDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowStartDate(false);
        setDate(currentDate);
        setStartDate(currentDate);
        if(endDate != "tap to choose") {
            var sday = selectedDate.getDate();
            var smonth = selectedDate.getMonth();
            var syear = selectedDate.getYear();
            var eday = endDate.getDate();
            var emonth = endDate.getMonth();
            var eyear = endDate.getYear();
            handleFilterAvailability({ startdate: sday+'/'+smonth+'/'+syear, enddate: eday+'/'+emonth+'/'+eyear });
        }
    };

    const onChangeEndDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowEndDate(false);
        setDate(currentDate);
        setEndDate(currentDate);
        if(startDate != "tap to choose") {
            var eday = selectedDate.getDate();
            var emonth = selectedDate.getMonth();
            var eyear = selectedDate.getYear();
            var sday = startDate.getDate();
            var smonth = startDate.getMonth();
            var syear = startDate.getYear();
            handleFilterAvailability({ startdate: sday+'/'+smonth+'/'+syear, enddate: eday+'/'+emonth+'/'+eyear });
        }
    };

    const showDatePicker = (startOrEnd) => {
        if(startOrEnd === "start") setShowStartDate(true);
        else setShowEndDate(true);
    };

    const addToData = (req) => {
        const url = "https://protected-shelf-96328.herokuapp.com/api/getListing";
        axios.get(url, {params: req}).then((response) => {
            const result = response.data;
            const { status, message, data } = result;

            if (status !== 'SUCCESS') ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
            else {
                tempData.push(
                    {
                        id: data[0].email,
                        fullname: data[0].fullname,
                        email: data[0].email,
                        price: data[0].price,
                        image: CAT_IMG, 
                        rating: data[0].sumRatings / data[0].numRatings,
                        description: data[0].description,
                    });
                //console.log(data[0]);
                setDisplayData(tempData);
            }
            
        }).catch((error) => {
                ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
            }
        );
    }

    const handleFilterPrice = (req) => {
        const url = "https://protected-shelf-96328.herokuapp.com/api/filterPriceListings";

        axios
            .get(url, {params: req})
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;
                var users_array = [];

                if (status !== 'SUCCESS') ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
                else {
                    tempData = [];
                    setDisplayData(tempData);
                    users_array = data;

                    for(var i = 0; i < users_array.length; i++) {
                        addToData({listingowner: users_array[i]});
                    }
                }
                
            })
            .catch((error) => {
                ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
            });
    }

    const handleFilterAvailability = (req) => {
        const url = "https://protected-shelf-96328.herokuapp.com/api/filterAvailabilityListings";

        axios
            .get(url, {params: req})
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;
                var users_array = [];

                if (status !== 'SUCCESS') ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
                else {
                    tempData = [];
                    setDisplayData(tempData);
                    users_array = data;
                    console.log("RECIEVED:");
                    for(var i = 0; i < users_array.length; i++) {
                        addToData({listingowner: users_array[i]});
                        console.log(users_array[i]);
                    }
                }
                
            })
            .catch((error) => {
                ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
            });
    }
    

    return (
        <StyledContainer2>
            <ImageBackground
                source={require('./../assets/WallpapersAndLogo/ServicesPage.png')}
                resizeMode="cover"
                style={BackgroundStyle.image}
            >
            </ImageBackground>

            <StatusBar style="light" />
            <PageTitle style={{color: 'black', marginTop: 10}}>Available Services</PageTitle>
            
            {(showStartDate || showEndDate) && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    minimumDate={new Date(Date.now())}
                    onChange={(showStartDate ? onChangeStartDate : onChangeEndDate)}
                    style={{
                        backgroundColor: 'yellow',
                    }}
                />
            )}  
            
            {!filterVisible && 
                <SafeAreaView style={{marginTop: 20}}>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                            style={styles.filterButtonStyle}
                            onPress={() => {
                                setFilterVisible(!filterVisible);
                            }}
                            >
                            <Image
                                source={FILTER_IMG}
                                style={styles.buttonImageIconStyle}
                            />
                            <Text style={styles.buttonTextStyle}>
                                FILTER & SORT
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            }
            
            {  /* filter stuff */}
            { filterVisible &&  
                <SafeAreaView style={{margin: 15, alignContent: 'center'}}>

                    {/* area for price filter   */}
                    <SafeAreaView style={{marginVertical: 10, flexDirection: 'row'}}>
                        <View style={{flex: 4}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                                Choose a price range:
                            </Text>
                        </View>
                        <View style={{flex: 3, alignContent: 'center'}}>    
                            <Picker
                                selectedValue={selectedPrice}
                                mode={'dropdown'}
                                dropdownIconColor={'red'}
                                onValueChange={
                                    (itemValue, itemIndex) => {
                                        setSelectedPrice(itemValue);
                                        if(itemValue === "a") handleFilterPrice({ minprice: 0, maxprice: 100000 });
                                        if(itemValue === "b") handleFilterPrice({ minprice: 0, maxprice: 10 });
                                        if(itemValue === "c") handleFilterPrice({ minprice: 10, maxprice: 20 });
                                        if(itemValue === "d") handleFilterPrice({ minprice: 20, maxprice: 50 });
                                        if(itemValue === "e") handleFilterPrice({ minprice: 50, maxprice: 100 });
                                        if(itemValue === "f") handleFilterPrice({ minprice: 100, maxprice: 100000 });
                                    }
                                }
                            >
                                <Picker.Item label="Any" value="a" />
                                <Picker.Item label="Under $10" value="b" />
                                <Picker.Item label="$10 to $20" value="c" />
                                <Picker.Item label="$20 to $50" value="d" />
                                <Picker.Item label="$50 to $100" value="e" />
                                <Picker.Item label="Over $100" value="f" />
                            </Picker>
                        </View>
                    </SafeAreaView>

                    {/* place for start date filter */}
                    <SafeAreaView style={{marginVertical: 10, flexDirection: 'row'}}>
                        <View style={{flex: 4}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                                Choose starting date:
                            </Text>
                        </View>
                        <View style={{flex: 3, alignContent: 'center', paddingLeft: 17}}>    
                            <Text
                                onPress={() => showDatePicker("start")}
                                style={{fontSize: 16}}
                                >
                                {startDate.toString().split(/(\s+)/).slice(0,7)} 
                            </Text>
                        </View>
                    </SafeAreaView>

                    {/* place for end date filter */}
                    <SafeAreaView style={{marginVertical: 10, flexDirection: 'row'}}>
                        <View style={{flex: 4}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                                Choose starting date:
                            </Text>
                        </View>
                        <View style={{flex: 3, alignContent: 'center', paddingLeft: 17}}>    
                            <Text
                                onPress={() => showDatePicker("end")}
                                style={{fontSize: 16}}
                                >
                                {endDate.toString().split(/(\s+)/).slice(0,7)} 
                            </Text>
                        </View>
                    </SafeAreaView>

                    <TouchableOpacity
                        style={{
                            marginTop: 30,
                            flexDirection: 'row',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            borderWidth: 3,
                            borderColor: '#000',
                            width: WIDTH / 2 - 30,
                            height: 50,
                            borderRadius: 10,
                            alignSelf: 'center',
                        }}
                        onPress={() => {
                            setFilterVisible(!filterVisible);
                        }}
                    >
                        <Text style={{
                            fontSize: 20,
                            alignSelf: 'center',
                            color: '#000',
                            flex: 1,
                            textAlign: 'center',
                        }}>
                            DONE
                        </Text>
                    </TouchableOpacity>
                </SafeAreaView>
            }

            { /* items themselves  */}
			{ !filterVisible &&
				<SafeAreaView style={styles.container}>
					<FlatList
						data={displayData}
						style={{ flex: 1 }}
						contentContainerStyle={{
							padding: SPACING
						}}
						columnWrapperStyle={{
							justifyContent: 'space-between',
							marginBottom: 15,
						}}
						numColumns={2}
						renderItem={({item, index}) => {
							
							return <TouchableOpacity
								onPress={
									() => {
										var routeParams = route.params;

										navigation.navigate('DetailedListing', {
											routeParams,
											listingemail: item.email
										});
									}
								}
							>
								<Entry item={item} />
							</TouchableOpacity>
						}}
						keyExtractor={item => item.id}
					/>
				</SafeAreaView>
			}
		</StyledContainer2>
	);
}

const styles = StyleSheet.create({
    dropdownstyle: {
        backgroundColor: 'black',
    },
    container: {
        paddingHorizontal: 5,
        flex: 1,
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
    },
    filterButtonStyle: {
        marginLeft: 25,
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderWidth: 0,
        borderColor: '#000',
        width: WIDTH / 2 - 40,
        height: 25,                  /* THIS IS A FIXED VALUE. CHANGE LATER??? */
        borderRadius: 10,
    },
    buttonImageIconStyle: {
        width: 35,                  /* THIS IS A FIXED VALUE. CHANGE LATER??? */
        height: '100%',
        resizeMode: 'contain',
    },
    buttonTextStyle: {
        fontSize: 15,
        alignSelf: 'center',
        marginLeft: 2,
        color: '#000',
        flex: 1,
    },

});

export default Services;
