import React from 'react';
import { View, Image, StyleSheet, Text, Dimensions, TouchableOpacity, } from 'react-native';

const NUMCOLS = 2;
const WIDTH = Dimensions.get('window').width - 40;

const Item = ({ item, onPress }) => {
    const { title, desc } = item;
    return (
        <View style={styles.container}>
            <Image
                source={{uri: item.image}}
                style={{aspectRatio: 1, flex: 1/NUMCOLS, borderRadius: 123123}}
            />
            <Text style={{fontWeight: "bold", fontSize: 18, alignSelf: 'center'}}>
                {item.name}
            </Text>

			<View style={{flexDirection:"row", paddingTop:2, paddingBottom: 4}}>
				<View style={{flex:3}}>
					<Text style={{fontSize: 15, justifyContent: 'flex-start'}}>
                        {item.remaining + ' left'}
					</Text>
                </View>
                <View style={{flex:2}}>
					<Text style={{fontSize: 15, justifyContent: 'flex-end', textAlign: 'right'}}>
						{'$' + item.price}
					</Text>
                </View>
			</View>
        </View>
        
    );
};


const styles = StyleSheet.create({
	container: {
    	backgroundColor: '#fff4bf',
    	width: WIDTH / 2 - 10,
    	padding: 10,
    	borderRadius: 10,
  	},
  	title: {
    	fontWeight: 'bold',
    	fontSize: 16,
    	color: '#ff00ff',
  	},
});

export default Item;