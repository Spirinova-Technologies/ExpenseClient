import React from 'react';
import {
    StyleSheet,TouchableOpacity
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

const EAListItem = ({ supplier,billInfo, thirdLine, secondLineIcon, debitText, creditText, showNegative ,type,pressHandler}) => {

    if(type == 1){
        return (
            <TouchableOpacity onPress={() => pressHandler(supplier)}>
            <Grid style={styles.item}>
                <Row style={styles.row}>
                    <Col size={70}>
                        <Text style={styles.title}>{supplier.supplier_name}</Text>
                    </Col>
                    <Col size={30} style={styles.amountCol}>
                            <Text style={[styles.amountText, styles.dangerText]}>-1000</Text>
                    </Col>
                </Row>
                <Row style={styles.row}>
                    <Col>
                        <Row>
                            <Icon type="MaterialIcons" name='location-on' style={[styles.subHeaderIcon, secondLineIcon == false ? styles.displayNone : null]} />
                            <Text style={styles.subHeader}>{supplier.supplier_city}</Text>
                        </Row>
                    </Col>
                    <Col style={styles.amountCol}>
                        
                            <Text style={[styles.amountText, styles.subHeader]}>{'Outstanding'}</Text>
                    </Col>
                </Row>
                <Row style={[styles.row, thirdLine == false ? styles.displayNone: null]} >
                    <Button small rounded style={styles.listButton}>
                        <Icon type="MaterialIcons" name='phone' style={styles.iconText} />
                    </Button>
                    <Button small rounded dark style={styles.listButton}>
                        <Icon type="MaterialIcons" name='message' style={styles.iconText} />
                    </Button>
                </Row>
            </Grid>
            </TouchableOpacity>
        );
    }else if(type == 2){
        return (
            <TouchableOpacity onPress={() => pressHandler(billInfo)}>
            <Grid style={styles.item}>
                <Row style={styles.row}>
                    <Col size={70}>
                        <Text style={styles.title}>{billInfo.bill_number}</Text>
                    </Col>
                    <Col size={30} style={styles.amountCol}>
                        {billInfo.bill_status == 2 ?
                            <Text style={styles.amountText}>{billInfo.bill_amount}</Text> :
                            <Text style={[styles.amountText, styles.dangerText]}>{billInfo.bill_amount}</Text>}
                    </Col>
                </Row>
                <Row style={styles.row}>
                    <Col>
                        <Row>
                            <Text style={styles.subHeader}>{billInfo.bill_date}</Text>
                        </Row>
                    </Col>
                    <Col style={styles.amountCol}>
                            <Text style={[styles.amountText, styles.subHeader]}>{billInfo.bill_status == 2 ? 'Settled' : 'Unsettled'}</Text>
                    </Col>
                </Row>
            </Grid>
            </TouchableOpacity>
        );
    }else{
        return (
            <Grid style={styles.item}>
                <Row style={styles.row}>
                    <Col size={70}>
                        <Text style={styles.title}>{supplier.name}</Text>
                    </Col>
                    <Col size={30} style={styles.amountCol}>
                        {supplier.credit ?
                            <Text style={styles.amountText}>{supplier.credit}</Text> :
                            <Text style={[styles.amountText, styles.dangerText]}>{showNegative == false ? null : `-`}{supplier.outstanding}</Text>}
                    </Col>
                </Row>
                <Row style={styles.row}>
                    <Col>
                        <Row>
                            <Icon type="MaterialIcons" name='location-on' style={[styles.subHeaderIcon, secondLineIcon == false ? styles.displayNone : null]} />
                            <Text style={styles.subHeader}>{supplier.location}</Text>
                        </Row>
                    </Col>
                    <Col style={styles.amountCol}>
                        {supplier.credit ?
                            <Text style={[styles.amountText, styles.subHeader]}>{creditText ? creditText : creditText == false ? '' : 'Advance'}</Text> :
                            <Text style={[styles.amountText, styles.subHeader]}> {debitText ? debitText : creditText == false ? '' : 'Outstanding'}</Text>}
                    </Col>
                </Row>
                <Row style={[styles.row, thirdLine == false ? styles.displayNone: null]} >
                    <Button small rounded style={styles.listButton}>
                        <Icon type="MaterialIcons" name='phone' style={styles.iconText} />
                    </Button>
                    <Button small rounded dark style={styles.listButton}>
                        <Icon type="MaterialIcons" name='message' style={styles.iconText} />
                    </Button>
                </Row>
            </Grid>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#DFDFDF',
    },
    row: {
        marginBottom: 6
    },
    amountCol: {
        alignItems: 'flex-end'
    },
    title: {
        fontSize: 18,
        fontWeight: "500",
        color: '#2e2e2e',
    },
    subHeader: {
        color: '#637381',
        fontSize: 15,
        fontWeight: '300',
    },
    subHeaderIcon: {
        color: '#637381',
        fontSize: 20,
    },
    listButton: {
        padding: 6,
        margin: 0,
        height: 32,
        width: 32,
        marginRight: 10
    },
    iconText: {
        fontSize: 20,
        marginLeft: 0,
        marginRight: 0,
    },
    amountText: {
        fontSize: 18,
        fontWeight: "500",
        color: '#2e2e2e'
    },
    dangerText: {
        color: '#FE3852'
    },
    displayNone: {
        display: 'none'
    }
});

export default EAListItem;