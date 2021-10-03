import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';

import {
    PageTitle,
    SubTitle,
    StyledFormArea,
    StyledButton,
    InnerContainer,
    WelcomeContainer,
    ButtonText,
    Line,
} from './../components/styles';

/*
 * As of now, this is just a temporary page with the purpose of just leading to a general page from Login and Signup
*/
const Welcome = ({navigation, route}) => {
    const {fullname, email} = route.params;
    return (
        <>
        <StatusBar style="light" />
        <InnerContainer>
            <WelcomeContainer>
            <PageTitle welcome={true}>Welcome! Buddy</PageTitle>
            <SubTitle welcome={true}>{fullname || 'Username'}</SubTitle>
            <SubTitle welcome={true}>{email || 'testemail@gmail.com'}</SubTitle>
            <StyledFormArea>
                <Line />
                <StyledButton onPress={() => {
                        navigation.navigate('Login');
                    }}
                >
                    <ButtonText>Logout</ButtonText>
                </StyledButton>
            </StyledFormArea>
            </WelcomeContainer>
        </InnerContainer>
        </>
    );
};

export default Welcome;