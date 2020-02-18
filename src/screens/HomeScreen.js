import React from 'react';
import { 
    View, 
    StyleSheet,
    Dimensions
} from 'react-native';
import {
    Container,
    CardItem,
    Content,
    Button,
    Card,
    Icon,
    Text,
    Grid,
    Body,
    Row,
    H1,
    StyleProvider
} from 'native-base';
import getTheme from '../../native-base-theme/components';
import commonColors from '../../native-base-theme/variables/commonColor';

const SCREEN_MIN_WIDTH = Math.round((Dimensions.get('window').width - 40 ) / 2);
class HomeScreen extends React.Component {
    static navigationOptions = {
        headerShown: false,
    };

    _redirectToPath = (key) => {
        this.props.navigation.navigate(key);
    };

    addPaymentHandler = async () =>{
        this.props.navigation.navigate("AddPayment",{formType:0});
    }
    
    render() {
        return (
            <StyleProvider style={getTheme(commonColors)}>
                <Container>
                    <Content padder contentContainerStyle={styles.container}>
                        <Grid>
                            <Row style={styles.overdueContainer}>
                                <Text style={styles.textLabel}>Overall Spending</Text>
                                {/* <H1 style={{ fontWeight: '500'}}>150,000 Rs</H1> */}
                                <Text><H1 style={{ fontWeight: '500', fontSize: 30 }}>150,000</H1> Rs</Text>
                            </Row>
                            <Row size={60} style={styles.cardContainer}>
                                <Card style={styles.cardStyle}>
                                    <CardItem>
                                        <Body style={styles.cardTextBody}>
                                            <Text style={styles.textLabel}>Bills Outstanding</Text>
                                            <Text style={[styles.textHeaderOuter, styles.textDanger]}><H1 style={[styles.textHeader, styles.textDanger]}>108,900</H1> Rs</Text>
                                        </Body>
                                    </CardItem>
                                </Card>
                                <Card style={styles.cardStyle}>
                                    <CardItem>
                                        <Body style={styles.cardTextBody}>
                                            <Text style={styles.textLabel}>Payments Made</Text>
                                            <Text style={styles.textHeaderOuter}><H1 style={styles.textHeader}>10,000</H1> Rs</Text>
                                        </Body>
                                    </CardItem>
                                </Card>
                                <Card style={styles.cardStyle}>
                                    <CardItem>
                                        <Body style={styles.cardTextBody}>
                                            <Text style={styles.textLabel}>Petty Cash</Text>
                                            <Text style={styles.textHeaderOuter}><H1 style={styles.textHeader}>18,900</H1> Rs</Text>
                                        </Body>
                                    </CardItem>
                                </Card>
                                <Card style={styles.cardStyle}>
                                    <CardItem>
                                        <Body style={styles.cardTextBody}>
                                            <Text style={styles.textLabel}>Other Expenses</Text>
                                            <Text style={styles.textHeaderOuter}><H1 style={styles.textHeader}>23,900</H1> Rs</Text>
                                        </Body>
                                    </CardItem>
                                </Card>
                            </Row>
                            <Row size={40} style={styles.redirectContainer}>
                                <Button onPress={() => this._redirectToPath('AddBill')} style={styles.redirectButton} iconLeft dark transparent>
                                    <Icon name='md-paper' />
                                    <Text> + Add Bills</Text>
                                </Button>
                                <Button style={styles.redirectButton} iconLeft dark transparent onPress={this.addPaymentHandler}>
                                    <Icon type='SimpleLineIcons' name='wallet' />
                                    <Text>+ Add payments</Text>
                                </Button>
                                <Button style={styles.redirectButton} iconLeft dark transparent>
                                    <Icon type='SimpleLineIcons' name='share' />
                                    <Text>Export Summary Report</Text>
                                </Button>
                            </Row>
                        </Grid>
                        {/* <Button onPress={this._signOutAsync} style={{ marginTop: 10 }} ><Text>Log Out</Text></Button> */} 
                    </Content>
            </Container>
            </StyleProvider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        fontFamily: 'Roboto',
        backgroundColor: '#F9F9F9'
    },
    cardContainer: {  
        flexWrap: 'wrap', 
        justifyContent: 'space-evenly', 
        alignItems: 'flex-start' 
    },
    overdueContainer: {
        height: 100,
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    redirectContainer: {
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    cardStyle: {
        flexGrow: 0, 
        minWidth: SCREEN_MIN_WIDTH, 
        padding: 10,
        justifyContent: 'center', 
    },
    cardTextBody: { 
        alignItems: 'center' ,
    },
    textLabel: {
        fontFamily: 'Roboto', 
        fontSize: 15,
        fontWeight: '500',
        paddingBottom: 8,
    },
    textHeaderOuter: {
        color: '#2e2e2e'
    },
    textDanger: {
        color: '#FE3852'
    },
    textHeader: {
        fontWeight: '500',
        color: '#2e2e2e'
    },
    redirectButton: {
        marginBottom: 10,
        textTransform: 'capitalize'
    }
    
})

export default HomeScreen;