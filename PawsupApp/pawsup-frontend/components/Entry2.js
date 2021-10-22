import React from 'react';
import { View, Image, StyleSheet, Text, Dimensions, TouchableOpacity, } from 'react-native';

const NUMCOLS = 1;
const WIDTH = Dimensions.get('window').width - 40;

const Entry2 = ({ item, onPress }) => {
    const { title, desc } = item;
    return (
        <View style={styles.container} >
            <Text style={{fontWeight: "bold", fontSize: 17, alignSelf: 'center'}}>
                {item.name}
            </Text>
			<View style={{flexDirection:"row", paddingTop:2, paddingBottom: 4}}>
				<View style={{flex:1}}>
					<Text style={{fontSize: 16, alignSelf: 'center'}}>
						{ item.time }
					</Text>
                </View>
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
  	title: {
    	fontWeight: 'bold',
    	fontSize: 16,
    	color: '#ff00ff',
  	},
});

export default Entry2;