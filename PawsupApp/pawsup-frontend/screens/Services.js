import React from 'react';
import { SafeAreaView, TouchableOpacity, ImageBackground, View, FlatList, StyleSheet, Text, StatusBar, Image, Dimensions, Button } from 'react-native';
import Entry from '../components/Entry';

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
    ButtonText
} from './../components/styles';

const BG_IMG = 'pawpus.finestudiotest.com/include/pic/backend/21070708564800.png';
const CAT_IMG = 'https://www.pethealthnetwork.com/sites/default/files/urine-testing-in-cats185922494.png';
const FILTER_IMG = require('./../assets/icons/filter.png');

// some data i guess?
const DATA = [
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
];

const WIDTH = Dimensions.get("window").width;
const SPACING = 20;
const screenWidth = Dimensions.get("window").width;
const numColumns = 2;
const tileSize = screenWidth / numColumns;

const Item = ({ title }) => (
	<View style={styles.item}>
		<Text style={styles.title}>{title}</Text>
	</View>
);

const Services = () => {
	const renderItem = ({ item }) => (
		<Item title={item.title} />
	);
	
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

			<SafeAreaView style={{marginTop: 20}}>
				<View style={{flexDirection: 'row'}}>
					<TouchableOpacity style={styles.filterButtonStyle}>
						<Image
							source={FILTER_IMG}
							style={styles.buttonImageIconStyle}
						/>
						<Text style={styles.buttonTextStyle}>
							SORT & FILTER
						</Text>
					</TouchableOpacity>
			{/*
					<TouchableOpacity style={styles.filterButtonStyle}>
					<Image
						source={FILTER_IMG}
						style={styles.buttonImageIconStyle}
					/>
					<Text style={styles.buttonTextStyle}>
						Filter
					</Text>
				</TouchableOpacity>
			*/}
				</View>
			</SafeAreaView>

			<SafeAreaView style={styles.container}>
				<FlatList
					data={DATA}
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
						return <View>
							<Entry item={item} />
						</View>
					}}
					keyExtractor={item => item.id}
				/>
			</SafeAreaView>
		</StyledContainer2>
	);
}

const styles = StyleSheet.create({
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
		backgroundColor: 'rgba(255, 255, 255, 0.7)',
		borderWidth: 2,
		borderColor: '#000',
		width: WIDTH / 2 - 40,
		height: 30,					 /* THIS IS A FIXED VALUE. CHANGE LATER??? */
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
		marginLeft: 5,
		color: '#000',
		flex: 1,
	},

});

export default Services;