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

const PetOwnerMain = ({ navigation, route }) => {
    const data = route.params;

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

                    <StyledButtonMainPage onPress={() => navigation.navigate('Services', data)}>
                        <ButtonTextMain>Services</ButtonTextMain>
                    </StyledButtonMainPage>

                    <StyledButtonMainPage onPress={() => navigation.navigate('Shop', data)}>
                        <ButtonTextMain>Store</ButtonTextMain>
                    </StyledButtonMainPage>

                    <StyledButtonMainPage onPress={() => navigation.navigate('UpcomingAppointment', data)}>
                        <ButtonTextMain>Your Appointments</ButtonTextMain>
                    </StyledButtonMainPage>
                    <StyledButtonMainPage onPress={() => navigation.navigate('PreviousAppointments', data)}>
                        <ButtonTextMain>Your Previous Appointments</ButtonTextMain>
                    </StyledButtonMainPage>
                    <StyledButtonMainPage onPress={() => navigation.navigate('PreviousStorePurchase', data)}>
                        <ButtonTextMain>Your old cart</ButtonTextMain>
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
    }
});

export default PetOwnerMain;