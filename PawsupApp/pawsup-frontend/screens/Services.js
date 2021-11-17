import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Modal, SafeAreaView, TouchableOpacity, ImageBackground, ToastAndroid, View, FlatList, StyleSheet, Text, StatusBar, Image, Dimensions, ViewPagerAndroidComponent, Touchable} from 'react-native';
import Entry from '../components/Entry';
import { BackgroundStyle, StyledContainer2, PageTitle, } from './../components/styles';


const CAT_IMG = 'https://www.pethealthnetwork.com/sites/default/files/urine-testing-in-cats185922494.png';
const FILTER_IMG = require('./../assets/icons/filter.png');
const SORT_IMG = require('./../assets/icons/sort.png');
const WIDTH = Dimensions.get("window").width;
const SPACING = 20;

const Services = ({ navigation, route }) => {
    var tempData = [];
	const [filterVisible, setFilterVisible] = useState(false);
	const [selectedPrice, setSelectedPrice] = useState();
	const [displayData, setDisplayData] = useState(tempData);
    const [showStartDate, setShowStartDate] = useState(false);
    const [showEndDate, setShowEndDate] = useState(false);
    const [date, setDate] = useState(new Date(2000, 0, 1));
    const [startDate, setStartDate] = useState("tap to choose");
    const [endDate, setEndDate] = useState("tap to choose");
    const [firstRender, setFirstRender] = useState(false);
    const [selectedSortMethod, setSelectedSortMethod] = useState("");

    const handleSort = (req) => {
        const url = "https://protected-shelf-96328.herokuapp.com/api/sortListings" + req;
        axios
            .get(url)
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
                        tempData.push(
                            {
                                id: data[i].listingowner,
                                fullname: data[i].fullname,
                                listingowner: data[i].listingowner,
                                price: data[i].price,
                                image: CAT_IMG, 
                                rating: data[i].rating,
                                description: data[i].description,
                            });
                    }
                    setDisplayData(tempData);
                }
                
            })
            .catch((error) => {
                ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
            });
    };

    const onChangeStartDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowStartDate(false);
        setDate(currentDate);
        setStartDate(currentDate);
        setSelectedPrice("a");
        setSelectedSortMethod("a");
        if(endDate != "tap to choose") {
            var sday = selectedDate.getDate();
            var smonth = selectedDate.getMonth() + 1;
            var syear = selectedDate.getFullYear();
            var eday = endDate.getDate();
            var emonth = endDate.getMonth() + 1;
            var eyear = endDate.getFullYear();
            var startdate = (syear + '/' + smonth + '/' + sday).toString();
            var enddate = (eyear + '/' + emonth + '/' + eday).toString();
            handleFilterAvailability("?startdate=" + startdate + "&enddate=" + enddate);
        }
    };

    const onChangeEndDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowEndDate(false);
        setDate(currentDate);
        setEndDate(currentDate);
        setSelectedPrice("a");
        setSelectedSortMethod("a");
        if(startDate != "tap to choose") {
            var eday = selectedDate.getDate();
            var emonth = selectedDate.getMonth() + 1;
            var eyear = selectedDate.getFullYear();
            var sday = startDate.getDate();
            var smonth = startDate.getMonth() + 1;
            var syear = startDate.getFullYear();
            var startdate = (syear + '/' + smonth + '/' + sday).toString();
            var enddate = (eyear + '/' + emonth + '/' + eday).toString();
            handleFilterAvailability("?startdate=" + startdate + "&enddate=" + enddate);
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
                        id: data[0].listingowner,
                        fullname: data[0].fullname,
                        listingowner: data[0].listingowner,
                        price: data[0].price,
                        image: CAT_IMG, 
                        rating: data[0].rating,
                        description: data[0].description,
                    });
                setDisplayData(tempData);
            }
            
        }).catch((error) => {
                ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
            }
        );
    };

    const addToData2 = (req) => {
        // don't ask why this exists
        const url = "https://protected-shelf-96328.herokuapp.com/api/getListing";
        axios.get(url, {params: req}).then((response) => {
            const result = response.data;
            const { status, message, data } = result;

            if (status !== 'SUCCESS') ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
            else {
                tempData.push(
                    {
                        id: data[0].listingowner,
                        fullname: data[0].fullname,
                        listingowner: data[0].listingowner,
                        price: data[0].price,
                        image: CAT_IMG, 
                        rating: data[0].rating,
                        description: data[0].description,
                    });
                setDisplayData(tempData);
                setFilterVisible(true);     //trick to make things work
                setFilterVisible(false);
            }
            
        }).catch((error) => {
                ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
            }
        );
    };

    const getAllListings = () => {
        const url = "https://protected-shelf-96328.herokuapp.com/api/filterPriceListings?minprice=0&maxprice=1000000";
        axios.get(url).then((response) => {
            const result = response.data;
            const { status, message, data } = result;

            if (status !== 'SUCCESS') ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
            else {
                
                for(var i = 0; i < data.length; i++) {
                    addToData2({'listingowner': data[i]});
                }
                setDisplayData(tempData);
            }
            
        }).catch((error) => {
                ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
            }
        );
    };

    const handleFilterPrice = (req) => {
        const url = "https://protected-shelf-96328.herokuapp.com/api/filterPriceListings" + req;

        axios
            .get(url)
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
    };

    const handleFilterAvailability = (req) => {
        const url = "https://protected-shelf-96328.herokuapp.com/api/filterAvailabilityListings" + req;

        axios
            .get(url)
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
    };
    
    useEffect(() => {
        if(!firstRender) {
            getAllListings();
            setFirstRender(true);
            setDisplayData(tempData);
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
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <TouchableOpacity
                            style={styles.filterButtonStyle}
                            onPress={() => {
                                setFilterVisible(!filterVisible);
                            }}
                            >
                            <Text style={styles.buttonTextStyle}>
                                FILTER & SORT
                            </Text>
                            <Image
                                source={FILTER_IMG}
                                style={styles.buttonImageIconStyle}
                            />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            }
            
            {  /* filter and sort stuff */}
            { filterVisible &&  
                <SafeAreaView style={{margin: 15, alignContent: 'center', flexGrow: 1, backgroundColor: 'rgba(255, 255, 255, 0)'}}>
                    <View> 
                        <Text style={{fontSize: 29, fontWeight: 'bold'}}>
                            Filter:
                        </Text>
                    </View>
                    <View
                        style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                        }}
                    />

                    {/* area for price filter   */}
                    <SafeAreaView style={{marginVertical: 10, flexDirection: 'row'}}>
                        <View style={{flex: 2}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                                {"   Price range:"}
                            </Text>
                        </View>
                        <View style={{flex: 3, alignContent: 'center'}}>    
                            <Picker
                                selectedValue={selectedPrice}
                                mode={'dropdown'}
                                onValueChange={
                                    (itemValue, itemIndex) => {
                                        setSelectedPrice(itemValue);
                                        setStartDate("tap to choose");
                                        setEndDate("tap to choose");
                                        setSelectedSortMethod("a");
                                        if(itemValue === "a") handleFilterPrice("?minprice=0&maxprice=10000");
                                        if(itemValue === "b") handleFilterPrice("?minprice=0&maxprice10");
                                        if(itemValue === "c") handleFilterPrice("?minprice=10&maxprice=20");
                                        if(itemValue === "d") handleFilterPrice("?minprice=20&maxprice=50");
                                        if(itemValue === "e") handleFilterPrice("?minprice=50&maxprice=100");
                                        if(itemValue === "f") handleFilterPrice("?minprice=100&maxprice=10000");
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
                        <View style={{flex: 2}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                                {"   Starting date:"}
                            </Text>
                        </View>
                        <View style={{flex: 3, alignContent: 'center', paddingLeft: 10}}>    
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
                        <View style={{flex: 2}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                                {"   Ending date:"}
                            </Text>
                        </View>
                        <View style={{flex: 3, alignContent: 'center', paddingLeft: 10}}>    
                            <Text
                                onPress={() => showDatePicker("end")}
                                style={{fontSize: 16}}
                                >
                                {endDate.toString().split(/(\s+)/).slice(0,7)} 
                            </Text>
                        </View>
                    </SafeAreaView>

                    <View> 
                        <Text style={{fontSize: 29, fontWeight: 'bold', paddingTop: 50}}>
                            Sort:
                        </Text>
                    </View>
                    <View style={{borderBottomColor: 'black', borderBottomWidth: 1}}>
                    </View>

                    {/* area for sort tings ykwis */}
                    <SafeAreaView style={{marginVertical: 10, flexDirection: 'row'}}>
                        <View style={{flex: 3}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                                {"   Sort method:"}
                            </Text>
                        </View>
                        <View style={{flex: 6, alignContent: 'center'}}>    
                            <Picker
                                selectedValue={selectedSortMethod}
                                mode={'dropdown'}
                                onValueChange={
                                    (itemValue, itemIndex) => {
                                        setSelectedSortMethod(itemValue);
                                        setStartDate("tap to choose");
                                        setEndDate("tap to choose");
                                        setSelectedPrice("a");
                                        if(itemValue === "a") handleFilterPrice("?minprice=0&maxprice=10000");
                                        if(itemValue === "b") handleSort("?sortVal=title&order=desc");
                                        if(itemValue === "c") handleSort("?sortVal=title&order=asc");
                                        if(itemValue === "d") handleSort("?sortVal=rating&order=desc");
                                        if(itemValue === "e") handleSort("?sortVal=rating&order=asc");
                                        if(itemValue === "f") handleSort("?sortVal=cost&order=desc");
                                        if(itemValue === "g") handleSort("?sortVal=cost&order=asc");
                                        if(itemValue === "h") handleSort("?sortVal=features&order=desc");
                                        if(itemValue === "i") handleSort("?sortVal=features&order=asc");
                                        if(itemValue === "j") handleSort("?sortVal=description&order=desc");
                                        if(itemValue === "k") handleSort("?sortVal=description&order=asc");
                                    }
                                }
                            >
                                <Picker.Item label="Any" value="a" />
                                <Picker.Item label="Title (high to low)" value="b" />
                                <Picker.Item label="Title (low to high)" value="c" />
                                <Picker.Item label="Rating (high to low)" value="d" />
                                <Picker.Item label="Rating (low to high)" value="e" />
                                <Picker.Item label="Cost (high to low)" value="f" />
                                <Picker.Item label="Cost (low to high)" value="g" />
                                <Picker.Item label="Features (high to low)" value="h" />
                                <Picker.Item label="Features (low to high)" value="i" />
                                <Picker.Item label="Description (high to low)" value="j" />
                                <Picker.Item label="Description (low to high)" value="k" />

                            </Picker>
                        </View>
                    </SafeAreaView>

                    {/* DONE button */}
                    <View style={{position: 'absolute', position: 'absolute', bottom: 40, alignSelf: 'center'}}>
                        <TouchableOpacity
                            style={{
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
                    </View>
                </SafeAreaView>
                
            
            }

            { /* items themselves  */}
			{ !filterVisible && displayData.length > 0 &&
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
							
							return (
                                <TouchableOpacity
                                    onPress={
                                        () => {
                                            var routeParams = route.params;
                                            navigation.navigate('DetailedListing', {
                                                routeParams,
                                                listingemail: item.listingowner,
                                                cost: item.price
                                            });
                                        }
                                    }
							    >
								    <Entry item={item} style={{}} />
							    </TouchableOpacity>
                            )
						}}
						keyExtractor={item => item.id}
					/>
				</SafeAreaView>
			}

            { /* No items found message  */}
			{ !filterVisible && displayData.length === 0 &&
				<SafeAreaView style={styles.container}>
					<Text style={{alignSelf: 'center', fontSize: 30, fontWeight: 'bold'}}>
                        No items found!
                    </Text>
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
        justifyContent: 'center',
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
        marginRight: 25,
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderWidth: 2,
        borderColor: '#000',
        width: WIDTH / 2 - 40,
        height: 35,                  /* THIS IS A FIXED VALUE. CHANGE LATER??? */
        borderRadius: 10,
        paddingVertical: 2,
    },
    buttonImageIconStyle: {
        width: 35,                  /* THIS IS A FIXED VALUE. CHANGE LATER??? */
        height: '100%',
        resizeMode: 'contain',
    },
    buttonTextStyle: {
        fontSize: 17,
        alignSelf: 'center',
        marginLeft: 2,
        marginTop: 2,
        color: '#000',
        flex: 1,
        textAlign: 'right',
    },

});

export default Services;
