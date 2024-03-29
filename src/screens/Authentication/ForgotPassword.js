import React from "react";
import {
  View,
  AsyncStorage,
  StyleSheet,
  StatusBar,
  Image,
  KeyboardAvoidingView
} from "react-native";
import {
  Container,
  Content,
  Text,
  StyleProvider,
  Button,
  Toast
} from "native-base";
import getTheme from "../../../native-base-theme/components";
import commonColors from "../../../native-base-theme/variables/commonColor";
import SafeAreaView from "react-native-safe-area-view";
import { WelcomeHeader, WelcomeHeaderDark } from "./AuthStyles";
import { EATextInput, EASpinner } from "../../components";
import UserService from "../../services/user";
import {
  isValid,
  userPreferences,
  utility,
  Enums,
  createFormData
} from "../../utility";
import Loader from "../Shared/Loader";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      emailError: "",
      userInfo: null,
      isLoading: false
    };
  }

  static navigationOptions = {
    headerShown: false
  };

  componentDidMount() {}
  /**
   * @description This function will update the error messages in dom.
   */
  onBlurText = (validatorKey, errorKey, stateKey) => () => {
    this.setState({
      [errorKey]: isValid(validatorKey, this.state[stateKey])
    });
  };

  /**
   * @description This function will validate the user email  before api execution
   */
  validate = async () => {
    let status = { valid: true, message: "" };
    let emailError = isValid("email", this.state.email);
    let promise = new Promise((resolve, reject) => {
      this.setState(
        {
          emailError,
        },
        () => {
          if (this.state.emailError) {
            status.valid = false;
            status.message = emailError;
          }
          resolve(status);
        }
      );
    });

    return promise;
  };

  forgotPassword = async () => {
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
        let serverCallUser = await UserService.forgotPassword({
          emailId: this.state.email
        });
        this.setState({ isLoading: false });
        if (serverCallUser.status == 0) {
          var msg = serverCallUser.msg;
          utility.showAlert(msg);
        } else {
          console.log("userInfo : ", serverCallUser.userInfo);
          var msg = serverCallUser.msg;
          this.setState({ userInfo: serverCallUser.userInfo });
          Toast.show({
            text: msg,
            buttonText: "Okay",
            type: "success",
            duration: 5000
          });
          this.props.navigation.navigate("OtpVerification", {
            userInfo: serverCallUser.userInfo
          });
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

  redirectBack = () => {
    this.props.navigation.goBack();
  };

  onChangeText = key => text => {
    this.setState({
      [key]: text
    });
  };

  renderForgotPassword = () => {
    return (
      <Content padder contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logoView}
            source={require("../../../assets/icon.png")}
          />
          <Text style={WelcomeHeader}>
            Hisaab <Text style={WelcomeHeaderDark}>App</Text>
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <EATextInput
            autoCapitalize="none"
            autoCompleteType="email"
            value={this.state.email}
            keyboardType="email-address"
            placeholder="Email"
            onChangeText={this.onChangeText("email")}
            error={this.state.emailError}
            onBlur={this.onBlurText("email", "emailError", "email")}
          />
          <Button block onPress={this.forgotPassword}>
            <Text>Submit</Text>
          </Button>
        </View>
        <View style={styles.forgotContainer}>
          <Button
            transparent
            onPress={this.redirectBack}
            style={{ marginTop: 10 }}
          >
            <Text>Back</Text>
          </Button>
        </View>
      </Content>
    );
  };

  render() {
    return (
      <StyleProvider style={getTheme(commonColors)}>
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView style={styles.keyboardviewcontainer} enabled>
            <StatusBar
              hidden={false}
              barStyle="light-content"
              backgroundColor="#FE3852"
              translucent={true}
            />
            <Container>
              {this.state.isLoading ? <Loader /> : this.renderForgotPassword()}
            </Container>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start"
  },
  keyboardviewcontainer: {
    flex: 1
  },
  logoContainer: {
    flex: 3,
    backgroundColor: "#fff",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  logoView: {
    width: 100,
    height: 100
  },
  inputContainer: {
    flex: 4,
    backgroundColor: "#fff",
    justifyContent: "center",
    margin: 30
  },
  forgotContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center"
  }
});

export default ForgotPassword;
