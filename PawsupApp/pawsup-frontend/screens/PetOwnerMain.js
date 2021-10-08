import React from "react";

import { StyleSheet, ImageBackground, SafeAreaView, Button, Dimensions, Text, TouchableOpacity, Image } from 'react-native'

import {
    BackgroundStyle,
    StyledButton,
    ButtonText
} from '../components/styles';

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonupper: {
        width: '40%',
        height: '10%',
        top: 0.3 * SCREEN_HEIGHT,
        marginRight: "32.5%",
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        backgroundColor: "orange",
    },
    button1: {
        width: '40%',
        height: '10%',
        top: 0.45 * SCREEN_HEIGHT,
        marginRight: "32.5%",
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        backgroundColor: "red",
    },
    button2: {
        width: '40%',
        height: '10%',
        top: 0.6 * SCREEN_HEIGHT,
        marginRight: "32.5%",
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        backgroundColor: "pink",
    },
    text: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 0.02 * (SCREEN_WIDTH + SCREEN_HEIGHT),
        top: "11.5%",
        marginLeft: "25%",
        marginRight: "25%",
        marginBottom: "90%",
        width: "50%",
        position: 'absolute',
    },
    innertext: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 0.01 * (SCREEN_WIDTH + SCREEN_HEIGHT),
        marginTop: 0,
        marginLeft: "20%",
        marginRight: "20%",
        justifyContent: 'center',
        alignItems: 'center',
        width: "80%",
        position: 'absolute',
    },
    settingsicon: {
        top: "12%",
        right: "10%",
        width: 0.035 * SCREEN_WIDTH,
        height: 0.025 * SCREEN_HEIGHT,
        position: 'absolute',

    }
}
)

const PetOwnerMain = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>

            <ImageBackground
                source={require('./../assets/WallpapersAndLogo/MainPageDirectory.png')}
                resizeMode="cover"
                style={BackgroundStyle.image}
            >

                <Text numberOfLines={1} style={styles.text}>
                    Main Page
                </Text>
                <TouchableOpacity color="blue" style={styles.settingsicon}>
                    <Image source={require('./../assets/WallpapersAndLogo/settings.png')}
                        style={styles.settingsicon}>
                    </Image>
                </TouchableOpacity>
            </ImageBackground>
            <TouchableOpacity style={styles.buttonupper}>
                <Text numberOfLines={1} style={styles.innertext}>
                    Services
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button1}>
                <Text numberOfLines={1} style={styles.innertext}>
                    Store
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button2}>
                <Text numberOfLines={1} style={styles.innertext}>
                    Your Orders
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default PetOwnerMain;