import React from 'react';
import {
    View,
    AsyncStorage,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import {
    Container,
    Header,
    Title,
    Content,
    Footer,
    FooterTab,
    Button,
    Left,
    Subtitle,
    Right,
    Body,
    Icon,
    Text,
    Grid,
    Row,
    StyleProvider
} from 'native-base';
import getTheme from '../../../native-base-theme/components';
import commonColors from '../../../native-base-theme/variables/commonColor';
import { ToolbarHeader,FormStyle } from '../../styles';
import { EATextInput, EATextLabel ,EADatePicker} from '../../components';
import { isValid } from '../../utility';


class AddSupplierPaymentScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            supplier: '',
            paymentAmount: '',
            description: '',
            date: '',
            mode: '',
            paymentAmountError: '',
            supplierError: '',
            dateError: '',
            modeError: '',
            descriptionError: '',
        };
    }

    static navigationOptions = {
        headerShown: false,
    };

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

    _submitSupplierPaymentForm = () => {
        let paymentAmountError = isValid('required', this.state.paymentAmount);
        let dateError = isValid('required', this.state.date);
        let supplierError = isValid('required', this.state.supplier);
        let descriptionError = isValid('required', this.state.description);
        let modeError = isValid('required', this.state.mode);

        this.setState({
            paymentAmountError,
            dateError,
            supplierError,
            descriptionError,
            modeError
        });

        if (!paymentAmountError && !dateError && !supplierError && !descriptionError && !modeError) {
            alert('Details are valid!');
        }
    };

    render() {
        return (
            <StyleProvider style={getTheme(commonColors)}>
                <Container>
                    <Header noShadow>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name='arrow-back' />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={FormStyle.headerColor}>Payment</Title>
                        </Body>
                        <Right />
                    </Header>
                    <Content padder contentContainerStyle={FormStyle.container}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
                            <KeyboardAvoidingView>
                                <Grid>
                                    <Row style={FormStyle.InputSection}>
                                        <EATextLabel labelText={'Date'} />
                                        <EADatePicker
                                            defaultDate={new Date(2018, 4, 4)}
                                            minimumDate={new Date(2016, 1, 1)}
                                            maximumDate={new Date(2020, 12, 31)}
                                            locale={"en"}
                                            timeZoneOffsetInMinutes={undefined}
                                            modalTransparent={false}
                                            animationType={"fade"}
                                            androidMode={"default"}
                                            onDateChange={this._onChangeText('date')}
                                            disabled={false}
                                        />
                                        {/* <EATextInput
                                            autoCapitalize="none"
                                            value={this.state.date}
                                            keyboardType="number-pad"
                                            onBlur={this._onBlurText('required', 'dateError', 'date')}
                                            error={this.state.dateError}
                                            onChangeText={this._onChangeText('date')} /> */}
                                    </Row>
                                    <Row style={FormStyle.InputSection}>
                                        <EATextLabel labelText={'Payment Amount'} />
                                        <EATextInput
                                            autoCapitalize="none"
                                            value={this.state.paymentAmount}
                                            keyboardType="number-pad"
                                            error={this.state.paymentAmountError}
                                            onBlur={this._onBlurText('required', 'paymentAmountError', 'paymentAmount')}
                                            onChangeText={this._onChangeText('paymentAmount')} />
                                    </Row>
                                    <Row style={FormStyle.InputSection}>
                                        <EATextLabel labelText={'Supplier'} />
                                        <EATextInput
                                            autoCapitalize="none"
                                            value={this.state.supplierNumber}
                                            keyboardType="default"
                                            error={this.state.supplierError}
                                            onBlur={this._onBlurText('required', 'supplierError', 'supplier')}
                                            onChangeText={this._onChangeText('supplier')} />
                                    </Row>
                                    <Row style={FormStyle.InputSection}>
                                        <EATextLabel labelText={'Mode'} />
                                        <EATextInput
                                            autoCapitalize="none"
                                            value={this.state.mode}
                                            keyboardType="default"
                                            error={this.state.modeError}
                                            onBlur={this._onBlurText('required', 'modeError', 'mode')}
                                            onChangeText={this._onChangeText('mode')} />
                                    </Row>
                                    <Row style={FormStyle.InputSection}>
                                        <EATextLabel labelText={'Description'} />
                                        <EATextInput
                                            autoCapitalize="none"
                                            value={this.state.description}
                                            multiline={true}
                                            numberOfLines={3}
                                            maxLength={130}
                                            keyboardType="default"
                                            error={this.state.descriptionError}
                                            onBlur={this._onBlurText('required', 'descriptionError', 'description')}
                                            onChangeText={this._onChangeText('description')} />
                                    </Row>
                                </Grid>
                            </KeyboardAvoidingView>
                        </ScrollView>
                    </Content>
                    <Footer>
                        <FooterTab>
                            <Button full onPress={this._submitSupplierPaymentForm}>
                                <Text>Add Supplier Payment</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </Container>
            </StyleProvider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    headerColor: ToolbarHeader,
    InputSection: {
        flexDirection: 'column',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15
    }
});

export default AddSupplierPaymentScreen;