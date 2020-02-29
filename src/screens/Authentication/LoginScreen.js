import React from "react";
import {
  View,
  AsyncStorage,
  StyleSheet,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  AlertIOS
} from "react-native";
import {
  Container,
  Content,
  Text,
  StyleProvider,
  Button,
  Grid,
  Row,
  Toast
} from "native-base";
import getTheme from "../../../native-base-theme/components";
import commonColors from "../../../native-base-theme/variables/commonColor";
import SafeAreaView from "react-native-safe-area-view";
import { WelcomeHeader, WelcomeHeaderDark } from "./AuthStyles";
import {
  EATextInput,
  EASpinner,
  EATextInputRightButton
} from "../../components";
import UserService from "../../services/user";
import { isValid, utility, userPreferences } from "../../utility";
import { FormStyle } from "../../styles";
class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      emailError: "",
      passwordError: "",
      showPassword: false,
      isLoading: false
    };
    this.email = React.createRef();
    this.password = React.createRef();
    this.showPasswordTap = this.showPasswordTap.bind(this);
  }

  static navigationOptions = {
    headerShown: false
  };

  componentDidMount() {
    //this.checkAuth();
  }

  checkAuth = async () => {
    let userId = await userPreferences.getPreferences(userPreferences.userId);
    console.log("userId : ", userId);
    if (userId != null) {
      let userShopId = await userPreferences.getPreferences(
        userPreferences.userShopId
      );
      console.log("userShopId : ", userShopId);
      if (userShopId != null) {
        this.props.navigation.navigate("App");
      } else {
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
    let passwordError = isValid("required", this.state.password);
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
          Toast.show({
            text: msg,
            buttonText: "Okay",
            type: "danger",
            duration: 5000
          });
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

          if (auth.shop_flag == 1) {
            if (auth.shop != null && auth.shop.length == 1) {
              let shopInfo = auth.shop[0];
              await userPreferences.setPreferences(
                userPreferences.userShopId,
                shopInfo.id + ""
              );
              await userPreferences.setPreferences(
                userPreferences.userShopName,
                shopInfo.shop_name + ""
              );
              this.props.navigation.navigate("App");
            } else {
              this.props.navigation.navigate("Shops");
            }
          } else {
            console.log("Worke like a pro");
            this.props.navigation.navigate("AddShop", { firstTime: 1 });
          }
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

  showPasswordTap = () => {
    if (this.state.showPassword == true) {
      this.setState({
        showPassword: false
      });
    } else {
      this.setState({
        showPassword: true
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
          <Grid style={[{ padding: 0 }]}>
            <Row style={FormStyle.loginInputSection}>
              <EATextInput
                autoCapitalize="none"
                autoCompleteType="email"
                value={this.state.email}
                keyboardType="email-address"
                placeholder="Email"
                onChangeText={this._onChangeText("email")}
                error={this.state.emailError}
                onBlur={this._onBlurText("email", "emailError", "email")}
                returnKeyType={'next'}
                ref={this.email}
                onSubmitEditing={() => this.password.current.focusInput()} 
              />
            </Row>
            <Row style={FormStyle.loginInputSection}>
              <EATextInputRightButton
                secureTextEntry={
                  this.state.showPassword == false ? true : false
                }
                value={this.state.password}
                placeholder="Password"
                keyboardType="default"
                onChangeText={this._onChangeText("password")}
                error={this.state.passwordError}
                onBlur={this._onBlurText(
                  "required",
                  "passwordError",
                  "password"
                )}
                returnKeyType={'done'}
                ref={this.password}
                onSubmitEditing={() => this.password.current.blurInput()} 
                btnPressHandler={this.showPasswordTap}
                btnImage={
                  this.state.showPassword == false ? "ios-eye" : "ios-eye-off"
                }
                btnImageType={"Ionicons"}
              />
            </Row>
            <Row style={FormStyle.loginInputSection}>
              <Button block onPress={this._signInAsync}>
                <Text>Log In</Text>
              </Button>
            </Row>
            <Row style={FormStyle.loginInputSection}>
              <Button
                transparent
                onPress={this._redirectForgotPassword}
                style={{ marginTop: 10, alignSelf: "center" }}
              >
                <Text>Forgot Password</Text>
              </Button>
            </Row>
          </Grid>
        </View>
        <View style={styles.signupContainer}>
          <Text>Don’t have an account?</Text>
          <Button transparent onPress={this._redirectSignup}>
            <Text>Sign Up</Text>
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
          <KeyboardAvoidingView
            style={styles.keyboardviewcontainer}
            behavior={Platform.select({ android: null, ios: "padding" })}
            enabled
          >
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
    flexGrow: 1,
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
    flex: 3,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 0,
    marginBottom: 0,
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30
  },
  signupContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 0,
    marginLeft: 30,
    marginRight: 30
  },
  welcomeText: WelcomeHeader,
  welcomeDarkTexk: WelcomeHeaderDark
});

export default LoginScreen;
