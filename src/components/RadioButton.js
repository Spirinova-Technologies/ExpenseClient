import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { inputLabel } from '../styles';

class RadioButton extends Component
{
    constructor()
    {
        super();
    }
 
    render()
    {
        return(
            <TouchableOpacity onPress = { this.props.onClick } activeOpacity = { 0.8 } style = { styles.radioButton }>
                <View style = {[ styles.radioButtonHolder,{ height: this.props.button.size, width: this.props.button.size },(this.props.button.selected) ? {borderColor: this.props.button.color}:{borderColor:'#637381'}]}>
                {
                    (this.props.button.selected)
                    ?
                        (<View style = {[ styles.radioIcon, { height: this.props.button.size / 2, width: this.props.button.size / 2, backgroundColor: this.props.button.color }]}></View>)
                    :
                        null
                }
                </View>
                <Text style = {[ styles.label,styles.labelText]}>{ this.props.button.label }</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create(
    {
        container:
        {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 25
        },
     
        radioButton:
        {
            flexDirection: 'row',
            margin: 10,
            alignItems: 'center',
            justifyContent: 'center'
        },
     
        radioButtonHolder:
        {
            borderRadius: 50,
            borderWidth: 2,
            justifyContent: 'center',
            alignItems: 'center'
        },
     
        radioIcon:
        {
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center'
        },
        label:inputLabel,
        labelText:{
            marginTop:2,
            alignSelf:'center',
            color: "#2e2e2e",
            fontSize: 18,
            fontWeight: "400",
            marginLeft:15
        }
    });
export default RadioButton;