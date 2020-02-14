import React from 'react';
import {
    StyleSheet,
    Dimensions
} from 'react-native';
import {
    Grid,
    Row,
    Card,
    CardItem,
    Body,
    Text,
    H1,
} from 'native-base';

const SCREEN_MIN_WIDTH = Math.round((Dimensions.get('window').width - 60) / 3);

const EABricks = ({brick1, brick2, brick3}) => {
    console.log(brick1);
    return (
        <Grid stle={styles.container}>
            <Row style={styles.cardContainer}>
                <Card transparent style={styles.cardStyle}>
                    <CardItem style={styles.cardItemStyle}>
                        <Body style={styles.cardTextBody}>
                            <H1 style={[styles.textHeader, styles.textDanger, {color: brick1.color}]}>{brick1.text1}</H1>
                            <Text style={styles.textLabel}>{brick1.text2}</Text>
                        </Body>
                    </CardItem>
                </Card>
                <Card transparent style={styles.cardStyle}>
                    <CardItem style={styles.cardItemStyle}>
                        <Body style={styles.cardTextBody}>
                            <H1 style={[styles.textHeader, styles.textSuccess, {color: brick2.color}]}>{brick2.text1}</H1>
                            <Text style={styles.textLabel}>{brick2.text2}</Text>
                        </Body>
                    </CardItem>
                </Card>
                <Card transparent style={styles.cardStyle}>
                    <CardItem style={styles.cardItemStyle}>
                        <Body style={styles.cardTextBody}>
                            <H1 style={[styles.textHeader, styles.textWarm, {color: brick3.color}]}>{brick3.text1}</H1>
                            <Text style={styles.textLabel}>{brick3.text2}</Text>
                        </Body>
                    </CardItem>
                </Card>
            </Row>
        </Grid>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        fontFamily: 'Roboto',
    },
    cardContainer: {
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        height: 80
    },
    cardStyle: {
        flexGrow: 0,
        minWidth: SCREEN_MIN_WIDTH,
        justifyContent: 'center',
        marginTop: 0,
        height: 80,
    },
    cardItemStyle: {
        backgroundColor: '#F7F7F7', 
        flex:1,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0, 
    },
    cardTextBody: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    textLabel: {
        fontFamily: 'Roboto',
        fontSize: 14,
        textTransform: 'capitalize',
    },
    textHeader: {
        fontSize: 18,
        fontWeight: '500',
        color: '#2e2e2e',
        marginBottom: 0,
        marginTop: 0,
        paddingBottom: 0,
        paddingTop: 0,
    },
    textSuccess: {
        color: '#6DD400'
    },
    textDanger: {
        color: '#FE3852'
    },
    textWarm: {
        color: '#F7B500'
    }
});

export default EABricks;