import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';

import {
    Avatar,
    WelcomeImage,
    PageTitle,
    SubTitle,
    StyledFormArea,
    StyledButton,
    InnerContainer,
    WelcomeContainer,
    ButtonText,
    Line,
} from './../components/styles';

const Welcome = () => {
    return (
        <>
        <StatusBar style="light" />
        <InnerContainer>
            <WelcomeContainer>
            <PageTitle welcome={true}>Welcome! Buddy</PageTitle>

            <StyledFormArea>
                {/* <Avatar resizeMode="cover" source={AvatarImg} /> */}

                <Line />

                {/* <StyledButton onPress={clearLogin}> */}
                <StyledButton>
                    <ButtonText>Logout</ButtonText>
                </StyledButton>
            </StyledFormArea>
            </WelcomeContainer>
        </InnerContainer>
        </>
    );
};

export default Welcome;