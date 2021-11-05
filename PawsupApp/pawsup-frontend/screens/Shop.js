import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
import { SafeAreaView, TouchableOpacity, ImageBackground, ToastAndroid, View, FlatList, StyleSheet, Text, StatusBar, Image, Dimensions, ViewPagerAndroidComponent} from 'react-native';
import Item from '../components/Item';
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

    var tempData = [];

	const [filterVisible, setFilterVisible] = useState(false);
	const [selectedPrice, setSelectedPrice] = useState();
    const [selectedPetType, setSelectedPetType] = useState();
	const [displayData, setDisplayData] = useState(tempData);
    const [firstRender, setFirstRender] = useState(false);

    const getAllItems = () => {
        const url = "https://protected-shelf-96328.herokuapp.com/api/getAllItems";
        axios.get(url).then((response) => {
            const result = response.data;
            const { status, message, data } = result;

            if (status !== 'SUCCESS') ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
            else {
                for(var i = 0; i < data.length; i++) {
                    var item = {
                        id: data[i].id + data[i].name + data[i].price + data[i].image,
                        name: data[i].name,
                        price: data[i].price,
                        image: data[i].image, 
                        description: data[i].description,
                        remaining: data[i].quantity
                    }
                    if(!tempData.includes(item)) tempData.push(item);
                }
                setDisplayData(tempData);
            }
            
        }).catch((error) => {
                ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
            }
        );
    }
    
    const addToData = (req) => {
        const url = "https://protected-shelf-96328.herokuapp.com/api/getItem";
        axios.get(url, {params: req}).then((response) => {
            const result = response.data;
            const { status, message, data } = result;

            if (status !== 'SUCCESS') ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
            else {
                tempData.push(
                    {
                        id: data[0].id + data[0].name + data[0].price + data[0].image,
                        name: data[0].name,
                        price: data[0].price,
                        image: data[0].image, 
                        description: data[0].description,
                        remaining: data[0].quantity
                    });
                setDisplayData(tempData);
            }
            
        }).catch((error) => {
                ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
            }
        );
    }

    const handleFilterPrice = (req) => {
        const url = "https://protected-shelf-96328.herokuapp.com/api/filterPriceItemListings" + req;

        axios
            .get(url)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;

                if (status !== 'SUCCESS') ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
                else {
                    tempData = [];
                    setDisplayData(tempData);
                    
                    for(var i = 0; i < data.length; i++) {
                        addToData({'name': data[i]});
                    }
                }
                
            })
            .catch((error) => {
                ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
            });
    }

    const handleFilterPetType = (req) => {
        const url = "https://protected-shelf-96328.herokuapp.com/api/filterPettypeItemListings" + req;

        axios
            .get(url)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;

                if (status !== 'SUCCESS') ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
                else {
                    tempData = [];
                    setDisplayData(tempData);
                    console.log(data);
                    for(var i = 0; i < data.length; i++) {
                        addToData({name: data[i]});
                    }
                }
                
            })
            .catch((error) => {
                console.log(error);
                ToastAndroid.show('An error occured. Try again later.', ToastAndroid.SHORT);
            });
    }
    
    useEffect(() => {
        if(!firstRender) {
            getAllItems();
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
            <PageTitle style={{color: 'black', marginTop: 10}}>Shop</PageTitle>
            
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
                                        setSelectedPetType("a");
                                        if(itemValue === "a") handleFilterPrice("?minprice=0&maxprice=10000");
                                        if(itemValue === "b") handleFilterPrice("?minprice=0&maxprice=10");
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


                    {/* area for pet-type filter  */}
                    <SafeAreaView style={{marginVertical: 10, flexDirection: 'row'}}>
                        <View style={{flex: 4}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                                Choose a pet type:
                            </Text>
                        </View>
                        <View style={{flex: 3, alignContent: 'center'}}>    
                            <Picker
                                selectedValue={selectedPetType}
                                mode={'dropdown'}
                                dropdownIconColor={'red'}
                                onValueChange={
                                    (itemValue, itemIndex) => {
                                        setSelectedPetType(itemValue);
                                        setSelectedPrice("a");
                                        if(itemValue === "a") handleFilterPetType("?pettype=any");
                                        if(itemValue === "b") handleFilterPetType("?pettype=dog");
                                        if(itemValue === "c") handleFilterPetType("?pettype=cat");
                                        if(itemValue === "d") handleFilterPetType("?pettype=hamster");
                                        if(itemValue === "e") handleFilterPetType("?pettype=rabbit");
                                        if(itemValue === "f") handleFilterPetType("?pettype=fish");
                                        if(itemValue === "g") handleFilterPetType("?pettype=robot");
                                        if(itemValue === "h") handleFilterPetType("?pettype=rhino");
                                    }
                                }
                            >
                                <Picker.Item label="Any" value="a" />
                                <Picker.Item label="Dog" value="b" />
                                <Picker.Item label="Cat" value="c" />
                                <Picker.Item label="Hamster" value="d" />
                                <Picker.Item label="Rabbit" value="e" />
                                <Picker.Item label="Fish" value="f" />
                                <Picker.Item label="Robot" value="g" />
                                <Picker.Item label="Rhino" value="h" />

                            </Picker>
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
								<Item item={item} />
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
