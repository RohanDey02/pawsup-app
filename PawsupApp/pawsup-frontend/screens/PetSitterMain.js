import React from "react";
import { StatusBar } from 'expo-status-bar';

import {
    BackgroundStyle,
    StyledContainer2,
    InnerContainer,
    ButtonTextMain,
    StyledButtonMainPage
} from './../components/styles';
import { StyleSheet, Image, TouchableHighlight, ImageBackground } from 'react-native';

const PetSitterMain = ({ navigation, route }) => {
    const data = route.params;

    return (
        <StyledContainer2>
            <ImageBackground
                source={require('./../assets/WallpapersAndLogo/MainPageDirectory.png')} resizeMode="cover" style={BackgroundStyle.image}>
            <StatusBar style="dark" />
                <InnerContainer>
                    <TouchableHighlight style={styles.settingsicon} onPress={() => navigation.navigate('Settings', data)}>
                        <Image
                            style={styles.settingsicon}
                            source={require("./../assets/WallpapersAndLogo/settings.png")}
                        />
                    </TouchableHighlight>

                    <StyledButtonMainPage onPress={() => navigation.navigate('Services', data)}>
                        <ButtonTextMain>Create Your Listing</ButtonTextMain>
                    </StyledButtonMainPage>

                    <StyledButtonMainPage onPress={() => navigation.navigate('Services', data)}>
                        <ButtonTextMain>Edit Your Listing</ButtonTextMain>
                    </StyledButtonMainPage>

                    <StyledButtonMainPage onPress={() => navigation.navigate('Services', data)}>
                        <ButtonTextMain>Store</ButtonTextMain>
                    </StyledButtonMainPage>

                    <StyledButtonMainPage onPress={() => navigation.navigate('Services', data)}>
                        <ButtonTextMain>Your Orders</ButtonTextMain>
                    </StyledButtonMainPage>
                </InnerContainer>
            </ImageBackground>
            </StyledContainer2>
    );
};

const styles = StyleSheet.create({
    settingsicon: {
        top: "-20%",
        right: "10%",
        width: 50,
        height: 50,
        position: 'absolute',
    }
});

export default PetSitterMain;