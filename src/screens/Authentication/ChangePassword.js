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

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
      password: "",
      isLoading: false
    };
  }

  static navigationOptions = {
    headerShown: false
  };

  componentDidMount() {
    const { navigation } = this.props;
    const userInfo = navigation.getParam("userInfo");
    this.setState({ userInfo: userInfo });
  }

  onBlurText = (validatorKey, errorKey, stateKey) => () => {
    this.setState({
      [errorKey]: isValid(validatorKey, this.state[stateKey])
    });
  };

  onBlurText = (validatorKey, errorKey, stateKey) => () => {
    this.setState({
      [errorKey]: isValid(validatorKey, this.state[stateKey])
    });
  };

  validate = async () => {
    let status = { valid: true, message: "" };
    let passwordError = isValid("password", this.state.password);
    let promise = new Promise((resolve, reject) => {
      this.setState(
        {
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

  changePassword = async () => {
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
        let serverCallUser = await UserService.changePassword({
          userId: this.state.userInfo.id,
          change_password: this.state.password
        });

        if (serverCallUser.status == 0) {
          var msg = serverCallUser.msg;
          this.setState({ isLoading: false });
          utility.showAlert(msg);
        } else {
          let auth = await UserService.login({
            email_id: this.state.userInfo.email_id,
            password: this.state.password
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
            userPreferences.setPreferences(
              userPreferences.businessName,
              auth.users.business_name
            );
            userPreferences.setPreferences(
              userPreferences.profilePhoto,
              auth.users.profile_photo
            );
            this.setState({ isLoading: false });
            this.props.navigation.navigate("Shops");
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

  redirectBack = () => {
    this.props.navigation.goBack();
  };

  onChangeText = key => text => {
    this.setState({
      [key]: text
    });
  };

  renderChangePassword = () => {
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
        <Text style={styles.messageLabel}>Enter new password</Text>
          <EATextInput
           secureTextEntry={true}
            autoCapitalize="none"
            value={this.state.password}
            keyboardType="default"
            placeholder="Password"
            onChangeText={this.onChangeText("password")}
            error={this.state.passwordError}
            onBlur={this.onBlurText("password", "passwordError", "password")}
          />
          <Button block onPress={this.changePassword}>
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
              {this.state.isLoading ? <Loader /> : this.renderChangePassword()}
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
  messageLabel: {
    fontFamily: "Roboto",
    fontSize: 15,
    fontWeight: "500",
    paddingBottom: 8,
    alignSelf:"center",
    marginBottom:10
  },
  logoContainer: {
    flex: 2,
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


export default ChangePassword;
