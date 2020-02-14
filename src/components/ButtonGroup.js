import React, { useState } from 'react';
import {
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    Button,
    Text,
    Grid,
    Row,
    Col,
    View,
} from 'native-base';

const EAButtonGroup = ({tab1, tab2, tab3,pressHandler}) => {
    const [tabIndex, settabIndex] = useState(1);

    const _onPressButton = (tabIndex) => event => {
        settabIndex(tabIndex);
        pressHandler(tabIndex - 1)
    };

    return (
        <Grid style={styles.buttonGroupContainer}>
            <Col style={[styles.buttonGroup, tabIndex === 1 ? styles.btnGrpActive:null]}>
                <TouchableOpacity style={styles.btnView} onPress={_onPressButton(1)}>
                    <Text style={[styles.btnTxt, tabIndex ===1 ? styles.btntxtActive : null]}>Current Month</Text>
                </TouchableOpacity>
            </Col>
            <Col style={[styles.buttonGroup, tabIndex === 2 ? styles.btnGrpActive : null]}>
                <TouchableOpacity style={styles.btnView} onPress={_onPressButton(2)}>
                    <Text style={[styles.btnTxt, tabIndex === 2 ? styles.btntxtActive : null]}>Last Month</Text>
                </TouchableOpacity>
            </Col>
            <Col style={tabIndex === 3 ? styles.btnGrpActive : {}}>
                <TouchableOpacity style={styles.btnView} onPress={_onPressButton(3)}>
                    <Text style={[styles.btnTxt, tabIndex === 3 ? styles.btntxtActive : null]}>Custom</Text>
                </TouchableOpacity>
            </Col>
        </Grid>
    )
};

const styles = StyleSheet.create({
    buttonGroupContainer: {
        borderWidth: 1,
        borderColor: '#FE3852',
        borderRadius: 5,
        height: 50,
    },
    buttonGroup: {
        borderRightWidth: 1,
        borderRightColor: '#FE3852',
    },
    btnGrpActive: {
        backgroundColor: '#FE3852',
    },
    btnView: {
        flex:1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnTxt: {
        color: '#FE3852',
        fontFamily: 'Roboto',
        textTransform: 'capitalize'
    },
    btntxtActive: {
        color: '#FFFFFF',
    }

});

export default EAButtonGroup;