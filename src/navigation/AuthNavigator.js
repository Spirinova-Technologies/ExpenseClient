import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { createDrawerNavigator } from "react-navigation-drawer";
import {
  HomeScreen,
  LoginScreen,
  OtpScreen,
  ChangePassword,
  SignupScreen,
  ForgotPassword,
  AuthLoadingScreen,
  SupplierScreen,
  MainScreen,
  BillScreen,
  PassbookScreen,
  AddSupplierScreen,
  AddPaymentScreen,
  AddBillScreen,
  AddShopScreen,
  AddMoney,
  ShopScreen,
  ShopDetail,
  AboutScreen,
  UserProfile
} from "../screens";

import { EASideBar } from "../components";
import { Icon, Text } from "native-base";

const AppTabNavigation = createMaterialTopTabNavigator(
  {
    Home: HomeScreen,
    Supplier: SupplierScreen,
    Bills: BillScreen,
    Passbook: PassbookScreen
  },
  {
    initialRouteName: "Home",
    tabBarOptions: {
      showIcon: true,
      activeTintColor: "#FE3852",
      inactiveTintColor: "#637381",
      upperCaseLabel: false,
      style: {
        backgroundColor: "#FFF",
        color: "#637381",
        textTransform: 'capitalize'
      },
      indicatorStyle: {
        backgroundColor: "#FE3852"
      }
    },
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        let type;
        if (routeName === "Home") {
          iconName = `md-home`;
          type = "Ionicons";
        } else if (routeName === "Supplier") {
          iconName = `md-people`;
          type = "Ionicons";
        } else if (routeName === "Bills") {
          iconName = `md-paper`;
          type = "Ionicons";
        } else if (routeName === "Passbook") {
          iconName = `ios-filing`;
          type = "Ionicons";
        }
        return (
          <Icon type={type} name={iconName} style={{ color: tintColor }} />
        );
      },
    })
  },
  {
    lazy: false
  }
);

const AppStackNavigation = createStackNavigator(
  {
    Main: {
      screen: AppTabNavigation,
      navigationOptions: {
        header: ({ scene, previous, navigation }) => {
          // const { options } = scene.descriptor;
          return <MainScreen title={"Expense App"} navigation={navigation} />;
        },
        tabBarOnPress: ({ navigation, defaultHandler }) => {
            defaultHandler();
        },
      }
    },
    AddSupplier: {
      screen: AddSupplierScreen
    },
    AddPayment: {
      screen: AddPaymentScreen
    },
    AddBill: {
      screen: AddBillScreen
    },
    AddShop: {
      screen: AddShopScreen
    },
    ShopDetail: {
      screen: ShopDetail
    },
    Shops: {
      screen: ShopScreen,
    },
    Support: {
      screen: AboutScreen,
      navigationOptions: {
        header: ({ scene, previous, navigation }) => {
          // const { options } = scene.descriptor;
          return <MainScreen title={"Support"} navigation={navigation} />;
        }
      }
    },
    Profile: {
      screen: UserProfile,
      navigationOptions: {
        header: ({ scene, previous, navigation }) => {
          // const { options } = scene.descriptor;
          return <MainScreen title={"Profile"} navigation={navigation} />;
        }
      }
    },
    AddMoney: {
      screen: AddMoney
    }
  },
  {
    initialRouteName: "Main"
  }
);

const AppDrawerNavigation = createDrawerNavigator(
  {
    Home: {
      screen: AppStackNavigation
    }
  },
  {
    contentComponent: props => <EASideBar {...props} />
  }
);

const AuthStack = createStackNavigator(
  { SignIn: LoginScreen, SignUp: SignupScreen, ForgotPassword: ForgotPassword,OtpVerification:OtpScreen,ChangePassword:ChangePassword },
  { initialRouteName: "SignIn" }
);

export { AppDrawerNavigation, AuthStack, AuthLoadingScreen };
