import React from "react";
import { StyleSheet, AsyncStorage } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { DrawerActions } from "react-navigation-drawer";
import {
  Container,
  Content,
  Header,
  Title,
  Button,
  Text,
  Left,
  Body,
  Icon,
  Thumbnail,
  Subtitle,
  StyleProvider,
  List,
  ListItem
} from "native-base";
import getTheme from "../../native-base-theme/components";
import commonColors from "../../native-base-theme/variables/commonColor";
import { ToolbarHeader, ToolBarSubheader } from "../styles";
import { userPreferences } from "../utility";

const EASideBar = props => {
//   var username = "";

//   const _setUserData = async () => {
//     let firstName = await userPreferences.getPreferences(
//       userPreferences.firstName
//     );
//     let lastName = await userPreferences.getPreferences(
//       userPreferences.lastName
//     );
//     console.log("firstName ", firstName);
//     if (lastName != null && lastName != null) {
//       username = firstName + lastName;
//     }
//   };

//   if (username == "" || username == null) {
//     _setUserData();
//   }

  const _RedirectAddSupplier = path => {
    console.log(path);
    props.navigation.navigate(path);
  };

  const _signOutAsync = async () => {
    userPreferences.clearPreferences();
    await AsyncStorage.clear();
    props.navigation.navigate("Auth");
  };

  let appRoutes = [
    {
      key: "Home",
      params: undefined,
      routeName: "Home"
    },
    {
      key: "Supplier",
      params: undefined,
      routeName: "Supplier"
    },
    {
      key: "Bills",
      params: undefined,
      routeName: "Bills"
    },
    {
      key: "Passbook",
      params: undefined,
      routeName: "Passbook"
    },
    {
      key: "Shops",
      params: undefined,
      routeName: "ShopList"
    },
    {
      key: "Profile",
      params: undefined,
      routeName: "Profile"
    },
    {
      key: "About",
      params: undefined,
      routeName: "About"
    }
  ];
  return (
    <StyleProvider style={getTheme(commonColors)}>
      <SafeAreaView style={{ flex: 1 }}>
        <Header span>
          <Left>
            <Thumbnail source={require("../../assets/icon.png")} />
          </Left>
          <Body>
            <Title
              style={(styles.headerColor, { textTransform: "capitalize" })}
            >
              Rohit Verma
            </Title>
            <Subtitle style={styles.subHeaderColor}>
              Fountain Hotel Chain
            </Subtitle>
            <Subtitle style={styles.subHeaderColor}>( Current Shop )</Subtitle>
          </Body>
        </Header>
        <Content padder contentContainerStyle={styles.container}>
          <List style={{ width: "100%" }}>
            {appRoutes.map(route => {
              return (
                <ListItem
                  button
                  onPress={() => _RedirectAddSupplier(route.routeName)}
                  key={route.key}
                  noBorder
                >
                  <Text>{route.routeName}</Text>
                </ListItem>
              );
            })}
            <ListItem button onPress={_signOutAsync} noBorder>
              <Text>Log Out</Text>
            </ListItem>
          </List>
        </Content>
      </SafeAreaView>
    </StyleProvider>
  );
};

const styles = StyleSheet.create({
  headerColor: ToolbarHeader,
  subHeaderColor: ToolBarSubheader,
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    fontFamily: "Roboto"
  }
});

export default EASideBar;
