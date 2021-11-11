import React from "react";
import { StatusBar } from 'expo-status-bar';

import {
    BackgroundStyle,
    StyledContainer2,
    InnerContainer,
    ButtonTextMain,
    StyledButtonMainPage
} from './../components/styles';
import { StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';

const PetSitterMain = ({ navigation, route }) => {
    const data = route.params;
    var empty=[];
    return (
        <StyledContainer2>
            <ImageBackground
                source={require('./../assets/WallpapersAndLogo/MainPageDirectory.png')} resizeMode="cover" style={BackgroundStyle.image}>
            <StatusBar style="dark" />
                <InnerContainer>
                    <TouchableOpacity style={styles.settingsicon} onPress={() => navigation.navigate('Settings', data)}>
                        <Image
                            style={styles.settingsicon}
                            source={require("./../assets/WallpapersAndLogo/settings.png")}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logoutstyle} onPress={() => navigation.navigate('Login',empty)}>
                    <Image
                
                        source={{uri: 'https://i.imgur.com/qzIRCkV.png'}}
                        style={styles.logoutstyle}
                    />
                    </TouchableOpacity>
                    <StyledButtonMainPage onPress={() => navigation.navigate('PetSitterModifyListing', data)}>
                        <ButtonTextMain>Modify Your Listing</ButtonTextMain>
                    </StyledButtonMainPage>

                    <StyledButtonMainPage onPress={() => navigation.navigate('Shop', data)}>
                        <ButtonTextMain>Store</ButtonTextMain>
                    </StyledButtonMainPage>

                    <StyledButtonMainPage onPress={() => navigation.navigate('UpcomingAppointment', data)}>
                        <ButtonTextMain>Your Bookings</ButtonTextMain>
                    </StyledButtonMainPage>
                </InnerContainer>
            </ImageBackground>
            </StyledContainer2>
    );
};

const styles = StyleSheet.create({
    settingsicon: {
        top: "-40%",
        right: "10%",
        width: 50,
        height: 50,
        position: 'absolute',
    },
    logoutstyle: {
        width: 50,
        height: 50,
        top: "-40%",
        left: "10%",
        position: "absolute",
    },
});

export default PetSitterMain;