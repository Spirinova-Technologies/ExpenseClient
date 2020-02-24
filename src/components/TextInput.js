import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { inputText, inputLabel, inputTextError } from "../styles";
import { DatePicker, Icon } from "native-base";

class EATextInput extends Component {
  render() {
    return (
      <View style={styles.inputView}>
        <TextInput
          {...this.props}
          style={[
            styles.input,
            this.props.multiline ? { height: 80 } : {},
            this.props.error ? styles.inputError : {}
          ]}
          maxLength={this.props.maxLength || 100}
        />
        {this.props.error ? (
          <Text style={styles.inputtextError}>{this.props.error}</Text>
        ) : null}
      </View>
    );
  }
}

class EATextInputRightButton extends Component {
  
  render() {
    const {btnPressHandler} = this.props;
    return (
        <>
      <View style={[styles.inputViewRightButton,
        { flex: 1 },
        this.props.error ? styles.inputError : {}
      ]}>
        <TextInput
          {...this.props}
          style={[
            { flex: 1 },
          ]}
          maxLength={this.props.maxLength || 100}
        />
        <TouchableOpacity onPress={()=>{btnPressHandler()}} style={styles.rightbutton}>
          <Icon type={this.props.btnImageType} name={this.props.btnImage}  size={20} />
        </TouchableOpacity>
      </View>
      {this.props.error ? (
          <Text style={styles.inputtextError}>{this.props.error}</Text>
        ) : null}
      </>
    );
  }
}

const EATextLabel = props => {
  return <Text style={styles.inputLabel}>{props.labelText}</Text>;
};

const EADatePicker = props => {
  return (
    <View>
      <DatePicker
        {...props}
        textStyle={[
          styles.input,
          styles.inputDate,
          props.error ? styles.inputError : {}
        ]}
        placeHolderTextStyle={[
          styles.input,
          styles.inputDate,
          props.error ? styles.inputError : {}
        ]}
      />
      {props.error ? (
        <Text style={styles.inputtextError}>{props.error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  input: inputText,
  inputLabel: inputLabel,
  inputError: inputTextError,
  inputtextError: {
    color: "#FE3852",
    fontFamily: "Roboto",
    fontSize: 13,
    padding: 0,
    margin: 0
  },
  inputViewRightButton: {
    flexDirection: "row",
    height: 45,
    backgroundColor: "#F7F7F7",
    borderWidth: 1,
    borderColor: "#EDEDED",
    marginBottom: 10,
    fontFamily: "Roboto",
    includeFontPadding: false,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 15,
    borderRadius: 4,
    color: "#637381"
  },
  rightbutton:{
      alignSelf:'center'
  },
  inputView: {
    marginBottom: 10
  },
  inputDate: {
    textAlignVertical: "center",
    includeFontPadding: true
  },
  searchIcon: {
    padding: 10
  }
});
export { EATextInput, EATextLabel, EADatePicker, EATextInputRightButton };
