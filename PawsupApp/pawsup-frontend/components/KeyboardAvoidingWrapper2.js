import React from 'react';

// Keyboard Avoiding View
import { KeyboardAvoidingView, Keyboard, ScrollView, TouchableWithoutFeedback } from 'react-native';

// Colours
import { Colours } from './../components/styles';
const { primary } = Colours;

const KeyboardAvoidingWrapper2 = ({ children }) => {
    return (
        <KeyboardAvoidingView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>{children}</TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default KeyboardAvoidingWrapper2;