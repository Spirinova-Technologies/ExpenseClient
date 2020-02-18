import React from "react";
import {
  View,
  AsyncStorage,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Grid,
  Row,
  Toast,
  StyleProvider
} from "native-base";
import getTheme from "../../../native-base-theme/components";
import commonColors from "../../../native-base-theme/variables/commonColor";
import { ToolbarHeader } from "../../styles";
import { EATextInput, EATextLabel } from "../../components";
import { isValid, userPreferences, utility } from "../../utility";
import Loader from "../Shared/Loader";
import SupplierService from "../../services/supplier";

class AddSupplierScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formType: 0,
      supplier: null,
      gstNumber: "",
      name: "",
      address: "",
      phone: "",
      city: "",
      nameError: "",
      gstError: "",
      phoneError: "",
      cityError: "",
      addressError: "",
      isLoading:false
    };
  }

  static navigationOptions = {
    headerShown: false
  };

  _onChangeText = key => text => {
    this.setState({
      [key]: text
    });
  };

  _onBlurText = (validatorKey, errorKey, stateKey) => () => {
    this.setState({
      [errorKey]: isValid(validatorKey, this.state[stateKey])
    });
  };

  componentDidMount() {
    const { navigation } = this.props;
    const formType = navigation.getParam("formType");

    if (formType != undefined) {
      if (formType == 1) {
        const supplier = navigation.getParam("supplier");
        this.setState({
          supplier: supplier,
          formType: formType,
          gstNumber: supplier.supplier_gstin_number,
          name: supplier.supplier_name,
          address: supplier.supplier_address,
          phone: supplier.supplier_phone,
          city: supplier.supplier_city
        });
      } else {
        this.setState({
          formType: formType
        });
      }
    }
  }

  validate = async () => {
    let status = { valid: true, message: "" };
    let nameError = isValid("name", this.state.name);
    let phoneError = isValid("phone", this.state.phone);
    let gstError = isValid("required", this.state.gstNumber);
    let addressError = isValid("required", this.state.address);
    let cityError = isValid("required", this.state.city);

    let promise = new Promise((resolve, reject) => {
      this.setState(
        {
          nameError,
          phoneError,
          gstError,
          addressError,
          cityError
        },
        () => {
          if (this.state.nameError) {
            status.valid = false;
            status.message = nameError;
          } else if (this.state.phoneError) {
            status.valid = false;
            status.message = phoneError;
          } else if (this.state.gstError) {
            status.valid = false;
            status.message = gstError;
          } else if (this.state.addressError) {
            status.valid = false;
            status.message = addressError;
          } else if (this.state.cityError) {
            status.valid = false;
            status.message = cityError;
          }
          resolve(status);
        }
      );
    });

    return promise;
  };

  _submitSupplierForm = async () => {
    try {
      let status = await this.validate();
      if (!status.valid) {
        Toast.show({
          text: `${status.message}!`,
          buttonText: "Okay",
          position: "bottom",
          type: "danger",
          duration: 5000
        });
      } else {
        this.setState({ isLoading: true });
        let userId = await userPreferences.getPreferences(
          userPreferences.userId
        );

        // let shopId = await userPreferences.getPreferences(
        //   userPreferences.shopId
        // );

        var formData = {
          supplier_name: this.state.name,
          supplier_gstin_number: this.state.gstNumber,
          supplier_address: this.state.address,
          supplier_city: this.state.city,
          supplier_phone: this.state.phone,
          //  shop_id: shopId,
          shop_id: 2,
          userId: userId
        };

        if (this.state.formType == 1) {
          formData.id = this.state.supplier.id;
        }

        let serverCallSupplier =
          this.state.formType == 0
            ? await SupplierService.addSupplier(formData)
            : await SupplierService.updateSupplier(formData);
        this.setState({ isLoading: false });
        if (serverCallSupplier.status == 0) {
          var msg = serverCallSupplier.msg;
          utility.showAlert(msg);
        } else {
          this.setState({
            name: "",
            gstNumber: "",
            address: "",
            city: "",
            phone: ""
          });
          var msg = serverCallSupplier.msg;
          Toast.show({
            text: msg,
            buttonText: "Okay",
            type: "success",
            duration: 5000
          });
          this.props.navigation.goBack();
        }
      }
    } catch (error) {
      this.setState({ isLoading: false }, () => {
        Toast.show({
          text:
            error && error.message
              ? error.message
              : error || "Not Valid Error!",
          buttonText: "Okay",
          type: "danger",
          duration: 5000
        });
      });
    }
  };

  _renderAddSupplier = () => {
    return (
      <>
        <Content padder contentContainerStyle={styles.container}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between"
            }}
          >
            <KeyboardAvoidingView>
              <Grid>
                <Row style={styles.InputSection}>
                  <EATextLabel labelText={"Contact Number"} />
                  <EATextInput
                    autoCapitalize="none"
                    value={this.state.phone}
                    keyboardType="number-pad"
                    onBlur={this._onBlurText("phone", "phoneError", "phone")}
                    error={this.state.phoneError}
                    onChangeText={this._onChangeText("phone")}
                  />
                </Row>
                <Row style={styles.InputSection}>
                  <EATextLabel labelText={"Supplier Name"} />
                  <EATextInput
                    autoCapitalize="none"
                    value={this.state.name}
                    keyboardType="default"
                    error={this.state.nameError}
                    onBlur={this._onBlurText("name", "nameError", "name")}
                    onChangeText={this._onChangeText("name")}
                  />
                </Row>
                <Row style={styles.InputSection}>
                  <EATextLabel labelText={"GST Number"} />
                  <EATextInput
                    autoCapitalize="none"
                    value={this.state.gstNumber}
                    keyboardType="default"
                    error={this.state.gstError}
                    onBlur={this._onBlurText(
                      "required",
                      "gstError",
                      "gstNumber"
                    )}
                    onChangeText={this._onChangeText("gstNumber")}
                  />
                </Row>
                <Row style={styles.InputSection}>
                  <EATextLabel labelText={"Business Address"} />
                  <EATextInput
                    autoCapitalize="none"
                    value={this.state.address}
                    multiline={true}
                    numberOfLines={3}
                    maxLength={130}
                    keyboardType="default"
                    error={this.state.addressError}
                    onBlur={this._onBlurText(
                      "required",
                      "addressError",
                      "address"
                    )}
                    onChangeText={this._onChangeText("address")}
                  />
                </Row>
                <Row style={styles.InputSection}>
                  <EATextLabel labelText={"Street/City"} />
                  <EATextInput
                    autoCapitalize="none"
                    value={this.state.city}
                    keyboardType="default"
                    error={this.state.cityError}
                    onBlur={this._onBlurText("required", "cityError", "city")}
                    onChangeText={this._onChangeText("city")}
                  />
                </Row>
              </Grid>
            </KeyboardAvoidingView>
          </ScrollView>
        </Content>
        <Footer>
          <FooterTab>
            <Button full onPress={this._submitSupplierForm}>
              <Text> {this.state.formType == 0 ? "Add Supplier" : "Update"}</Text>
            </Button>
          </FooterTab>
        </Footer>
      </>
    );
  };

  render() {
    return (
      <StyleProvider style={getTheme(commonColors)}>
        <Container>
          <Header noShadow>
            <Left>
              <Button
                transparent
                onPress={() => this.props.navigation.goBack()}
              >
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title style={styles.headerColor}>
                {this.state.formType == 0 ? "Add Supplier" : "Edit Supplier"}
              </Title>
            </Body>
            <Right />
          </Header>
          {this.state.isLoading ? <Loader /> : this._renderAddSupplier()}
        </Container>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  headerColor: ToolbarHeader,
  InputSection: {
    flexDirection: "column",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 15
  }
});

export default AddSupplierScreen;
