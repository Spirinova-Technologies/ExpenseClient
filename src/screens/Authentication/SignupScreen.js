import React from "react";
import {
  AsyncStorage,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform
} from "react-native";

import {
  Container,
  Content,
  Text,
  StyleProvider,
  Button,
  Thumbnail,
  Toast,
  Spinner,
  Header
} from "native-base";

import { Row, Grid } from "react-native-easy-grid";
import getTheme from "../../../native-base-theme/components";
import commonColors from "../../../native-base-theme/variables/commonColor";
import { WelcomeHeader, WelcomeHeaderDark } from "./AuthStyles";
import {
  EATextInput,
  EASpinner,
  EATextInputRightButton
} from "../../components";
import UserService from "../../services/user";
import { isValid, utility, userPreferences } from "../../utility";

class SignupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        businessName: "",
        phone: ""
      },
      validator: {
        firstNameError: "",
        lastNameError: "",
        emailError: "",
        passwordError: "",
        businessNameError: "",
        phoneError: ""
      },
      showPassword: false,
      isLoading: false
    };
    this.firstName = React.createRef();
    this.lastName = React.createRef();
    this.email = React.createRef();
    this.password = React.createRef();
    this.businessName = React.createRef();
    this.phone = React.createRef();
    this.showPasswordTap = this.showPasswordTap.bind(this);
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
        this.setState({ isLoading: true });
        var user = {
          first_name: this.state.user.firstName,
          last_name: this.state.user.lastName,
          email_id: this.state.user.email,
          password: this.state.user.password,
          phone_number: this.state.user.phone,
          business_name: this.state.user.businessName
        };

        let authSign = await UserService.signup(user);
        // console.log("authSign : ", authSign);
        if (authSign.status == 0) {
          var msg = authSign.msg;
          this.setState({ isLoading: false });
          Toast.show({
            text: msg,
            buttonText: "Okay",
            type: "danger",
            duration: 5000
          });
        } else {
          let auth = await UserService.login({
            email_id: this.state.user.email,
            password: this.state.user.password
          });

          if (auth.status == 0) {
            var msg = auth.msg;
            this.setState({ isLoading: false });
            Toast.show({
              text: msg,
              buttonText: "Okay",
              type: "danger",
              duration: 5000
            });
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
            userPreferences.setPreferences(
              userPreferences.businessName,
              auth.users.business_name
            );
            userPreferences.setPreferences(
              userPreferences.profilePhoto,
              auth.users.profile_photo
            );
            this.setState({ isLoading: false });
            this.props.navigation.navigate("AddShop", { firstTime: 1 });
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
      <Content
        padder
        contentContainerStyle={{
          flexGrow: 1
        }}
      >
        <KeyboardAvoidingView behavior="padding" enabled>
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
                autoCapitalize="words"
                value={this.state.user.firstName}
                placeholder="First Name"
                onChangeText={this._onChangeText("firstName")}
                error={this.state.validator.firstNameError}
                onBlur={this._onBlurText(
                  "firstName",
                  "firstNameError",
                  "firstName"
                )}
                returnKeyType={'next'}
                ref={this.firstName}
                onSubmitEditing={() => this.lastName.current.focusInput()} 
              />
              <EATextInput
                autoCapitalize="words"
                value={this.state.user.lastName}
                placeholder="Last Name"
                onChangeText={this._onChangeText("lastName")}
                error={this.state.validator.lastNameError}
                onBlur={this._onBlurText(
                  "lastName",
                  "lastNameError",
                  "lastName"
                )}
                returnKeyType={'next'}
                ref={this.lastName}
                onSubmitEditing={() => this.businessName.current.focusInput()} 
              />
              <EATextInput
                autoCapitalize="words"
                value={this.state.user.businessName}
                placeholder="Business Name"
                onChangeText={this._onChangeText("businessName")}
                error={this.state.validator.businessNameError}
                onBlur={this._onBlurText(
                  "businessName",
                  "businessNameError",
                  "businessName"
                )}
                returnKeyType={'next'}
                ref={this.businessName}
                onSubmitEditing={() => this.email.current.focusInput()} 
              />
              <EATextInput
                autoCapitalize="none"
                autoCompleteType="email"
                value={this.state.user.email}
                keyboardType="email-address"
                placeholder="Email"
                onChangeText={this._onChangeText("email")}
                error={this.state.validator.emailError}
                onBlur={this._onBlurText("email", "emailError", "email")}
                returnKeyType={'next'}
                ref={this.email}
                onSubmitEditing={() => this.phone.current.focusInput()} 
              />
              <EATextInput
                autoCapitalize="none"
                autoCompleteType="tel"
                value={this.state.user.phone}
                keyboardType="number-pad"
                placeholder="Phone Number"
                onChangeText={this._onChangeText("phone")}
                error={this.state.validator.phoneError}
                onBlur={this._onBlurText("phone", "phoneError", "phone")}
                returnKeyType={'next'}
                ref={this.phone}
                onSubmitEditing={() => this.password.current.focusInput()} 
              />
              <EATextInputRightButton
                secureTextEntry={
                  this.state.showPassword == false ? true : false
                }
                value={this.state.user.password}
                placeholder="password"
                onChangeText={this._onChangeText("password")}
                error={this.state.validator.passwordError}
                onBlur={this._onBlurText(
                  "password",
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
              <Button block onPress={this._signUpAsync}>
                <Text>Sign Up</Text>
              </Button>
              <Row style={styles.signinContainer}>
                <Text> Already have an account?</Text>
                <Button transparent onPress={this._redirectSignIn}>
                  <Text>Sign In</Text>
                </Button>
              </Row>
            </Row>
          </Grid>
        </KeyboardAvoidingView>
      </Content>
    );
  };

  _renderLoader = () => {
    return (
      <Content
        padder
        contentContainerStyle={{
          flexGrow: 1
        }}
      >
        <EASpinner color="red" text="Signing up..." />
      </Content>
    );
  };

  render() {
    return (
      <>
        <StyleProvider style={getTheme(commonColors)}>
          <SafeAreaView style={styles.container}>
            <StatusBar
              hidden={false}
              backgroundColor="#FE3852"
              barStyle="dark-content"
              translucent={true}
            />

            <Container>
              {Platform.OS === 'ios'? (<></>):(<Header noShadow style={styles.header}></Header>)}
              {this.state.isLoading
                ? this._renderLoader()
                : this._renderSignUp()}
            </Container>
          </SafeAreaView>
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
  header: {
    backgroundColor: "#FFF"
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
    marginTop: 10,
    flexDirection: "column",
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "stretch"
  },
  signinContainer: {
    marginBottom: 10,
    marginTop: 0,
    marginLeft: 30,
    marginRight: 30,
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    height: 80
  },
  welcomeText: WelcomeHeader,
  welcomeDarkTexk: WelcomeHeaderDark
});

export default SignupScreen;
