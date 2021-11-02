import React from 'react';
import { View, Image, StyleSheet, Text, Dimensions } from 'react-native';

const NUMCOLS = 1;
const WIDTH = Dimensions.get('window').width - 40;

const EntryCart = ({ item, onPress }) => {
    return (
        <View style={styles.container} >
            <Text style={{fontWeight: "bold", fontSize: 17, alignSelf: 'center'}}>
                {item.name}
            </Text>
			<View style={styles.container2}>
					<Text >
						{'Price: '+item.price }
					</Text>
					<Text >
						{'Quantity: '+ item.quantityInCart}
					</Text>
			</View>
        </View>
        
    );
};
const styles = StyleSheet.create({
	container: {
    	backgroundColor: '#fff4bf',
    	width: WIDTH - 20,
    	padding: 10,
    	borderRadius: 10,
  	},
	container2: {
		flex: 1,
		fontSize: 16,
		padding:10,
		flexDirection:"row",
    	justifyContent: 'space-between'
  	},
  	title: {
    	fontWeight: 'bold',
    	fontSize: 16,
    	color: '#ff00ff',
  	},
});

export default EntryCart;