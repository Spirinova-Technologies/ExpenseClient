import React from 'react';
import {
    StyleSheet,Image,TouchableOpacity
} from 'react-native';
import {
    Button,
    Icon,
    Text,
    Grid,
    Row,
    Col,
    View
} from 'native-base';

import AppConstant from '../utility/AppConstant';

const EASingleListItem = ({ data,name,location,pressHandler}) => {
    return (
        <TouchableOpacity onPress={() => pressHandler(data)}>
        <Grid style={styles.item}>
           
            <Row style={styles.row}>
                <Col size={70}>
                <Text style={styles.title}>{name} - {location}</Text>
                </Col>
                <Col size={30} style={styles.amountCol}>
                    {/* {data.checked ? 
                    <Image style={styles.listImage} source={AppConstant.ImageConstant.ic_circle} />: */}
                    <Image style={styles.listImage} source={AppConstant.ImageConstant.ic_circle} />
                    {/* }          */}
                </Col>
            </Row>
            
        </Grid>
        </TouchableOpacity>
        
    );
}

const styles = StyleSheet.create({
    item: {
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#DFDFDF',
    },
    row: {
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    amountCol: {
        alignItems: 'flex-end'
    },
    title: {
        fontSize: 18,
        fontWeight: "500",
        color: '#2e2e2e',
        
    },
    listImage: {
        margin: 0,
        height: 50,
        width: 50,
        marginRight: 10
    },
    iconText: {
        fontSize: 20,
        marginLeft: 0,
        marginRight: 0,
    },
    dangerText: {
        color: '#FE3852'
    },
    displayNone: {
        display: 'none'
    }
});

export default EASingleListItem;