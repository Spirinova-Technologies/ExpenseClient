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
import { EATextInput, EASpinner, EAOtpTextInput } from "../../components";
import UserService from "../../services/user";
import {
  isValid,
  userPreferences,
  utility,
  Enums,
  createFormData
} from "../../utility";
import Loader from "../Shared/Loader";

class OtpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
      otpField1: "",
      otpField2: "",
      otpField3: "",
      otpField4: "",
      otpField1Error: "",
      otpField2Error: "",
      otpField3Error: "",
      otpField4Error: "",
      isLoading: false
    };

    this.otpField1 = React.createRef();
    this.otpField2 = React.createRef();
    this.otpField3 = React.createRef();
    this.otpField4 = React.createRef();

    this.onChangeText = this.onChangeText.bind(this);
    this.focusPrevious = this.focusPrevious.bind(this);
  }

  static navigationOptions = {
    headerShown: false
  };

  componentDidMount() {
    this.otpField1.current.focusInput();
    const { navigation } = this.props;
    const userInfo = navigation.getParam("userInfo");
    this.setState({ userInfo: userInfo });
  }

  onBlurText = (validatorKey, errorKey, stateKey) => () => {
    this.setState({
      [errorKey]: isValid(validatorKey, this.state[stateKey])
    });
  };

  validate = async () => {
    let status = { valid: true, message: "" };
    let otpField1Error = isValid("required", this.state.otpField1);
    let otpField2Error = isValid("required", this.state.otpField2);
    let otpField3Error = isValid("required", this.state.otpField3);
    let otpField4Error = isValid("required", this.state.otpField4);
    let promise = new Promise((resolve, reject) => {
      this.setState(
        {
          otpField1Error,
          otpField2Error,
          otpField3Error,
          otpField4Error
        },
        () => {
          if (this.state.otpField1Error) {
            status.valid = false;
            status.message = otpField1Error;
          } else if (this.state.otpField2Error) {
            status.valid = false;
            status.message = otpField2Error;
          } else if (this.state.otpField3Error) {
            status.valid = false;
            status.message = otpField3Error;
          } else if (this.state.otpField4Error) {
            status.valid = false;
            status.message = otpField4Error;
          }
          resolve(status);
        }
      );
    });

    return promise;
  };

  otpVerification = async () => {
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
        let otpFieldValue =
          this.state.otpField1 +
          this.state.otpField2 +
          this.state.otpField3 +
          this.state.otpField4;

        this.setState({ isLoading: true });
        let serverCallUser = await UserService.otpVerification({
          otp: otpFieldValue,
          userId: this.state.userInfo.id
        });
        this.setState({ isLoading: false });
        if (serverCallUser.status == 0) {
          var msg = serverCallUser.msg;
          utility.showAlert(msg);
        } else {
          console.log("userInfo : ", serverCallUser.userInfo);
          var msg = serverCallUser.msg;
          Toast.show({
            text: msg,
            buttonText: "Okay",
            type: "success",
            duration: 5000
          });
          this.props.navigation.navigate("ChangePassword", {
            userInfo: this.state.userInfo
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

  resendOtp = async () => {
    try {
      this.setState({ isLoading: true });
      let serverCallUser = await UserService.forgotPassword({
        emailId: this.state.userInfo.email_id
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
    if (text != "") {
      if (key == "otpField1") {
        this.otpField2.current.focusInput();
      } else if (key == "otpField2") {
        this.otpField3.current.focusInput();
      } else if (key == "otpField3") {
        this.otpField4.current.focusInput();
      } else if (key == "otpField4") {
        this.otpField4.current.blurInput();
      }
    }

    this.setState({
      [key]: text
    });
  };

  focusPrevious(key, index) {
    console.log("key : ", key);
    if (key === "Backspace" && index !== 1) {
      if (index == 1) {
        this.otpField1.current.blurInput();
      } else if (index == 2) {
        this.otpField1.current.focusInput();
      } else if (index == 3) {
        this.otpField2.current.focusInput();
      } else if (index == 4) {
        this.otpField3.current.focusInput();
      }
    }
  }

  renderOtpScreen = () => {
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
        <View style={styles.messageContainer}>
          {this.state.userInfo != null ? (
            <Text style={styles.messageLabel}>
              Hello, {this.state.userInfo.first_name}{" "}
              {this.state.userInfo.last_name}! We've just sent you an OTP on{" "}
              {this.state.userInfo.email_id}. Enter it below to continue.
            </Text>
          ) : (
            <></>
          )}
        </View>
        <View style={styles.inputContainer}>
            <EAOtpTextInput
              autoCapitalize="none"
              value={this.state.otpField1}
              keyboardType="number-pad"
              placeholder=""
              onChangeText={this.onChangeText("otpField1")}
              error={this.state.otpField1Error}
              onBlur={this.onBlurText(
                "required",
                "otpField1Error",
                "otpField1"
              )}
              ref={this.otpField1}
              onKeyPress={e => this.focusPrevious(e.nativeEvent.key, 1)}
              maxLength={1}
            />
            <EAOtpTextInput
              autoCapitalize="none"
              value={this.state.otpField2}
              keyboardType="number-pad"
              placeholder=""
              onChangeText={this.onChangeText("otpField2")}
              error={this.state.otpField2Error}
              onBlur={this.onBlurText(
                "required",
                "otpField2Error",
                "otpField2"
              )}
              ref={this.otpField2}
              onKeyPress={e => this.focusPrevious(e.nativeEvent.key, 2)}
              maxLength={1}
            />

            <EAOtpTextInput
              autoCapitalize="none"
              value={this.state.otpField3}
              keyboardType="number-pad"
              placeholder=""
              onChangeText={this.onChangeText("otpField3")}
              error={this.state.otpField3Error}
              onBlur={this.onBlurText(
                "required",
                "otpField3Error",
                "otpField3"
              )}
              ref={this.otpField3}
              onKeyPress={e => this.focusPrevious(e.nativeEvent.key, 3)}
              maxLength={1}
            />

            <EAOtpTextInput
              autoCapitalize="none"
              value={this.state.otpField4}
              keyboardType="number-pad"
              placeholder=""
              onChangeText={this.onChangeText("otpField4")}
              error={this.state.otpField4Error}
              onBlur={this.onBlurText(
                "required",
                "otpField4Error",
                "otpField4"
              )}
              ref={this.otpField4}
              onKeyPress={e => this.focusPrevious(e.nativeEvent.key, 4)}
              maxLength={1}
            />
        </View>
        <View style={styles.resendContainer}>
          <Button transparent onPress={this.resendOtp}>
            <Text>Did not get the OTP? Click here to resend.</Text>
          </Button>
        </View>
        <View style={styles.submitContainer}>
          <Button block onPress={this.otpVerification}>
            <Text>Submit</Text>
          </Button>
        </View>

        <View style={styles.BackContainer}>
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
              {this.state.isLoading ? <Loader /> : this.renderOtpScreen()}
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
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    alignItems: "center",
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10,
    marginTop: 10
  },
  messageContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    margin: 30
  },
  messageLabel: {
    fontFamily: "Roboto",
    fontSize: 15,
    fontWeight: "500",
    paddingBottom: 8
  },
  resendContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10,
    marginTop: 0
  },
  submitContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10,
    marginTop: 0
  },
  BackContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center"
  }
});

export default OtpScreen;
