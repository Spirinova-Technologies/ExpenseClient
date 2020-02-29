import React from 'react';
import { AppDrawerNavigation, AuthStack, AuthLoadingScreen } from './src/navigation/AuthNavigator';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Root } from "native-base";

 const AppNavigation = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppDrawerNavigation,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
      headerMode: 'none',
    }
  )
);

export default class App extends React.Component {

  componentDidMount(){
    console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
  }
  
  render() {
    return (
      <Root>
        <AppNavigation />
      </Root>
    )
  }
}
