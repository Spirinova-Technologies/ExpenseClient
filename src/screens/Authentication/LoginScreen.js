import React from "react";
import {
  View,
  AsyncStorage,
  StyleSheet,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  AlertIOS
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
import { isValid, utility, userPreferences } from "../../utility";

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      emailError: "",
      passwordError: "",
      isLoading: false
    };
  }

  static navigationOptions = {
    headerShown: false
  };

  componentDidMount() {
    this.checkAuth();
  }

  checkAuth = async () => {
    let userId = await userPreferences.getPreferences(userPreferences.userId);
    console.log("userId : ", userId);
    if (userId != null) {
        let userShopId = await userPreferences.getPreferences(userPreferences.userShopId);
    console.log("userShopId : ", userShopId);
        if (userShopId != null) {
          this.props.navigation.navigate("App");
        }else{
          this.props.navigation.navigate("Shops");
        }
    }
  };

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
    let passwordError = isValid("password", this.state.password);
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
          } else if (this.state.passwordError) {
            status.valid = false;
            status.message = passwordError;
          }
          resolve(status);
        }
      );
    });

    return promise;
  };

  _signInAsync = async () => {
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
        let auth = await UserService.login({
          email_id: this.state.email,
          password: this.state.password
        });
        console.log("auth : ", auth);
        this.setState({ isLoading: false });
        if (auth.status == 0) {
          var msg = auth.msg;
          utility.showAlert(msg);
        } else {
         // console.log("auth : ", auth.users.id);
          var msg = auth.msg;
          userPreferences.setPreferences(
            userPreferences.authToken,
            "Bearer " + auth.token
          );
          userPreferences.setPreferences(
            userPreferences.userId,
            auth.users.id + ""
          );
          userPreferences.setPreferences(
            userPreferences.firstName,
            auth.users.first_name
          );
          userPreferences.setPreferences(
            userPreferences.lastName,
            auth.users.last_name
          );
          userPreferences.setPreferences(
            userPreferences.emailId,
            auth.users.email_id
          );
          userPreferences.setPreferences(
            userPreferences.phoneNumber,
            auth.users.phone_number + ""
          );
          userPreferences.setPreferences(
            userPreferences.address,
            auth.users.address
          );
          userPreferences.setPreferences(
            userPreferences.businessName,
            auth.users.business_name
          );
          userPreferences.setPreferences(
            userPreferences.profilePhoto,
            auth.users.profile_photo
          );
          this.props.navigation.navigate("Shops");
          //this.props.navigation.navigate("App");
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

  _redirectSignup = () => {
    this.props.navigation.navigate("SignUp");
  };

  _redirectForgotPassword = () => {
    this.props.navigation.navigate("ForgotPassword");
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
            style={{ width: 100, height: 100 }}
            source={require("../../../assets/icon.png")}
          />
          <Text style={styles.welcomeText}>
            Hisaab <Text style={styles.welcomeDarkTexk}>App</Text>
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <EATextInput
            autoCapitalize="none"
            autoCompleteType="email"
            value={this.state.email}
            keyboardType="email-address"
            placeholder="Email"
            onChangeText={this._onChangeText("email")}
            error={this.state.emailError}
            onBlur={this._onBlurText("email", "emailError", "email")}
          />
          <EATextInput
            secureTextEntry={true}
            value={this.state.password}
            placeholder="Password"
            onChangeText={this._onChangeText("password")}
            error={this.state.passwordError}
            onBlur={this._onBlurText("password", "passwordError", "password")}
          />
          <Button block onPress={this._signInAsync}>
            <Text>Log In</Text>
          </Button>
          <Button
            transparent
            onPress={this._redirectForgotPassword}
            style={{ marginTop: 10, alignSelf: "center" }}
          >
            <Text>Forgot Password!</Text>
          </Button>
        </View>
        <View style={styles.signupContainer}>
          <Text> Doesn't have an account?</Text>
          <Button
            transparent
            onPress={this._redirectSignup}
            style={{ marginTop: 10 }}
          >
            <Text>Sign Up!</Text>
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
  inputContainer: {
    flex: 4,
    backgroundColor: "#fff",
    justifyContent: "center",
    margin: 30
  },
  signupContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center"
  },
  welcomeText: WelcomeHeader,
  welcomeDarkTexk: WelcomeHeaderDark
});

export default LoginScreen;
