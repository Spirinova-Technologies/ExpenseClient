import React from "react";

import {
  View,
  AsyncStorage,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  BackHandler
} from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Grid,
  Row,
  StyleProvider,
  Toast
} from "native-base";

import getTheme from "../../../native-base-theme/components";
import commonColors from "../../../native-base-theme/variables/commonColor";
import { ToolbarHeader, FormStyle } from "../../styles";
import ShopService from "../../services/shops";
import { EATextInput, EATextLabel, EASpinner } from "../../components";
import { isValid, userPreferences, utility } from "../../utility";
import Loader from "../Shared/Loader";
import HomeScreen from "../HomeScreen";

class AddShop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formType: 0,
      firstTime: 0,
      shopInfo: null,
      gstNumber: "",
      name: "",
      address: "",
      phone: "",
      city: "",
      nameError: "",
      gstError: "",
      phoneError: "",
      cityError: "",
      addressError: "",
      isLoading: false
    };

    this.gstNumber = React.createRef();
    this.name = React.createRef();
    this.address = React.createRef();
    this.phone = React.createRef();
    this.city = React.createRef();
  }

  static navigationOptions = {
    headerShown: false
  };

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    const { navigation } = this.props;
    const formType = navigation.getParam("formType");

    const firstTime = navigation.getParam("firstTime");
    console.log("firstTime : ",firstTime)
    if (firstTime != undefined) {
      if (firstTime == 1) {
        this.setState({ firstTime: 1 });
      }
    }

    if (formType != undefined) {
      if (formType == 1) {
        const shopInfo = navigation.getParam("shopInfo");
        console.log("shopInfo :", shopInfo);
        this.setState({
          shopInfo: shopInfo,
          formType: formType,
          gstNumber: shopInfo.gstin_number,
          name: shopInfo.shop_name,
          address: shopInfo.address,
          phone: shopInfo.contact,
          city: shopInfo.street
        });
      } else {
        this.setState({
          formType: formType
        });
      }
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    if (this.state.firstTime == 0) {
      return false;
    } else {
      return true;
    }
  };

  _onChangeText = key => text => {
    this.setState({
      [key]: text
    });
  };

  /**
   * @description This function will update the error messages in dom.
   */
  _onBlurText = (validatorKey, errorKey, stateKey) => () => {
    if (stateKey == "gstNumber" && this.state[stateKey] == "") {
      this.setState({
        [errorKey]: ""
      });
      return;
    }

    this.setState({
      [errorKey]: isValid(validatorKey, this.state[stateKey])
    });
  };

  validate = async () => {
    let status = { valid: true, message: "" };
    let nameError = isValid("alphanumericSpace", this.state.name);
    let phoneError = isValid("phone", this.state.phone);
    let gstError = "";
    if (this.state.gstNumber != "") {
      gstError = isValid("gstinNumber", this.state.gstNumber);
    }
    let addressError = isValid("required", this.state.address);
    let cityError = isValid("required", this.state.city);

    let promise = new Promise((resolve, reject) => {
      this.setState(
        {
          nameError,
          phoneError,
          gstError,
          addressError,
          cityError
        },
        () => {
          if (this.state.nameError) {
            status.valid = false;
            status.message = nameError;
          } else if (this.state.phoneError) {
            status.valid = false;
            status.message = phoneError;
          } else if (this.state.gstError) {
            status.valid = false;
            status.message = gstError;
          } else if (this.state.addressError) {
            status.valid = false;
            status.message = addressError;
          } else if (this.state.cityError) {
            status.valid = false;
            status.message = cityError;
          }
          resolve(status);
        }
      );
    });

    return promise;
  };

  _submitShopForm = async () => {
    try {
      let status = await this.validate();
      if (!status.valid) {
        Toast.show({
          text: `${status.message}!`,
          buttonText: "Okay",
          position: "bottom",
          type: "danger",
          duration: 5000
        });
      } else {
        this.setState({ isLoading: true });
        let userId = await userPreferences.getPreferences(
          userPreferences.userId
        );
        var formData = {
          shop_name: this.state.name,
          gstin_number: this.state.gstNumber,
          address: this.state.address,
          street: this.state.city,
          contact: this.state.phone,
          initial_amount: 0,
          balance_amount: 0,
          userId: userId
        };

        if (this.state.formType == 1) {
          formData.id = this.state.shopInfo.id;
        }

        console.log("formData : ", formData);

        let serverCallShop =
          this.state.formType == 0
            ? await ShopService.addShop(formData)
            : await ShopService.updateShop(formData);
        console.log("serverCallShop : ", serverCallShop);
        this.setState({ isLoading: false });
        if (serverCallShop.status == 0) {
          var msg = serverCallShop.msg;
          Toast.show({
            text: msg,
            buttonText: "Okay",
            type: "danger",
            duration: 5000
          });
        } else {
          var shopName = this.state.name
          this.setState({
            name: "",
            gstNumber: "",
            address: "",
            city: "",
            phone: ""
          });
          var msg = serverCallShop.msg;
          Toast.show({
            text: msg,
            buttonText: "Okay",
            type: "success",
            duration: 5000
          });
          console.log("this.state.firstTime : ",this.state.firstTime)
          if (this.state.firstTime == 1) {
            await userPreferences.setPreferences(
              userPreferences.userShopId,
              serverCallShop.shop.insertId + ""
            );
            await userPreferences.setPreferences(
              userPreferences.userShopName,
              shopName + ""
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

            this.props.navigation.navigate("Home");
          } else {
            this.props.navigation.goBack();
          }
        }
      }
    } catch (error) {
      this.setState({ isLoading: false }, () => {
        Toast.show({
          text:
            error && error.message
              ? error.message
              : error || "Not Valid Error!",
          buttonText: "Okay",
          type: "danger",
          duration: 5000
        });
      });
    }
  };

  _renderAddShop = () => {
    return (
      <>
        <Content padder contentContainerStyle={FormStyle.container}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between"
            }}
            showsHorizontalScrollIndicator={false}
          >
            <KeyboardAvoidingView>
              <Grid>
                <Row style={FormStyle.InputSection}>
                  <EATextLabel labelText={"Contact Number*"} />
                  <EATextInput
                    autoCapitalize="none"
                    value={this.state.phone}
                    keyboardType="number-pad"
                    onBlur={this._onBlurText("phone", "phoneError", "phone")}
                    error={this.state.phoneError}
                    onChangeText={this._onChangeText("phone")}
                    returnKeyType={'next'}
                    ref={this.phone}
                    onSubmitEditing={() => this.name.current.focusInput()} 
                  />
                </Row>
                <Row style={FormStyle.InputSection}>
                  <EATextLabel labelText={"Shop Name*"} />
                  <EATextInput
                    autoCapitalize="words"
                    value={this.state.name}
                    error={this.state.nameError}
                    onBlur={this._onBlurText(
                      "alphanumericSpace",
                      "nameError",
                      "name"
                    )}
                    onChangeText={this._onChangeText("name")}
                    returnKeyType={'next'}
                    ref={this.name}
                    onSubmitEditing={() => this.gstNumber.current.focusInput()} 
                  />
                </Row>
                <Row style={FormStyle.InputSection}>
                  <EATextLabel labelText={"GST Number (Optional)"} />
                  <EATextInput
                    autoCapitalize="characters"
                    value={this.state.gstNumber}
                    error={this.state.gstError}
                    onBlur={this._onBlurText(
                      "gstinNumber",
                      "gstError",
                      "gstNumber"
                    )}
                    onChangeText={this._onChangeText("gstNumber")}
                    returnKeyType={'next'}
                    ref={this.gstNumber}
                    onSubmitEditing={() => this.city.current.focusInput()} 
                  />
                </Row>
                <Row style={FormStyle.InputSection}>
                  <EATextLabel labelText={"Street/City*"} />
                  <EATextInput
                    autoCapitalize="words"
                    value={this.state.city}
                    error={this.state.cityError}
                    onBlur={this._onBlurText("required", "cityError", "city")}
                    onChangeText={this._onChangeText("city")}
                    returnKeyType={'next'}
                    ref={this.city}
                    onSubmitEditing={() => this.address.current.focusInput()} 
                  />
                </Row>
                <Row style={FormStyle.InputSection}>
                  <EATextLabel labelText={"Business Address*"} />
                  <EATextInput
                    autoCapitalize="sentences"
                    value={this.state.address}
                    error={this.state.addressError}
                    onBlur={this._onBlurText(
                      "required",
                      "addressError",
                      "address"
                    )}
                    onChangeText={this._onChangeText("address")}
                    returnKeyType={'done'}
                    ref={this.address}
                    onSubmitEditing={() => this.address.current.blurInput()} 
                  />
                </Row>
              </Grid>
            </KeyboardAvoidingView>
          </ScrollView>
        </Content>
        <Footer>
          <FooterTab>
            <Button full onPress={this._submitShopForm}>
              <Text>{this.state.formType == 0 ? "Add Shop" : "Update"}</Text>
            </Button>
          </FooterTab>
        </Footer>
      </>
    );
  };

  render() {
    return (
      <StyleProvider style={getTheme(commonColors)}>
        <Container>
          <Header noShadow>
            {this.state.firstTime == 0 ? (
              <Left>
                <Button
                  transparent
                  onPress={() => this.props.navigation.goBack()}
                >
                  <Icon name="arrow-back" />
                </Button>
              </Left>
            ) : (
              <></>
            )}

            <Body>
              <Title style={FormStyle.headerColor}>
                {" "}
                {this.state.formType == 0 ? "Add Shop" : "Edit Shop"}
              </Title>
            </Body>
            <Right></Right>
          </Header>
          {this.state.isLoading ? <Loader /> : this._renderAddShop()}
        </Container>
      </StyleProvider>
    );
  }
}

export default AddShop;
