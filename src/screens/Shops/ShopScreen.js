import React from "react";
import { ScrollView, StyleSheet, FlatList } from "react-native";
import {
  Container,
  Content,
  Button,
  View,
  Grid,
  Fab,
  Row,
  Col,
  Text,
  Picker,
  StyleProvider,
  Icon,
  Toast,
  H1
} from "native-base";
import getTheme from "../../../native-base-theme/components";
import commonColors from "../../../native-base-theme/variables/commonColor";
import {
  EASingleListItem,
} from "../../components";
import ShopService from "../../services/shops";
import { FabButtonPrimary, FormStyle } from "../../styles";
import { userPreferences, utility } from "../../utility";
import Loader from "../Shared/Loader";


class ShopScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shops: [],
      isLoading: false
    };
    this.shopDetail = this.shopDetail.bind(this);
  }

  static navigationOptions = {
    headerShown: false
  };

  _RedirectShopAdd = async () => {
    this.props.navigation.navigate("AddShop",{formType:0});
  };

  shopDetail(shopInfo) {
    this.props.navigation.navigate("ShopDetail",{shopInfo:shopInfo});
  }

  componentDidMount() {
    this.getShops();
  }

  getShops = async () => {

    try {
      let userId = await userPreferences.getPreferences(userPreferences.userId);
      this.setState({ isLoading: true });
      let shopData = await ShopService.getShopList(userId);
      //  console.log("auth : ", auth);
      this.setState({ isLoading: false });
      if (shopData.status == 0) {
        var msg = shopData.msg;
        utility.showAlert(msg);
      } else {
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

  _renderShops = () => {
    if (this.state.shops.length == 0) {
      return (
        <View style={styles.message}>
          <H1>No Shops Available.</H1>
        </View>
      );
    } else {
      return (
        <Grid>
          <Row style={styles.buttonGroupSection}></Row>
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
                  renderItem={({ item }) => (
                    <EASingleListItem
                      data={item}
                      name={item.shop_name}
                      location={item.street}
                      pressHandler={this.shopDetail}
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
          <Content padder contentContainerStyle={styles.container}>
            {this.state.isLoading ? <Loader /> : this._renderShops()}
          
          </Content>
          <View>
              <Fab
                direction="up"
                containerStyle={{}}
                style={styles.fabButton}
                position="bottomRight"
                onPress={this._RedirectShopAdd}
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
