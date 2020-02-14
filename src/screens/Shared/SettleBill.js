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
class SettleBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radioItems: [
        {
          label: "Partial Settlement",
          size: 25,
          color: "#FE3852",
          selected: false
        },
        {
          label: "Full Settlement",
          color: "#FE3852",
          size: 25,
          selected: false
        }
      ],
      amount: "",
      amountError: "",
    };
  }

  componentDidMount() {
    this.state.radioItems.map(item => {
      if (item.selected == true) {
        this.setState({ selectedItem: item.label });
      }
    });
  }

  changeActiveRadioButton(index) {
    this.state.radioItems.map(item => {
      item.selected = false;
    });

    this.state.radioItems[index].selected = true;

    this.setState({ radioItems: this.state.radioItems }, () => {
      this.setState({ selectedItem: this.state.radioItems[index].label });
    });
  }

  _onChangeText = (key) => (text) => {
    this.setState({
        [key]: text
    });
};

_onBlurText = (validatorKey, errorKey, stateKey) => () => {
    this.setState({
        [errorKey]: isValid(validatorKey, this.state[stateKey]),
    })
};

_submitSettleBillForm = () => {
  let amountError = isValid('required', this.state.amount);
 // let paymentError = isValid('required', this.state.address);
  
  this.setState({
      amountError
  })

  if ( !amountError ) {
    this.props.pressCancelHandler()
  }
};

  render() {
    const {pressCancelHandler} = this.props;
    return (
      <>
        <StyleProvider style={getTheme(commonColors)}>
          <KeyboardAvoidingView style={styles.container}>
            <View>
              <View>
                <Text style={styles.headerLabel}>Settle Bill</Text>
              </View>

              <View style={styles.radioGroup}>
                {this.state.radioItems.map((item, key) => (
                  <RadioButton
                    key={key}
                    button={item}
                    onClick={this.changeActiveRadioButton.bind(this, key)}
                  />
                ))}
              </View>
              <View style={styles.amountGroup}>
                <EATextLabel labelText={'Enter Settled Amount'} />

                <EATextInput
                  autoCapitalize="none"
                  value={this.state.amount}
                  keyboardType="number-pad"
                  error={this.state.amountError}
                  onBlur={this._onBlurText('required', 'amountError', 'amount')}
                  onChangeText={this._onChangeText('amount')} />
              </View>
            </View>
            <View style={styles.buttonGroup}>
              <Button style={styles.cancelButton} transparent onPress={()=> pressCancelHandler()}>
                <Text style={styles.cancelLabel}>Cancel</Text>
              </Button>
              <Button style={styles.saveButton} transparent onPress={this._submitSettleBillForm}>
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
  amountGroup:{
    margin: 10,
  },
  buttonGroup:{
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 10,
    alignItems: "flex-end",
  },
  cancelButton: {
   // alignItems: "flex-start",
    marginRight: 10
  },
  cancelLabel: {
    alignSelf:'center',
    color: "#637381",
    fontSize: 18,
    fontWeight: "400"
  },
  saveButton: {
   // alignItems: "flex-start",
    marginLeft: 10,
  },
  saveLabel: {
    alignSelf:'center',
    color: "#FE3852",
    fontSize: 18,
    fontWeight: "400"
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12
  }
});

export default SettleBill;
