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
  Thumbnail,
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
import {
  EATextInput,
  EATextLabel,
  EADatePicker,
  EAPicker
} from "../../components";
import { isValid, userPreferences, utility, Enums,createFormData } from "../../utility";
import Constants from "expo-constants";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import Loader from "../Shared/Loader";
import BillService from "../../services/bills";
import SupplierService from "../../services/supplier";

class AddBillScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formType: 0,
      hasCameraPermission: null,
      billInfo: null,
      arrSuppliers: [],
      date: new Date(),
      billNumber: "",
      billType: 0,
      billStatus: 0,
      supplier: 0,
      amount: "",
      description: "",
      image: null,
      billTypeError:"",
      billStatusError:"",
      dateError: "",
      billError: "",
      amountError: "",
      supplierError: "",
      description: "",
      imageError: ""
    };
  }

  static navigationOptions = {
    headerShown: false
  };

  async componentDidMount() {
    this._getSuppliers();
    this.getPermissionAsync();

    const { navigation } = this.props;
    const formType = navigation.getParam("formType");

    if (formType != undefined) {
      if (formType == 1) {
        const billInfo = navigation.getParam("billInfo");
        console.log("billInfo date :",new Date(billInfo.bill_date));
        this.setState({
          billInfo: billInfo,
          formType: formType,
          date: new Date(billInfo.bill_date),
          billNumber: billInfo.bill_number+"",
          billType: billInfo.bill_type,
          billStatus: billInfo.bill_status,
          supplier: billInfo.supplier_id,
          amount: billInfo.bill_amount+"",
          description: billInfo.bill_description,
          image: null
        });
      } else {
        this.setState({
          formType: formType
        });
      }
    }
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      this.setState({ hasCameraPermission: status === "granted" });
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      allowsEditing: false,
      quality: 1
    });

    if (!result.cancelled) {
      this.setState({ image: result });
    }
  };

  _onChangeText = key => text => {

    if(key == "supplier" && text != 0){
      this.setState({
        [key+"Error"]: ""
      });
    }else if(key == "billType" && text != 0){
      this.setState({
        [key+"Error"]: ""
      });
    }else  if(key == "billStatus" && text != 0){
      this.setState({
        [key+"Error"]: ""
      });
    }

    this.setState({
      [key]: text
    });
  };

  _onBlurText = (validatorKey, errorKey, stateKey) => () => {
    this.setState({
      [errorKey]: isValid(validatorKey, this.state[stateKey])
    });
  };

  _getSuppliers = async () => {
    try {
      let userId = await userPreferences.getPreferences(userPreferences.userId);
      this.setState({ isLoading: true });
      let supplierData = await SupplierService.getSupplierList(userId);
      this.setState({ isLoading: false });
      if (supplierData.status == 0) {
        var msg = supplierData.msg;
        utility.showAlert(msg);
      } else {
        if(supplierData.supplier != null){
          var arrSupplier = []
          for (let i = 0; i < supplierData.supplier.length; i++) {
            let dicSupplier = {
              key:supplierData.supplier[i].id,
              text:supplierData.supplier[i].supplier_name,
            };
            arrSupplier.push(dicSupplier);
         
          }
          this.setState({
            arrSuppliers: arrSupplier
          });
        }
      }
    } catch (error) {
      this.setState({ isLoading: false }, () => {
        Toast.show({
          text: "Something went wrong.Please try again",
          buttonText: "Okay",
          type: "danger",
          duration: 5000
        });
      });
    }
  };

  validate = async () => {

    let status = { valid: true, message: "" };
    let dateError = isValid("required", this.state.date);
    let amountError = isValid("required", this.state.amount);
    let billError = isValid("required", this.state.billNumber);
    let supplierError = this.state.supplier == 0 ? "Please select supplier":"" ;
    let billTypeError = this.state.billType == 0 ? "Please select bill type":"";
    let billStatusError = this.state.billStatus == 0 ? "Please select bill status":"";

    let promise = new Promise((resolve, reject) => {
      this.setState(
        {
          dateError,
          amountError,
          billError,
          supplierError,
          billTypeError,
          billStatusError
        },
        () => {
          if (this.state.dateError) {
            status.valid = false;
            status.message = dateError;
          } else if (this.state.amountError) {
            status.valid = false;
            status.message = amountError;
          } else if (this.state.billError) {
            status.valid = false;
            status.message = billError;
          } else if (this.state.supplierError) {
            status.valid = false;
            status.message = supplierError;
          } else if (this.state.billTypeError) {
            status.valid = false;
            status.message = billTypeError;
          } else if (this.state.billStatusError) {
            status.valid = false;
            status.message = billStatusError;
          }
          resolve(status);
        }
      );
    });

    return promise;
  };

  _submitBillForm = async () => {
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
     
        var billDate = new Date(this.state.date);
        var billDateFormatted = billDate.getFullYear()+'-'+(billDate.getMonth()+1)+'-'+billDate.getDate();
        var formData = {
          bill_number: this.state.billNumber,
          bill_amount: this.state.amount,
          bill_description: this.state.description,
          bill_date: billDateFormatted,
          bill_type: this.state.billType,
          bill_status:this.state.billStatus,
         // bill_image: [this.state.image],
          supplier_id:this.state.supplier ,
          userId: userId
        };

        if (this.state.formType == 1) {
          formData.id = this.state.billInfo.id;
        }

      // let multipartData = formData;
      //   if(this.state.image != null){
      //     multipartData = createFormData('bill_image',this.state.image,formData)
      //     multipartData.append("body",formData)
      //   }
    console.log("formData : ", formData);
    
        let serverCallBill =
          this.state.formType == 0
            ? await BillService.addBill(formData)
            : await BillService.updateBill(formData);
        this.setState({ isLoading: false });
        if (serverCallBill.status == 0) {
          var msg = serverCallBill.msg;
          utility.showAlert(msg);
        } else {
          this.setState({
            date: new Date(),
            billNumber: "",
            billType: 0,
            billStatus: 0,
            supplier: 0,
            amount: "",
            description: "",
            image: null,
          });
          var msg = serverCallBill.msg;
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

  _renderAddBill = () => {
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
                  <EATextLabel labelText={"Date"} />
                  <EADatePicker
                    defaultDate={new Date()}
                    minimumDate={new Date(2016, 1, 1)}
                    maximumDate={new Date()}
                    locale={"en"}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode={"default"}
                    onDateChange={this._onChangeText("date")}
                    disabled={false}
                  />
                </Row>
                <Row style={styles.InputSection}>
                  <EATextLabel labelText={"Bill Amount"} />
                  <EATextInput
                    autoCapitalize="none"
                    value={this.state.amount}
                    keyboardType="number-pad"
                    error={this.state.amountError}
                    onBlur={this._onBlurText(
                      "required",
                      "amountError",
                      "amount"
                    )}
                    onChangeText={this._onChangeText("amount")}
                  />
                </Row>
                <Row style={styles.InputSection}>
                  <EATextLabel labelText={"Bill Number"} />
                  <EATextInput
                    autoCapitalize="none"
                    value={this.state.billNumber}
                    keyboardType="default"
                    error={this.state.billError}
                    onBlur={this._onBlurText(
                      "required",
                      "billError",
                      "billNumber"
                    )}
                    onChangeText={this._onChangeText("billNumber")}
                  />
                </Row>
                <Row style={styles.InputSection}>
                  <EATextLabel labelText={"Supplier"} />
                  <EAPicker
                    note
                    mode="dropdown"
                    selectedValue={this.state.supplier}
                    option={this.state.arrSuppliers}
                   // iosIcon={<Icon name="arrow-down" />}
                    error={this.state.supplierError}
                    onValueChange={this._onChangeText("supplier")}
                  />
                </Row>
                <Row style={styles.InputSection}>
                  <EATextLabel labelText={"Bill Type"} />
                  <EAPicker
                    note
                    mode="dropdown"
                    selectedValue={this.state.billType}
                    option={Enums.billType}
                    error={this.state.billTypeError}
                  //  iosIcon={<Icon name="arrow-down" />}
                    onValueChange={this._onChangeText("billType")}
                  />
                </Row>
                <Row style={styles.InputSection}>
                  <EATextLabel labelText={"Bill Status"} />
                  <EAPicker
                    note
                    mode="dropdown"
                    selectedValue={this.state.billStatus}
                    option={Enums.billStatus}
                    error={this.state.billStatusError}
                 //   iosIcon={<Icon name="arrow-down" />}
                    onValueChange={this._onChangeText("billStatus")}
                  />
                </Row>
                <Row style={styles.InputSection}>
                  <EATextLabel labelText={"Description"} />
                  <EATextInput
                    autoCapitalize="none"
                    value={this.state.description}
                    multiline={true}
                    numberOfLines={3}
                    maxLength={130}
                    keyboardType="default"
                    //     error={this.state.descriptionError}
                    onChangeText={this._onChangeText("description")}
                  />
                </Row>
                <Row style={styles.InputSection}>
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Button onPress={this._pickImage}>
                      <Text>Pick an image from camera roll</Text>
                    </Button>
                    {this.state.image != null ? (
                      <Thumbnail
                        square
                        large
                        source={{ uri: this.state.image.uri }}
                        style={{marginTop:10}}
                      />
                    ) : null}
                  </View>
                </Row>
              </Grid>
            </KeyboardAvoidingView>
          </ScrollView>
        </Content>
        <Footer>
          <FooterTab>
            <Button full onPress={this._submitBillForm}>
              <Text>{this.state.formType == 0 ? "Add Bill" : "Update"}</Text>
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
                {this.state.formType == 0 ? "Add Bill" : "Edit Bill"}
              </Title>
            </Body>
            <Right />
          </Header>
          {this.state.isLoading ? <Loader /> : this._renderAddBill()}
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
    paddingLeft: 16,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 15
  }
});

export default AddBillScreen;
