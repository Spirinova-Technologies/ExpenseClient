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
import { isValid } from "../../utility";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      emailError: "",
      isLoading: false
    };
  }

  static navigationOptions = {
    headerShown: false
  };

  componentDidMount() {
    //	this.props.navigation.navigate('App');
  }
  /**
   * @description This function will update the error messages in dom.
   */
  _onBlurText = (validatorKey, errorKey, stateKey) => () => {
    this.setState({
      [errorKey]: isValid(validatorKey, this.state[stateKey])
    });
  };

  /**
   * @description This function will validate the user email and password before api execution
   */
  validate = async () => {
    let status = { valid: true, message: "" };
    let emailError = isValid("email", this.state.email);
    let promise = new Promise((resolve, reject) => {
      this.setState(
        {
          emailError,
          passwordError
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

  _forgotPasswordAsync = async () => {
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
        // this.setState({ isLoading: true });
        // let auth = await UserService.login({ email: this.state.email, password: this.state.password });
        // await AsyncStorage.setItem('userToken', ('Bearer ' + auth.token));
        // await AsyncStorage.setItem('user', JSON.stringify(auth.user));
        // this.setState({ isLoading: false });
        this.props.navigation.navigate("App");
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

  _redirectBack = () => {
    this.props.navigation.goBack();
  };

  _onChangeText = key => text => {
    this.setState({
      [key]: text
    });
  };

  _renderLogin = () => {
    return (
      <Content padder contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logoView}
            source={require("../../../assets/icon.png")}
          />
          <Text style={styles.welcomeText}>
            Hisaab <Text style={styles.welcomeDarkTexk}>App</Text>
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <EATextInput
            autoCapitalize="none"
            value={this.state.email}
            keyboardType="email-address"
            placeholder="Email"
            onChangeText={this._onChangeText("email")}
            error={this.state.emailError}
            onBlur={this._onBlurText("email", "emailError", "email")}
          />
          <Button block onPress={this._forgotPasswordAsync}>
            <Text>Submit</Text>
          </Button>
        </View>
        <View style={styles.forgotContainer}>
          <Button
            transparent
            onPress={this._redirectBack}
            style={{ marginTop: 10 }}
          >
            <Text>Back</Text>
          </Button>
        </View>
      </Content>
    );
  };

  _renderLoader = () => {
    return (
      <Content padder contentContainerStyle={styles.container}>
        <EASpinner color="red" text="Logging..." />
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
              {this.state.isLoading
                ? this._renderLoader()
                : this._renderLogin()}
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
  },
  welcomeText: WelcomeHeader,
  welcomeDarkTexk: WelcomeHeaderDark
});

export default ForgotPassword;
