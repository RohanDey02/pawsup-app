import React, { useState } from 'react';
import {Picker} from '@react-native-picker/picker';
import { SafeAreaView, TouchableOpacity, ImageBackground, View, FlatList, StyleSheet, Text, StatusBar, Image, Dimensions} from 'react-native';
import Entry from '../components/Entry';

import { BackgroundStyle, StyledContainer2, PageTitle, } from './../components/styles';

// API Client
import axios from 'axios';

const CAT_IMG = 'https://www.pethealthnetwork.com/sites/default/files/urine-testing-in-cats185922494.png';
const FILTER_IMG = require('./../assets/icons/filter.png');
const SORT_IMG = require('./../assets/icons/sort.png');

// some data i guess?
const ALL_DATA = [
	{
		id: 'bd7acbea-c1b1-c-aed5-3ad53abb28ba',
		name: 'qAli Orozgani',
		gender: 'Male',
		image: CAT_IMG, 
		email: 'alio@gmail.com',
		price: 15.99,
		description: 'hi i am ali and i will pet your dog very well!',
	},
	{
		id: 'b2',
		name: 'Josh',
		gender: 'Male',
		image: CAT_IMG, 
		email: 'josh@gmail.com',
		price: 69.99,
		description: 'give pet pls',
	},
	{
		id: 'b3',
		name: 'Zozozozozozozozoz',
		gender: 'Male',
		image: CAT_IMG, 
		email: 'ozozozozo@gmail.com',
		price: 10.99,
		description: 'hi i am zozo',
	},
	{
		id: 'bd7acbea-c1bad53abb28b',
		name: 'John',
		gender: 'Male',
		image: CAT_IMG, 
		email: 'john@gmail.com',
		price: 10.01,
		description: 'hi i am john',
	},
	{
		id: 'bd7acbea-c1b1-46c2-aed5-3adabb28b',
		name: 'John2',
		gender: 'Male',
		image: CAT_IMG, 
		email: 'john2@gmail.com',
		price: 999.9,
		description: 'hi i am john2',
	},
	{
		id: 'bd7abea-c1b1-46c2-aed5-3ad53abb28b',
		name: 'John',
		gender: 'Male',
		image: CAT_IMG, 
		email: 'john@gmail.com',
		price: 0.99,
		description: 'hi i am john',
	},
	{
		id: '7acbea-c1b1-46c2-aed5-3ad53abb28b',
		name: 'John3',
		gender: 'Male',
		image: CAT_IMG, 
		email: 'john3@gmail.com',
		price: 90.90,
		description: 'hi i am john3',
	},
	{
		id: 'bd7]acbea-c1b1-46c2-aed5-3ad53abb28b',
		name: 'Sir Oswald',
		gender: 'Male',
		image: CAT_IMG, 
		email: 'jadsf@gmail.com',
		price: 0.44,
		description: 'I will provide your my best service.',
	},
	{
		id: 'bd7acbea-c1asdfb1-46c2-aed5-3ad53ab28b',
		name: 'Ray',
		gender: 'Male',
		image: CAT_IMG, 
		email: 'ray@gmail.com',
		price: 48.00,
		description: 'i shall make your pet happy',
	},
	{
		id: 'bd7acbea-c1asdfb1-46c2-aed5-3ad53ab28c',
		name: 'Ali Orozgani',
		gender: 'Male',
		image: CAT_IMG, 
		email: 'ali@gmail.com',
		price: 3.00,
		description: 'i shall make your pet happy',
	},
];

const WIDTH = Dimensions.get("window").width;
const SPACING = 20;
const screenWidth = Dimensions.get("window").width;
const numColumns = 2;
const tileSize = screenWidth / numColumns;

const Services = ({ navigation, route }) => {
	//const data = route.params;
	//const currentUser = data["0"];
	//route.params.additional = "temp";

	const [filterVisible, setFilterVisible] = useState(false);
	const [selectedPrice, setSelectedPrice] = useState();
	const [selectedDistance, setSelectedDistance] = useState();
	const [displayData, setDisplayData] = useState(ALL_DATA);

	const handleFilter = (req) => {
        const url = "https://protected-shelf-96328.herokuapp.com/api/filterPriceListings";
		console.log(req)
        axios
            .get(url, req)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;
                console.log(status);
				console.log(message);
				console.log(data);
                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                } else {
                    //console.log("YAYYYYYY");
					//console.log(response.data.data);
                }
                
            })
            .catch((error) => {
				console.log("ERROR HERE!!!");
				console.log(error);
                //handleMessage('An error occurred. Check your network and try again');
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

			{ filterVisible &&  
				<SafeAreaView style={{margin: 15, alignContent: 'center'}}>

					{/*	area for price filter	*/}
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
										
										if(itemValue === "a") {
											handleFilter(
												{
													minprice: -1,
													maxprice: 1000
												}
											);
										}

										const neww = [];
										for(var i = 0; i < ALL_DATA.length; i++) {
											if(itemValue === "a") {
												neww.push(ALL_DATA[i]);
											}else if(itemValue === "b") {
												if(ALL_DATA[i].price <= 10)
													neww.push(ALL_DATA[i]);
											}else if(itemValue === "c") {
												if(ALL_DATA[i].price >= 10 && ALL_DATA[i].price <= 20)
													neww.push(ALL_DATA[i]);
											}else if(itemValue === "d") {
												if(ALL_DATA[i].price >= 20 && ALL_DATA[i].price <= 50)
													neww.push(ALL_DATA[i]);
											}else if(itemValue === "e") {
												if(ALL_DATA[i].price >= 50 && ALL_DATA[i].price <= 100)
													neww.push(ALL_DATA[i]);
											}else if(itemValue === "f") {
												if(ALL_DATA[i].price >= 100)
													neww.push(ALL_DATA[i]);
											}
										}
										//console.log(neww);
										setDisplayData(neww);
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

					{/* place for distance filter */}
					<SafeAreaView style={{marginVertical: 10, flexDirection: 'row'}}>
						<View style={{flex: 4}}>
							<Text style={{fontSize: 18, fontWeight: 'bold'}}>
								Choose a distance range:
							</Text>
						</View>
						<View style={{flex: 3, alignContent: 'center'}}>	
							<Picker
								selectedValue={selectedDistance}
								mode={'dropdown'}
								dropdownIconColor={'red'}
								onValueChange={(itemValue, itemIndex) => setSelectedDistance(itemValue)}
							>
								<Picker.Item label="Any" value="any" />
								<Picker.Item label="Under 1km" value="0,10" />
								<Picker.Item label="1km - 2km" value="10,20" />
								<Picker.Item label="2km - 5km" value="20,50" />
								<Picker.Item label="5km - 10km" value="50,100" />
								<Picker.Item label="10km - 20km" value="100,inf" />
								<Picker.Item label="Over 20km" value="100,inf" />
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
		height: 25,					 /* THIS IS A FIXED VALUE. CHANGE LATER??? */
		borderRadius: 10,
	},
	buttonImageIconStyle: {
		width: 35,					/* THIS IS A FIXED VALUE. CHANGE LATER??? */
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