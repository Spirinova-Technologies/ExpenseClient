import React, { Component } from "react";
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

// const EASideBar = props => {
class EASideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appRoutes: [
        {
          key: "Home",
          params: undefined,
          routeName: "Home"
        },
        {
          key: "Shops",
          params: undefined,
          routeName: "Shops"
        },
        {
          key: "Profile",
          params: undefined,
          routeName: "Profile"
        },
        {
          key: "Support",
          params: undefined,
          routeName: "Support"
        }
      ],
      userName: "",
      businessName: "",
      shopName: ""
    };
  }

  setUserData = async () => {
    let firstName = await userPreferences.getPreferences(
      userPreferences.firstName
    );
    let lastName = await userPreferences.getPreferences(
      userPreferences.lastName
    );
    let shopName = await userPreferences.getPreferences(
      userPreferences.userShopName
    );
    let businessName = await userPreferences.getPreferences(
      userPreferences.businessName
    );
    console.log("firstName ", firstName);

    if (firstName != null && lastName != null) {
      this.setState({
        userName: firstName + lastName,
        businessName: businessName,
        shopName: shopName
      });
    }
  };


  async componentDidMount() {
    this.setUserData();
    // this.props.navigation.addListener('didFocus', this.handleTabFocus)
    
  }

  handleTabFocus = () => {
    
  };

  redirectToPath = path => {
    console.log(path);
    this.props.navigation.navigate(path);
  };

  signOutAsync = async () => {
    userPreferences.clearPreferences();
    await AsyncStorage.clear();
    this.props.navigation.navigate("Auth");
  };

  render() {
    return (
      <StyleProvider style={getTheme(commonColors)}>
        <SafeAreaView style={{ flex: 1 }}>
          <Header span>
            <Left>
              <Thumbnail source={require("../../assets/icon.png")} />
            </Left>
            <Body>
              <Title
                style={styles.headerColor}
              >
                {this.state.userName}
              </Title>
              <Subtitle style={styles.subHeaderColor}>
                {this.state.businessName}
              </Subtitle>
              <Subtitle style={styles.subHeaderColor}>
                {this.state.shopName ? '('+this.state.shopName+')':'' } 
              </Subtitle>
            </Body>
          </Header>
          <Content padder contentContainerStyle={styles.container}>
            <List style={{ width: "100%" }}>
              {this.state.appRoutes.map(route => {
                return (
                  <ListItem
                    button
                    onPress={() => this.redirectToPath(route.routeName)}
                    key={route.key}
                    noBorder
                  >
                    <Text>{route.routeName}</Text>
                  </ListItem>
                );
              })}
              <ListItem button onPress={this.signOutAsync} noBorder>
                <Text>Log Out</Text>
              </ListItem>
            </List>
          </Content>
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

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
