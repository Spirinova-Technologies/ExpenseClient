import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { Picker ,Text} from "native-base";
import { inputPicker, inputTextError } from "../styles";
class EAPicker extends Component {
  render() {
    return (
      <View style={styles.inputView}>
        <Picker
          {...this.props}
          placeholderStyle={styles.placeholder}
          style={[styles.input, this.props.error ? styles.inputError : {}]}
        >
          <Picker.Item label={"Select"} value={0} key={"0"} />
          {this.props.option.map((value, index) => {
            return (
              <Picker.Item
                label={value.text}
                value={value.key}
                key={value.key + ""}
              />
            );
          })}
        </Picker>
        {this.props.error ? (
          <Text style={styles.inputtextError}>{this.props.error}</Text>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: inputPicker,
  inputError: inputTextError,
  inputtextError: {
    color: "#FE3852",
    fontFamily: "Roboto",
    fontSize: 13,
    padding: 0,
    margin: 0
  },
  placeholder:{
    fontFamily: 'Roboto',
    includeFontPadding: false,
    fontSize: 15,
    color: '#637381',
  }
});
export default EAPicker;
