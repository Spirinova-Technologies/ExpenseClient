import React from "react";
import { ScrollView, StyleSheet, FlatList, BackHandler } from "react-native";
import { DrawerActions } from "react-navigation-drawer";
import {
  Container,
  Content,
  Button,
  Header,
  View,
  Grid,
  Fab,
  Row,
  Col,
  Text,
  Left,
  Body,
  Title,
  Right,
  Picker,
  StyleProvider,
  FooterTab,
  Footer,
  Icon,
  Toast,
  H1
} from "native-base";
import getTheme from "../../../native-base-theme/components";
import commonColors from "../../../native-base-theme/variables/commonColor";
import { EASingleListItem } from "../../components";
import ShopService from "../../services/shops";
import { FabButtonPrimary, FormStyle } from "../../styles";
import { userPreferences, utility } from "../../utility";
import Loader from "../Shared/Loader";
import HomeScreen from "../HomeScreen";

class ShopScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shops: [],
      shopInfo: null,
      selectedShop: null,
      selectedShopName: null,
      userShopId: null,
      isLoading: false
    };
    this.willFocusShop = null;
    this.shopDetail = this.shopDetail.bind(this);
    this.shopSelected = this.shopSelected.bind(this);
  }

  static navigationOptions = {
    headerShown: false
  };

  addShop = async () => {
    this.props.navigation.navigate("AddShop", { formType: 0 });
  };

  shopDetail(shopInfo) {
    this.props.navigation.navigate("ShopDetail", { shopInfo: shopInfo });
  }

  shopSelected = async shopInfo => {
    console.log("shopId", shopInfo);

    this.setState({
      selectedShop: shopInfo.id + "",
      selectedShopName: shopInfo.shop_name,
      shopInfo: shopInfo
    });
  };

  saveShop = async () => {
    if (
      this.state.selectedShop != null &&
      this.state.selectedShopName != null
    ) {
      await userPreferences.setPreferences(
        userPreferences.userShopId,
        this.state.selectedShop + ""
      );

      await userPreferences.setPreferences(
        userPreferences.userShopName,
        this.state.selectedShopName + ""
      );
      await userPreferences.setPreferences(
        userPreferences.homeTab,"1"
      );
      await userPreferences.setPreferences(
        userPreferences.supplierTab,"1"
      );
      await userPreferences.setPreferences(
        userPreferences.billsTab,"1"
      );
      await userPreferences.setPreferences(
        userPreferences.passbookTab,"1"
      );
      this.setState({ userShopId: this.state.selectedShop + "" }, () => {
        this.props.navigation.navigate("Home");
      });
    }
  };

  editShop = async () => {
    if (this.state.shopInfo != null) {
      this.props.navigation.navigate("AddShop", {
        formType: 1,
        shopInfo: this.state.shopInfo
      });
    }
  };

  async componentDidMount() {
    this.willFocusShop = this.props.navigation.addListener(
      "willFocus",
      this.handleTabFocus
    );
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    let userShopId = await userPreferences.getPreferences(
      userPreferences.userShopId
    );
    let userShopName = await userPreferences.getPreferences(
      userPreferences.userShopName
    );
    if (userShopId != null) {
      this.setState({
        userShopId: userShopId,
        selectedShop: userShopId,
        selectedShopName: userShopName
      });
    }
  }

  componentWillUnmount() {
    if (this.willFocusShop != null) {
      this.willFocusShop.remove();
    }
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    if (this.state.userShopId != null) {
      return false;
    } else {
      return true;
    }
  };

  handleTabFocus = () => {
    this.getShops();
    console.log("componentWillFocus");
  };

  getShops = async () => {
    try {
      let userId = await userPreferences.getPreferences(userPreferences.userId);
      this.setState({ isLoading: true });
      let shopData = await ShopService.getShopList(userId);
      //  console.log("auth : ", auth);
      this.setState({ isLoading: false });
      if (shopData.status == 0) {
        var msg = shopData.msg;
        Toast.show({
          text: msg,
          buttonText: "Okay",
          type: "danger",
          duration: 5000
        });
      } else {
        if (shopData.shop.length == 0) {
          this.props.navigation.navigate("AddShop", { firstTime: 1 });
        }
        this.setState({ shops: shopData.shop });
      }
    } catch (error) {
      this.setState({ isLoading: false }, () => {
        Toast.show({
          text: "Something went wrong.Please try again",
          buttonText: "Okay",
          type: "danger",
          duration: 5000
        });
      });
    }
  };

  renderButtonGroup = () => {
    return (
      <Footer>
        <FooterTab style={styles.footer}>
          <Button onPress={this.saveShop} style={styles.buttonSave}>
            <Text>Save</Text>
          </Button>
          <Button onPress={this.editShop} style={styles.buttonEdit}>
            <Text>Edit</Text>
          </Button>
          {/* <Button style={styles.buttonShare}>
          <Text>Share</Text>
        </Button> */}
        </FooterTab>
      </Footer>
    );
  };

  renderShops = () => {
    if (this.state.shops.length == 0) {
      return (
        <View style={styles.message}>
          <H1>No Shops Available.</H1>
        </View>
      );
    } else {
      return (
        <Grid>
          {/* <Row style={styles.buttonGroupSection}></Row> */}
          <Row>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "space-between"
              }}
            >
              <Row>
                <FlatList
                  data={this.state.shops}
                  extraData={this.state.selectedShop}
                  renderItem={({ item }) => (
                    <EASingleListItem
                      data={item}
                      name={item.shop_name}
                      location={item.street}
                      pressHandler={this.shopDetail}
                      selectHandler={this.shopSelected}
                      selectedId={this.state.selectedShop + ""}
                    />
                  )}
                  keyExtractor={item => item.id + ""}
                />
              </Row>
            </ScrollView>
          </Row>
        </Grid>
      );
    }
  };

  render() {
    return (
      <StyleProvider style={getTheme(commonColors)}>
        <Container>
          <Header noShadow>
            {this.state.userShopId != null ? (
              <Left>
                <Button
                  transparent
                  onPress={() => this.props.navigation.openDrawer()}
                >
                  <Icon name="menu" />
                </Button>
              </Left>
            ) : (
              <></>
            )}

            <Body>
              <Title style={FormStyle.headerColor}>Shops</Title>
            </Body>
            <Right></Right>
          </Header>
          <Content padder contentContainerStyle={styles.container}>
            {this.state.isLoading ? <Loader /> : this.renderShops()}
          </Content>
          {this.state.selectedShop == null ? <></> : this.renderButtonGroup()}
          <View>
            <Fab
              direction="up"
              containerStyle={{}}
              style={[styles.fabButton,{marginBottom:40}]}
              position="bottomRight"
              onPress={this.addShop}
            >
              <Icon name="add" />
            </Fab>
          </View>
        </Container>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    fontFamily: "Roboto"
  },
  message: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonGroupSection: {
    height: 50
  },
  dropdownContainer: {
    height: 50,
    position: "relative"
  },
  bricksContainer: {
    height: 90
  },
  footer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF"
  },
  buttonSave: {
    flex: 1,
    marginRight: 2,
    backgroundColor: "#FE3852"
  },
  buttonEdit: {
    flex: 1,
    marginLeft: 2,
    marginRight: 2,
    backgroundColor: "#FE3852"
  },
  buttonShare: {
    flex: 1,
    marginLeft: 2,
    backgroundColor: "#FE3852"
  },
  pickerIcon: {
    color: "#FE3852",
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: 25
  },
  fabButton: FabButtonPrimary
});

export default ShopScreen;
