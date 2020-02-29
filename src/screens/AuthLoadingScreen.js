import { Root } from 'native-base';
import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
} from 'react-native';
import * as Font from 'expo-font';
import { Ionicons, Feather } from '@expo/vector-icons';
import { isValid, utility, userPreferences } from "../utility";
class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    await Font.loadAsync({
      Roboto: require('../../node_modules/native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('../../node_modules/native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
      ...Feather.font
    });


    let userId = await userPreferences.getPreferences(userPreferences.userId);
    console.log("userId : ", userId);
    if (userId != null) {
      let userShopId = await userPreferences.getPreferences(
        userPreferences.userShopId
      );
      console.log("userShopId : ", userShopId);
      if (userShopId != null) {
        this.props.navigation.navigate("App");
      } else {
        this.props.navigation.navigate("Shops");
      }
    }else{
      this.props.navigation.navigate("Auth");
    }
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    // this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" backgroundColor="#FE3852" />
      </View>
    );
  };
}

export default AuthLoadingScreen;