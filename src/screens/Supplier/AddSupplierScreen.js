import React from "react";
import {
  View,
  AsyncStorage,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
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
import Loader from "../Shared/Loader";
import ContactsScreen from "../Shared/ContactsScreen";
import SupplierService from "../../services/supplier";
import SupplierScreen from "./SupplierScreen";


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
      isLoading: false,
      isContact:false
    };

    this.gstNumber = React.createRef();
    this.name = React.createRef();
    this.address = React.createRef();
    this.phone = React.createRef();
    this.city = React.createRef();
    this.browseContactTapped = this.browseContactTapped.bind(this)
    this.contactCompletionHandler = this.contactCompletionHandler.bind(this);
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

    if(stateKey == "gstNumber" && this.state[stateKey] == ""){
      this.setState({
        [errorKey]: ""
      });
      return
    }

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
     console.log("granted")
    } else {
      throw new Error('Contacts permission not granted');
    }
  }

  browseContactTapped = async () =>
  {
    const permission = await Permissions.askAsync(Permissions.CONTACTS);
    if (permission.status !== 'granted') {
      return;
    }
    this.setState({ isContact:true})    
  }

  async contactCompletionHandler(completionFlag,contact){
    console.log("completionFlag : ",completionFlag )
    if(completionFlag == 1){
      var fullName = ""
      var supplierPhone = ""
      console.log("Contacts : ",contact )
      if(contact != null && contact != undefined ){
        if(contact.name != "" ){
          fullName = contact.name
        }

        if(contact.phoneNumbers != null && contact != undefined && contact.phoneNumbers.length >= 1){
          if(Platform.OS === 'ios'){
            supplierPhone = contact.phoneNumbers[0].digits.replace(/[^0-9]/g,"")
          }else{
            supplierPhone = contact.phoneNumbers[0].number.replace(/[^0-9]/g,"")
          }
         
        }
      }
      this.setState({ isContact:false,phone:supplierPhone,name:fullName})
    }else{
      this.setState({ isContact:false})
    }
  }

  validate = async () => {
    let status = { valid: true, message: "" };
    let nameError = isValid("alphanumericSpace", this.state.name);
    let phoneError = isValid("phone", this.state.phone);
    let gstError = "" 
    if(this.state.gstNumber != ""){
      gstError = isValid("gstinNumber", this.state.gstNumber);
    }
    
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

        console.log("formData : ", formData);

        let serverCallSupplier =
          this.state.formType == 0
            ? await SupplierService.addSupplier(formData)
            : await SupplierService.updateSupplier(formData);
        this.setState({ isLoading: false });
        if (serverCallSupplier.status == 0) {
          var msg = serverCallSupplier.msg;
          utility.showAlert(msg);
        } else {
          await userPreferences.setPreferences(
            userPreferences.supplierTab,"1"
          );
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
          <KeyboardAvoidingView behavior={Platform.select({ android: null, ios: 'padding' })} enabled >
            <Grid>
              <Row style={FormStyle.InputSection}>
                <EATextLabel labelText={"Contact Number*"} />
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
                  returnKeyType={'next'}
                  ref={this.phone}
                  onSubmitEditing={() => this.name.current.focusInput()} 
                />
              </Row>
              <Row style={FormStyle.InputSection}>
                <EATextLabel labelText={"Supplier Name*"} />
                <EATextInput
                  autoCapitalize="words"
                  value={this.state.name}
                  error={this.state.nameError}
                  onBlur={this.onBlurText("alphanumericSpace", "nameError", "name")}
                  onChangeText={this.onChangeText("name")}
                  returnKeyType={'next'}
                  ref={this.name}
                  onSubmitEditing={() => this.gstNumber.current.focusInput()} 
                />
              </Row>
              <Row style={FormStyle.InputSection}>
                <EATextLabel labelText={"GST Number (Optional)"} />
                <EATextInput
                  autoCapitalize="characters"
                  value={this.state.gstNumber}
                  
                  error={this.state.gstError}
                  onBlur={this.onBlurText(
                    "gstinNumber",
                    "gstError",
                    "gstNumber"
                  )}
                  onChangeText={this.onChangeText("gstNumber")}
                  returnKeyType={'next'}
                  ref={this.gstNumber}
                  onSubmitEditing={() => this.city.current.focusInput()} 
                />
              </Row>
              <Row style={FormStyle.InputSection}>
                <EATextLabel labelText={"Street/City*"} />
                <EATextInput
                  autoCapitalize="words"
                  value={this.state.city}
                  error={this.state.cityError}
                  onBlur={this.onBlurText("required", "cityError", "city")}
                  onChangeText={this.onChangeText("city")}
                  returnKeyType={'next'}
                  ref={this.city}
                  onSubmitEditing={() => this.address.current.focusInput()} 
                />
              </Row>
              <Row style={FormStyle.InputSection}>
                <EATextLabel labelText={"Business Address*"} />
                <EATextInput
                  autoCapitalize="sentences"
                  value={this.state.address}
                  error={this.state.addressError}
                  onBlur={this.onBlurText(
                    "required",
                    "addressError",
                    "address"
                  )}
                  onChangeText={this.onChangeText("address")}
                  returnKeyType={'done'}
                  ref={this.address}
                  onSubmitEditing={() => this.address.current.blurInput()} 
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
        {this.state.isContact == false ? ( <Container>
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
       ):( <ContactsScreen pressHandler={this.contactCompletionHandler} />)
        }
      </StyleProvider>
    );
  }
}

export default AddSupplierScreen;
