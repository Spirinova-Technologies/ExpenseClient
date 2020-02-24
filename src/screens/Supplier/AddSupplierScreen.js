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
import { FormStyle } from "../../styles";
import { EATextInput, EATextLabel,EATextInputRightButton } from "../../components";
import { isValid, userPreferences, utility } from "../../utility";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
// import * as Contacts from 'expo-contacts';
import Loader from "../Shared/Loader";
import SupplierService from "../../services/supplier";
import Contacts from "react-native-contacts";

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
      hasContactPermission:false,
      isLoading: false
    };
    this.browseContactTapped = this.browseContactTapped.bind(this)
  }

  static navigationOptions = {
    headerShown: false
  };

  onChangeText = key => text => {
    this.setState({
      [key]: text
    });
  };

  onBlurText = (validatorKey, errorKey, stateKey) => () => {
    this.setState({
      [errorKey]: isValid(validatorKey, this.state[stateKey])
    });
  };

  componentDidMount() {
   // this.getContactsPermissionAsync();
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

  getContactsPermissionAsync  = async () =>  {
   
    const { status, permissions } = await Permissions.askAsync(Permissions.CONTACTS);
    if (status === 'granted') {
      this.setState({ hasContactPermission: (status === "granted" ? true:false) });
    } else {
      throw new Error('Contacts permission not granted');
    }
  }

  browseContactTapped = async () =>
  {

    Contacts.getAll((err, contacts) => {
      if (err === "denied") {
        console.warn("Permission to access contacts was denied");
      } else {
        console.warn("contacts : ",contacts);
      }
    });
    
        // const { data } = await Contacts.getContactsAsync({
        //   fields: [Contacts.Fields.Emails],
        // });
        // console.log("data : ",data);
        // if (data.length > 0) {
        //   const contact = data[0];
          
        //   console.log("contact : ",contact);
        // }
    
      console.log('Right button tapped')
  }
  validate = async () => {
    let status = { valid: true, message: "" };
    let nameError = isValid("name", this.state.name);
    let phoneError = isValid("phone", this.state.phone);
    let gstError = isValid("gstinNumber", this.state.gstNumber);
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

  submitSupplierForm = async () => {
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

        let userShopId = await userPreferences.getPreferences(
          userPreferences.userShopId
        );
        var formData = {
          supplier_name: this.state.name,
          supplier_gstin_number: this.state.gstNumber,
          supplier_address: this.state.address,
          supplier_city: this.state.city,
          supplier_phone: this.state.phone,
          shop_id: userShopId,
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

  renderAddSupplier = () => {
    return (
      <>
        <Content
          padder
          contentContainerStyle={{
            flexGrow: 1
          }}
        >
          <KeyboardAvoidingView behavior="padding" enabled>
            <Grid>
              <Row style={FormStyle.InputSection}>
                <EATextLabel labelText={"Contact Number"} />
                <EATextInputRightButton
                  autoCapitalize="none"
                  value={this.state.phone}
                  keyboardType="phone-pad"
                  contextMenuHidden={true}
                  onBlur={this.onBlurText("phone", "phoneError", "phone")}
                  error={this.state.phoneError}
                  onChangeText={this.onChangeText("phone")}
                  btnPressHandler={this.browseContactTapped}
                  btnImage={'contacts'}
                  btnImageType={'MaterialIcons'}
                />
              </Row>
              <Row style={FormStyle.InputSection}>
                <EATextLabel labelText={"Supplier Name"} />
                <EATextInput
                  autoCapitalize="words"
                  value={this.state.name}
                  keyboardType="default"
                  error={this.state.nameError}
                  onBlur={this.onBlurText("name", "nameError", "name")}
                  onChangeText={this.onChangeText("name")}
                />
              </Row>
              <Row style={FormStyle.InputSection}>
                <EATextLabel labelText={"GST Number"} />
                <EATextInput
                  autoCapitalize="characters"
                  value={this.state.gstNumber}
                  keyboardType="default"
                  error={this.state.gstError}
                  onBlur={this.onBlurText(
                    "gstinNumber",
                    "gstError",
                    "gstNumber"
                  )}
                  onChangeText={this.onChangeText("gstNumber")}
                />
              </Row>
              <Row style={FormStyle.InputSection}>
                <EATextLabel labelText={"Street/City"} />
                <EATextInput
                  autoCapitalize="words"
                  value={this.state.city}
                  keyboardType="default"
                  error={this.state.cityError}
                  onBlur={this.onBlurText("required", "cityError", "city")}
                  onChangeText={this.onChangeText("city")}
                />
              </Row>
              <Row style={FormStyle.InputSection}>
                <EATextLabel labelText={"Business Address"} />
                <EATextInput
                  autoCapitalize="sentences"
                  value={this.state.address}
                  keyboardType="default"
                  error={this.state.addressError}
                  onBlur={this.onBlurText(
                    "required",
                    "addressError",
                    "address"
                  )}
                  onChangeText={this.onChangeText("address")}
                />
              </Row>
            </Grid>
          </KeyboardAvoidingView>
        </Content>
        <Footer>
          <FooterTab>
            <Button full onPress={this.submitSupplierForm}>
              <Text>
                {" "}
                {this.state.formType == 0 ? "Add Supplier" : "Update"}
              </Text>
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
              <Title style={FormStyle.headerColor}>
                {this.state.formType == 0 ? "Add Supplier" : "Edit Supplier"}
              </Title>
            </Body>
            <Right />
          </Header>
          {this.state.isLoading ? <Loader /> : this.renderAddSupplier()}
        </Container>
      </StyleProvider>
    );
  }
}

export default AddSupplierScreen;
