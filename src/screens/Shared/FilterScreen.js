import React, { Component } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  View
} from "react-native";
import {
  Container,
  Content,
  Button,
  Text,
  StyleProvider,
  Grid,
  Row,
  Col
} from "native-base";
import getTheme from "../../../native-base-theme/components";
import commonColors from "../../../native-base-theme/variables/commonColor";
import {
  EATextInput,
  EATextLabel,
  EADatePicker,
  RadioButton
} from "../../components";
import { isValid } from "../../utility";
class FilterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromDate: new Date(),
      toDate:new Date(),
      fromDateError: "",
      toDateError: ""
    };
    this._submitFilterForm = this._submitFilterForm.bind(this);
  }

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

  _submitFilterForm = () => {
    let fromDateError = isValid("required", this.state.fromDate);
    let toDateError = isValid("required", this.state.toDate);
    // let paymentError = isValid('required', this.state.address);

    this.setState({
      fromDateError,
      toDateError
    });
    console.log("fromDateError " ,fromDateError)
    console.log("toDateError " ,toDateError)
    if (!fromDateError && !toDateError) {
     
      var fromDate = new Date(this.state.fromDate);
      var toDate = new Date(this.state.toDate);

      this.props.completionHandler(
        1,
        fromDate.getFullYear() +
          "-" +
          (fromDate.getMonth() + 1) +
          "-" +
          fromDate.getDate(),
        toDate.getFullYear() +
          "-" +
          (toDate.getMonth() + 1) +
          "-" +
          toDate.getDate()
      );
    }
  };

  render() {
    const { completionHandler } = this.props;
    return (
      <>
        <StyleProvider style={getTheme(commonColors)}>
          <KeyboardAvoidingView style={styles.container}>
            <View>
              <View>
                <Text style={styles.headerLabel}>Set Custom Dates</Text>
              </View>
              <View style={styles.dateGroup}>
                <EATextLabel labelText={"From Date"} />
                <EADatePicker
                  defaultDate={new Date()}
                  minimumDate={new Date(2016, 1, 1)}
                  maximumDate={new Date()}
                  locale={"en"}
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType={"fade"}
                  androidMode={"default"}
                  onDateChange={this._onChangeText("fromDate")}
                  disabled={false}
                />
              </View>
              <View style={styles.dateGroup}>
                <EATextLabel labelText={"To Date"} />
                <EADatePicker
                  defaultDate={new Date()}
                  minimumDate={new Date(2016, 1, 1)}
                  maximumDate={new Date()}
                  locale={"en"}
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType={"fade"}
                  androidMode={"default"}
                  onDateChange={this._onChangeText("toDate")}
                  disabled={false}
                />
              </View>
            </View>
            <View style={styles.buttonGroup}>
              <Button
                style={styles.cancelButton}
                transparent
                onPress={() => completionHandler(0, "", "")}
              >
                <Text style={styles.cancelLabel}>Cancel</Text>
              </Button>
              <Button
                style={styles.saveButton}
                transparent
                onPress={this._submitFilterForm}
              >
                <Text style={styles.saveLabel}>Save</Text>
              </Button>
            </View>
          </KeyboardAvoidingView>
        </StyleProvider>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    width: "80%",
    borderColor: "rgba(0, 0, 0, 0.4)"
  },
  radioGroup: {
    alignItems: "flex-start"
  },
  headerLabel: {
    alignItems: "flex-start",
    color: "#FE3852",
    margin: 10,
    fontSize: 18,
    fontWeight: "400"
  },
  dateGroup: {
    margin: 10
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "flex-end",
    margin: 10,
    alignItems: "flex-end"
  },
  cancelButton: {
    // alignItems: "flex-start",
    marginRight: 10
  },
  cancelLabel: {
    alignSelf: "center",
    color: "#637381",
    fontSize: 18,
    fontWeight: "400"
  },
  saveButton: {
    // alignItems: "flex-start",
    marginLeft: 10
  },
  saveLabel: {
    alignSelf: "center",
    color: "#FE3852",
    fontSize: 18,
    fontWeight: "400"
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12
  }
});

export default FilterScreen;
