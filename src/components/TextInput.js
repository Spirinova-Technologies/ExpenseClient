import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { inputText, inputLabel, inputTextError } from '../styles';
import { DatePicker,Icon } from 'native-base';

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
                {this.props.error ? <Text style={styles.inputtextError}>{this.props.error}</Text> : null}
            </View>
        );
    }
};


const EATextLabel = (props) => {
    return (
        <Text style={styles.inputLabel}>
            {props.labelText}
        </Text>
    )
}

const EADatePicker = (props) => {
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
            {props.error ? <Text style={styles.inputtextError}>{props.error}</Text> : null}
        </View>
    )
};


const styles = StyleSheet.create({
    input: inputText,
    inputLabel: inputLabel,
    inputError: inputTextError,
    inputtextError: {
        color: '#FE3852',
        fontFamily: 'Roboto',
        fontSize: 13,
        padding: 0,
        margin: 0
    },
    inputView:{
        marginBottom:10
    },
    inputDate: {
        textAlignVertical: 'center',
        includeFontPadding: true,
    }
});
export { EATextInput, EATextLabel, EADatePicker };