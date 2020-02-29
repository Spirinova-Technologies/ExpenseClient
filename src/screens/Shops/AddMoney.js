import React from "react";

import {
  View,
  AsyncStorage,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView
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

class AddMoney extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: "",
      amountError: "",
      isLoading: false
    };
  }

  static navigationOptions = {
    headerShown: false
  };

  componentDidMount() {}

  _onChangeText = key => text => {
    this.setState({
      [key]: text
    });
  };

  _onBlurText = (validatorKey, errorKey, stateKey) => () => {
    this.setState({
      [errorKey]: isValid(validatorKey, this.state[stateKey])
    });
  };

  validate = async () => {
    let status = { valid: true, message: "" };
    let amountError = isValid("required", this.state.amount);

    let promise = new Promise((resolve, reject) => {
      this.setState(
        {
          amountError
        },
        () => {
          if (this.state.amountError) {
            status.valid = false;
            status.message = amountError;
          }
          resolve(status);
        }
      );
    });

    return promise;
  };

  _submitMoneyForm = async () => {
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

        let userShopId = await userPreferences.getPreferences(
          userPreferences.userShopId
        );

        var formData = {
          balance_amount: parseInt(this.state.amount),
          shopId: userShopId,
          userId: userId
        };

        console.log("formData : ", formData);

        let serverCallShop = await ShopService.addMoney(formData);

        console.log("serverCallShop : ", serverCallShop);
        this.setState({ isLoading: false });
        if (serverCallShop.status == 0) {
          var msg = serverCallShop.msg;
          utility.showAlert(msg);
        } else {
          this.setState({
            amount: ""
          });
          var msg = serverCallShop.msg;
          Toast.show({
            text: msg,
            buttonText: "Okay",
            type: "success",
            duration: 5000
          });
          this.props.navigation.goBack();
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


  _renderAddMoney = () => {
    return (
      <>
        <Content padder contentContainerStyle={FormStyle.container}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between"
            }}
          >
            <KeyboardAvoidingView>
              <Grid>
                <Row style={FormStyle.InputSection}>
                  <EATextLabel labelText={"Amount"} />
                  <EATextInput
                    autoCapitalize="none"
                    value={this.state.amount}
                    keyboardType="number-pad"
                    onBlur={this._onBlurText("required", "amountError", "amount")}
                    error={this.state.amountError}
                    onChangeText={this._onChangeText("amount")}
                  />
                </Row>
              </Grid>
            </KeyboardAvoidingView>
          </ScrollView>
        </Content>
        <Footer>
          <FooterTab>
            <Button full onPress={this._submitMoneyForm}>
              <Text>Add Money</Text>
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
            <Left>
              <Button
                transparent
                onPress={() => this.props.navigation.goBack()}
              >
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title style={FormStyle.headerColor}>
               Add Money
              </Title>
            </Body>
            <Right></Right>
          </Header>
          {this.state.isLoading ? <Loader /> : this._renderAddMoney()}
        </Container>
      </StyleProvider>
    );
  }
}

export default AddMoney;
