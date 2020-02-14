import React from "react";
import {
  AsyncStorage,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  StatusBar
} from "react-native";

import {
  Container,
  Content,
  Text,
  StyleProvider,
  Button,
  Thumbnail,
  Toast,
  Spinner
} from "native-base";

import { Row, Grid } from "react-native-easy-grid";
import getTheme from "../../../native-base-theme/components";
import commonColors from "../../../native-base-theme/variables/commonColor";
import { WelcomeHeader, WelcomeHeaderDark } from "./AuthStyles";
import { EATextInput, EASpinner } from "../../components";
import UserService from "../../services/user";
import { isValid,utility, userPreferences } from "../../utility";

class SignupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        businessName: "",
        phone: ""
      },
      validator: {
        firstNameError: "",
        lastNameError: "",
        emailError: "",
        passwordError: "",
        confirmPasswordError: "",
        businessNameError: "",
        phoneError: ""
      },
      isLoading: false
    };
  }

  static navigationOptions = {
    headerShown: false
  };

  _onBlurText = (validatorKey, errorKey, stateKey) => () => {
    this.setState({
      validator: {
        ...this.state.validator,
        [errorKey]: isValid(validatorKey, this.state.user[stateKey])
      }
    });
  };

  /**
   * @description This function will validate the user object as expected in api
   * @param {Object} user - User Object with all the fields
   */
  validate = async user => {
    let status = { valid: true, message: "" };
    let firstNameError = isValid("firstName", user.firstName);
    let lastNameError = isValid("lastName", user.lastName);
    let emailError = isValid("email", user.email);
    let passwordError = isValid("password", user.password);
    let confirmPasswordError = isValid("password", user.confirmPassword);
    let businessNameError = isValid("businessName", user.businessName);
    let phoneError = isValid("phone", user.phone);

    // Promisify the validate function
    let promise = new Promise((resolve, reject) => {
      this.setState(
        {
          validator: {
            ...this.state.validator,
            firstNameError,
            lastNameError,
            emailError,
            passwordError,
            confirmPasswordError,
            businessNameError,
            phoneError
          }
        },
        () => {
          let validators = this.state.validator;
          for (let key in validators) {
            if (validators[key]) {
              status.valid = false;
              status.message = validators[key];
              break;
            }
          }
          resolve(status);
        }
      );
    });

    return promise;
  };

  /**
   * @description - This function will validate the user and is user details are valid, it will create the user and perform the sign-in.
   */
  _signUpAsync = async () => {
    try {
      let status = await this.validate(this.state.user);
      if (!status.valid) {
        Toast.show({
          text: `${status.message}!`,
          buttonText: "Okay",
          position: "bottom",
          type: "danger",
          duration: 5000
        });
      } else {
        if (this.state.user.password != this.state.user.confirmPassword) {
          Toast.show({
            text: `Password and Confirm Password should be same.`,
            buttonText: "Okay",
            type: "danger",
            duration: 5000
          });
        } else {
          this.setState({ isLoading: true });
          var user = {
            first_name: this.state.user.firstName,
            last_name: this.state.user.lastName,
            email_id: this.state.user.email,
            password: this.state.user.password,
            phone_number: this.state.user.phone,
            business_name: this.state.user.businessName
          };

       //   delete user.confirmPassword; // Clear confirm password!
          let authSign = await UserService.signup(user);
         // console.log("authSign : ", authSign);
          if (authSign.status == 0) {
            var msg = authSign.msg;
            this.setState({ isLoading: false });
            utility.showAlert(msg);
          } else {
            let auth = await UserService.login({
              email_id: this.state.user.email,
              password: this.state.user.password
            });

            if (auth.status == 0) {
              var msg = auth.msg;
              this.setState({ isLoading: false });
              utility.showAlert(msg);
            } else {
           //   console.log("auth : ", auth.users);
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

              this.setState({ isLoading: false });
              this.props.navigation.navigate("App");
            }
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

  _redirectSignIn = () => {
    this.props.navigation.navigate("SignIn");
  };

  _onChangeText = key => text => {
    this.setState({
      user: { ...this.state.user, [key]: text }
    });
  };

  _renderSignUp = () => {
    return (
      <Content padder contentContainerStyle={styles.container}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between"
          }}
        >
          <KeyboardAvoidingView>
            <Grid>
              <Row size={30} style={styles.logoContainer}>
                <Thumbnail
                  square
                  large
                  style={{ width: 100, height: 100 }}
                  source={require("../../../assets/icon.png")}
                />
                <Text style={styles.welcomeText}>
                  Hisaab <Text style={styles.welcomeDarkTexk}>App</Text>
                </Text>
              </Row>
              <Row size={70} style={styles.inputContainer}>
                <EATextInput
                  autoCapitalize="none"
                  value={this.state.user.firstName}
                  keyboardType="default"
                  placeholder="First Name"
                  onChangeText={this._onChangeText("firstName")}
                  error={this.state.validator.firstNameError}
                  onBlur={this._onBlurText(
                    "firstName",
                    "firstNameError",
                    "firstName"
                  )}
                />
                <EATextInput
                  autoCapitalize="none"
                  value={this.state.user.lastName}
                  keyboardType="default"
                  placeholder="Last Name"
                  onChangeText={this._onChangeText("lastName")}
                  error={this.state.validator.lastNameError}
                  onBlur={this._onBlurText(
                    "lastName",
                    "lastNameError",
                    "lastName"
                  )}
                />
                <EATextInput
                  autoCapitalize="none"
                  value={this.state.user.businessName}
                  keyboardType="default"
                  placeholder="Business Name"
                  onChangeText={this._onChangeText("businessName")}
                  error={this.state.validator.businessNameError}
                  onBlur={this._onBlurText(
                    "businessName",
                    "businessNameError",
                    "businessName"
                  )}
                />
                <EATextInput
                  autoCapitalize="none"
                  value={this.state.user.email}
                  keyboardType="email-address"
                  placeholder="Email"
                  onChangeText={this._onChangeText("email")}
                  error={this.state.validator.emailError}
                  onBlur={this._onBlurText("email", "emailError", "email")}
                />
                <EATextInput
                  autoCapitalize="none"
                  value={this.state.user.phone}
                  keyboardType="number-pad"
                  placeholder="Phone Number"
                  onChangeText={this._onChangeText("phone")}
                  error={this.state.validator.phoneError}
                  onBlur={this._onBlurText("phone", "phoneError", "phone")}
                />
                <EATextInput
                  secureTextEntry={true}
                  value={this.state.user.password}
                  placeholder="password"
                  placeholder="Password"
                  onChangeText={this._onChangeText("password")}
                  error={this.state.validator.passwordError}
                  onBlur={this._onBlurText(
                    "password",
                    "passwordError",
                    "password"
                  )}
                />
                <EATextInput
                  secureTextEntry={true}
                  value={this.state.user.confirmPassword}
                  placeholder="password"
                  placeholder="Confirm Password"
                  onChangeText={this._onChangeText("confirmPassword")}
                  error={this.state.validator.confirmPasswordError}
                  onBlur={this._onBlurText(
                    "password",
                    "confirmPasswordError",
                    "confirmPassword"
                  )}
                />
                <Button block onPress={this._signUpAsync}>
                  <Text>Sign Up</Text>
                </Button>
                <Row style={styles.signinContainer}>
                  <Text> Already have an account?</Text>
                  <Button
                    transparent
                    onPress={this._redirectSignIn}
                    style={{ marginTop: 10 }}
                  >
                    <Text>Sign In</Text>
                  </Button>
                </Row>
              </Row>
            </Grid>
          </KeyboardAvoidingView>
        </ScrollView>
      </Content>
    );
  };

  _renderLoader = () => {
    return (
      <Content padder contentContainerStyle={styles.container}>
        <EASpinner color="red" text="Signing up..." />
      </Content>
    );
  };

  render() {
    return (
      <>
        <StatusBar
          hidden={false}
          backgroundColor="#FE3852"
          barStyle="dark-content"
          translucent={true}
        />
        <StyleProvider style={getTheme(commonColors)}>
          <KeyboardAvoidingView style={styles.keyboardviewcontainer} enabled>
            <Container>
              {this.state.isLoading
                ? this._renderLoader()
                : this._renderSignUp()}
            </Container>
          </KeyboardAvoidingView>
        </StyleProvider>
      </>
      // </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "flex-start"
  },
  keyboardviewcontainer: {
    flex: 1
  },
  logoContainer: {
    flexDirection: "column",
    backgroundColor: "#FFF",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  inputContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: "column",
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "stretch"
  },
  signinContainer: {
    marginTop: 30,
    flexDirection: "column",
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    height: 80
  },
  welcomeText: WelcomeHeader,
  welcomeDarkTexk: WelcomeHeaderDark
});

export default SignupScreen;
