import styled from 'styled-components/native';
import { Image, View, Text, TextInput, Touchable, TouchableOpacity, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import Constants from 'expo-constants';

const StatusBarHeight = Constants.statusBarHeight;

// Colours
export const Colours = {
    primary: "#ffffff",
    secondary: "#E5E7EB",
    tertiary: "#1f2937",
    darkLight: "#9CA3AF",
    brand: "#000000",
    green: "#10B981",
    red: "#EF4444",
};

const { primary, secondary, tertiary, darkLight, brand, green, red } = Colours;

export const StyledContainer = styled.View`
  flex: 1;
  padding: 25px;
  padding-top: ${StatusBarHeight + 30}px;
  background-color: ${primary};
`;

export const StyledContainer2 = styled.View`
  flex: 1;
  background-color: ${primary};
`;

export const InnerContainer = styled.View`
  width: 100%;
  align-items: center;
`;

export const InnerContainer2 = styled.View`
  width: 100%;
  align-items: center;
  padding-top: ${StatusBarHeight + 10}px;
`;

export const InnerContainer3 = styled.View`
  width: 100%;
  padding-top: ${StatusBarHeight + 180}px;
  align-items: center;
`;

export const InnerContainer4 = styled.View`
  width: 100%;
  padding-top: ${StatusBarHeight + 30}px;
  align-items: center;
`;

export const InnerContainer5 = styled.View`
  width: 100%;
  padding-top: 40px;
  align-items: center;
`;

export const InnerContainer6 = styled.View`
  width: 100%;
  padding-top: 10px;
  align-items: center;
`;

export const WelcomeContainer = styled(InnerContainer)`
  padding: 25px;
  padding-top: 10px;
  justify-content: center;
`;

export const PageLogo = styled.Image`
  width: 250px;
  height: 200px;
`;
 
export const BackgroundStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
    justifyContent: "center",
    position: 'absolute',
    left: 0,
    top: 0,
  }
});

export const Avatar = styled.Image`
  width: 100px;
  height: 100px;
  margin: auto;
  border-radius: 50px;
  border-width: 2px;
  border-color: ${secondary};
  margin-bottom: 10px;
  margin-top: 10px;
`;

export const WelcomeImage = styled.Image`
  height: 50%;
  min-width: 100%;
`;

export const PageTitle = styled.Text`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${brand};
  padding: 10px;
  ${(props) =>
        props.welcome &&
        `
    font-size: 35px;
  `}
`;

export const SubTitle = styled.Text`
  font-size: 18px;
  margin-bottom: 20px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${tertiary};
`;

export const StyledTextInput = styled.TextInput`
  background-color: ${secondary};
  padding: 0px;
  padding-left: 55px;
  padding-right: 55px;
  border-radius: 5px;
  font-size: 16px;
  height: 40px;
  margin-vertical: 3px;
  margin-bottom: 8px;
  color: ${tertiary};
`;

export const StyledTextInput1 = styled.TextInput`
  background-color: ${secondary};
  padding: 0px;
  padding-left: 55px;
  padding-right: 55px;
  border-radius: 5px;
  font-size: 16px;
  height: 100px;
  margin-vertical: 3px;
  margin-bottom: 8px;
  color: ${tertiary};
`;

export const StyledInputLabel = styled.Text`
  color: ${tertiary};
  font-size: 13px;
  text-align: left;
`;

export const LeftIcon = styled.View`
  left: 10px;
  top: 25px;
  position: absolute;
  z-index: 1;
`;

export const RightIcon = styled.TouchableOpacity`
  right: 10px;
  top: 25px;
  position: absolute;
  z-index: 1;
`;

export const StyledButton = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${brand};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 5px;
  height: 60px;
  borderRadius:30px;
`;

export const StyledButton1 = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${red};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 5px;
  height: 60px;
  borderRadius:30px;
`;


export const StyledButtonMainPage = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${red};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 10px;
  width: 310px;
  alignSelf: center;
  height: 86px;
  borderRadius:50px;
`;

export const StyledButtonAppointmentPage = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${green};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 10px;
  alignSelf: center;
  width: 110px;
  height: 50px;
`;

export const ButtonTextMain = styled.Text`
  color: ${primary};
  font-size: 24px;
`;

export const ButtonText = styled.Text`
  color: ${primary};
  font-size: 16px;
`;

export const MsgBox = styled.Text`
  text-align: center;
  font-size: 13px;
  color: ${props => props.type == "SUCCESS" ? green : red};
`;

export const Line = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${darkLight};
  margin-vertical: 10px;
`;

export const StyledFormArea = styled.View`
  width: 90%;
`;

export const ExtraView = styled.View`
  justify-content: center;
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;

export const ExtraView1 = styled.View`
  justify-content: center;
  flex-direction: row;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 10px;
`;

export const ExtraView2 = styled.View`
  justify-content: left;
  flex-direction: row;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 10px;
`;

export const ExtraText = styled.Text`
  justify-content: center;
  align-content: center;
  color: ${tertiary};
  font-size: 15px;
`;

export const ExtraText1 = styled.Text`
  color: ${tertiary};
  font-size: 15px;
`;

export const TextLink = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;

export const TextLinkContent = styled.Text`
  color: ${red};
  font-size: 15px;
`;