import React from 'react';
import { View, Image, StyleSheet, Text, Dimensions, TouchableOpacity, } from 'react-native';

const NUMCOLS = 2;
const WIDTH = Dimensions.get('window').width - 40;

const Entry = ({ item, onPress }) => {
    const { title, desc } = item;
    return (
        <TouchableOpacity
			style={styles.container}
			onPress={
				() => {
					console.log("hehe");
					console.log("asdf");
				}
			}>
            <Image
                source={{uri: item.image}}
                style={{aspectRatio: 1, flex: 1/NUMCOLS, borderRadius: 123123}}
            />
            <Text style={{fontWeight: "bold", fontSize: 17, alignSelf: 'center'}}>
                {item.fullname}
            </Text>

			<View style={{flexDirection:"row", paddingTop:2, paddingBottom: 4}}>
				<View style={{flex:1}}>
					<Text style={{fontSize: 15, justifyContent: 'flex-start'}}>
						{'$' + item.price + '/hr'}
					</Text>
                </View>
                <View style={{flex:1}}>
					<Text style={{fontSize: 15, justifyContent: 'flex-end', textAlign: 'right'}}>
						{item.rating}
					</Text>
                </View>
			</View>


			<Text style={{fontSize: 12, textAlign: 'center',}}>
				{item.description}
			</Text>
        </TouchableOpacity>
        
    );
};


const styles = StyleSheet.create({
	container: {
    	backgroundColor: '#fff4bf',
    	width: WIDTH / 2 - 20,
    	padding: 10,
    	borderRadius: 10,
  	},
  	title: {
    	fontWeight: 'bold',
    	fontSize: 16,
    	color: '#ff00ff',
  	},
});

export default Entry;