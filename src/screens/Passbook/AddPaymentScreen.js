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
  Subtitle,
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
import { ToolbarHeader, FormStyle } from "../../styles";
import {
  EATextInput,
  EATextLabel,
  EADatePicker,
  EAPicker,
  FileItem
} from "../../components";
import Loader from "../Shared/Loader";
import { isValid, userPreferences, utility, Enums ,createFormData} from "../../utility";
import BillService from "../../services/bills";
import SupplierService from "../../services/supplier";
import PaymentService from "../../services/payments";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

class AddPaymentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formType: 0,
      payInfo: null,
      arrSuppliers: [],
      arrCategories: [],
      arrPaymentModes: [],
      arrBills: [],
      paymentImage: null,
      supplier: 0,
      paymentAmount: "",
      description: "",
      typeId: 0,
      category: 0,
      date: new Date(),
      mode: 0,
      paymentAmountError: "",
      supplierError: "",
      typeIdError: "",
      categoryError: "",
      dateError: "",
      modeError: "",
      descriptionError: "",
      isLoading: false
    };
    this.fileHandler = this.fileHandler.bind(this);
  }

  static navigationOptions = {
    headerShown: false
  };

  getPermissionAsyncCameraRoll = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      this.setState({ hasCameraPermission: status === "granted" });
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  fileHandler(index,type) {
    this.setState({
      paymentImage: null
    });
    console.log("index : ", index);
  }

  selectImage = async () => {
    const permission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (permission.status !== "granted") {
      Toast.show({
        text: "Sorry, we need camera roll permissions to make this work.",
        buttonText: "Okay",
        type: "success",
        duration: 5000
      });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      allowsEditing: false,
      quality: 1
    });

    if (!result.cancelled) {
      console.log(" result : ", result);

      let filename = await result.uri.substring(
        result.uri.lastIndexOf("/") + 1,
        result.uri.length
      );
      var fileDic = result;
      fileDic.filename = filename;
      this.setState({
        paymentImage: fileDic
      });
      // this.setState({ billImage: result });
    }
  };

  onChangeText = key => text => {
    if (key == "typeId" && text != 0) {
      this.setState({
        [key + "Error"]: "",
        [key]: text,
        supplier: 0,
        category: 0,
        arrBills: []
      });
    } else if (key == "supplier" && text != 0) {
      this.setState(
        {
          [key + "Error"]: "",
          [key]: text,
          arrBills: []
        },
        () => {
          this.getSupplierBills();
        }
      );
    } else if (key == "category" && text != 0) {
      this.setState({
        [key + "Error"]: "",
        [key]: text
      });
    } else if (key == "mode" && text != 0) {
      this.setState({
        [key + "Error"]: "",
        [key]: text
      });
    } else {
      this.setState({
        [key]: text
      });
    }
  };

  onBlurText = (validatorKey, errorKey, stateKey) => () => {
    this.setState({
      [errorKey]: isValid(validatorKey, this.state[stateKey])
    });
  };

  async componentDidMount() {
    this.getSuppliers();
    this.getCategories();
    this.getPermissionAsyncCameraRoll();
  }

  getSuppliers = async () => {
    try {
      let userShopId = await userPreferences.getPreferences(
        userPreferences.userShopId
      );
      let userId = await userPreferences.getPreferences(userPreferences.userId);
      this.setState({ isLoading: true });
      let supplierData = await SupplierService.getSupplierList(
        userId,
        userShopId
      );
      this.setState({ isLoading: false });
      if (supplierData.status == 0) {
        var msg = supplierData.msg;
        Toast.show({
          text: msg,
          buttonText: "Okay",
          type: "danger",
          duration: 5000
        });
      } else {
        if (supplierData.supplier != null) {
          var arrSupplier = [];
          for (let i = 0; i < supplierData.supplier.length; i++) {
            let dicSupplier = {
              key: supplierData.supplier[i].id,
              text: supplierData.supplier[i].supplier_name
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

  getCategories = async () => {
    try {
      let userId = await userPreferences.getPreferences(userPreferences.userId);
      this.setState({ isLoading: true });
      let categoryData = await PaymentService.getCategories(userId);
      this.setState({ isLoading: false });
      console.log("categoryData : ", categoryData);
      if (categoryData.status == 0) {
        var msg = categoryData.msg;
        Toast.show({
          text: msg,
          buttonText: "Okay",
          type: "danger",
          duration: 5000
        });
      } else {
        if (categoryData.category != null) {
          var arrCategorie = [];
          for (let i = 0; i < categoryData.category.length; i++) {
            let dicCategorie = {
              key: categoryData.category[i].id,
              text: categoryData.category[i].category_name
            };
            arrCategorie.push(dicCategorie);
          }
          this.setState({
            arrCategories: arrCategorie
          });
        }

        if (categoryData.payment_mode != null) {
          var arrPaymentMode = [];
          for (let i = 0; i < categoryData.payment_mode.length; i++) {
            let dicPaymentMode = {
              key: categoryData.payment_mode[i].id,
              text: categoryData.payment_mode[i].payment_name
            };
            arrPaymentMode.push(dicPaymentMode);
          }
          this.setState({
            arrPaymentModes: arrPaymentMode
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

  getSupplierBills = async () => {
    if (this.state.supplier == 0) {
      return;
    }

    try {
      this.setState({ isLoading: true });
      let billsData = await BillService.getSupplierBills(this.state.supplier);
      this.setState({ isLoading: false });
      if (billsData.status == 0) {
        var msg = billsData.msg;
        Toast.show({
          text: msg,
          buttonText: "Okay",
          type: "danger",
          duration: 5000
        });
      } else {
        if (billsData.bills != null) {
          var arrBill = [];
          for (let i = 0; i < billsData.bills.length; i++) {
            let dicBill = {
              key: billsData.bills[i].id,
              text: billsData.bills[i].bill_number
            };
            arrBill.push(dicBill);
          }
          this.setState({
            arrBills: arrBill
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
    let paymentAmountError = isValid("numeric", this.state.paymentAmount);
    let typeIdError = this.state.typeId == 0 ? "Please select Type Id" : "";
    let modeError = this.state.mode == 0 ? "Please select Mode" : "";
    let categoryError = "";
    let supplierError = "";

    if (this.state.typeId == 1 || this.state.typeId == 2) {
      categoryError =
        this.state.category == 0 ? "Please select Catgory Id" : "";
    } else if (this.state.typeId == 3) {
      supplierError = this.state.supplier == 0 ? "Please select supplier" : "";
    }

    let promise = new Promise((resolve, reject) => {
      this.setState(
        {
          dateError,
          paymentAmountError,
          supplierError,
          categoryError,
          typeIdError,
          modeError
        },
        () => {
          if (this.state.dateError) {
            status.valid = false;
            status.message = dateError;
          } else if (this.state.paymentAmountError) {
            status.valid = false;
            status.message = paymentAmountError;
          } else if (this.state.supplierError) {
            status.valid = false;
            status.message = supplierError;
          } else if (this.state.categoryError) {
            status.valid = false;
            status.message = categoryError;
          } else if (this.state.typeIdError) {
            status.valid = false;
            status.message = typeIdError;
          } else if (this.state.modeError) {
            status.valid = false;
            status.message = modeError;
          }
          resolve(status);
        }
      );
    });

    return promise;
  };

  submitPaymentForm = async () => {
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
        var paymentDate = new Date(this.state.date);
        var paymentDateFormatted =
          paymentDate.getFullYear() +
          "-" +
          (paymentDate.getMonth() + 1) +
          "-" +
          paymentDate.getDate();

        var formData = {
          category_id: this.state.category,
          transaction_amount: parseInt(this.state.paymentAmount),
          transaction_description: this.state.description,
          transaction_date: paymentDateFormatted,
          transaction_mode_id: this.state.mode,
          supplier_id: this.state.supplier,
          bill_id: null,
          bill_status: null,
          userId: userId,
          shop_id: userShopId,
          transaction_type: this.state.typeId,
          transaction_pending_amount: 0
        };

        if (this.state.formType == 1) {
          formData.id = this.state.payInfo.id;
        }

        let multipartData = formData;

        if (this.state.paymentImage != null) {
          multipartData = await createFormData(
            "transaction_image",
            this.state.paymentImage,
            formData,
            false
          );
        }
        console.log("formData : ", formData);

        let serverCallPayment =
          this.state.formType == 0
            ? await PaymentService.addPayment(multipartData)
            : await PaymentService.updatePayment(multipartData);
        this.setState({ isLoading: false });
        if (serverCallPayment.status == 0) {
          var msg = serverCallPayment.msg;
          Toast.show({
            text: msg,
            buttonText: "Okay",
            type: "danger",
            duration: 5000
          });
        } else {
          await userPreferences.setPreferences(
            userPreferences.passbookTab,
            "1"
          );
          await userPreferences.setPreferences(userPreferences.billsTab, "1");
          await userPreferences.setPreferences(
            userPreferences.supplierTab,
            "1"
          );
          await userPreferences.setPreferences(userPreferences.homeTab, "1");
          this.setState({
            category_id: 0,
            transaction_amount: "",
            transaction_description: "",
            transaction_date: new Date(),
            mode: 0,
            paymentImage: null,
            supplier_id: 0,
            transaction_type: 0,
            transaction_pending_amount: 0
          });
          var msg = serverCallPayment.msg;
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

  renderSupplierPayment() {
    return (
      <>
        <Row style={styles.InputSection}>
          <EATextLabel labelText={"Supplier Name"} />
          <EAPicker
            note
            mode="dropdown"
            selectedValue={this.state.supplier}
            option={this.state.arrSuppliers}
            error={this.state.supplierError}
            //  iosIcon={<Icon name="arrow-down" />}
            onValueChange={this.onChangeText("supplier")}
          />
        </Row>

        {/* <Row style={styles.InputSection}>
          <EATextLabel labelText={"Bill Id"} />
          <EAPicker
            note
            mode="dropdown"
            selectedValue={this.state.billId}
            option={this.state.arrBills}
            error={this.state.billIdError}
            //  iosIcon={<Icon name="arrow-down" />}
            onValueChange={this.onChangeText("billId")}
          />
        </Row> */}
      </>
    );
  }

  renderCategory = () => {
    if (this.state.typeId == 1 || this.state.typeId == 2) {
      return (
        <>
          <Row style={styles.InputSection}>
            <EATextLabel labelText={"Category Id"} />
            <EAPicker
              note
              mode="dropdown"
              selectedValue={this.state.category}
              option={this.state.arrCategories}
              error={this.state.categoryError}
              //  iosIcon={<Icon name="arrow-down" />}
              onValueChange={this.onChangeText("category")}
            />
          </Row>
        </>
      );
    } else {
      return <></>;
    }
  };

  renderAddPayment = () => {
    return (
      <>
        <Content
          padder
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between"
          }}
        >
          <KeyboardAvoidingView>
            <Grid>
              <Row style={FormStyle.InputSection}>
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
                  onDateChange={this.onChangeText("date")}
                  disabled={false}
                  formatChosenDate={date => {
                    return utility.formatDate(date);
                  }}
                />
              </Row>

              <Row style={styles.InputSection}>
                <EATextLabel labelText={"Payment Type"} />
                <EAPicker
                  note
                  mode="dropdown"
                  selectedValue={this.state.typeId}
                  option={Enums.paymentType}
                  error={this.state.typeIdError}
                  //  iosIcon={<Icon name="arrow-down" />}
                  onValueChange={this.onChangeText("typeId")}
                />
              </Row>

              {this.state.typeId == 3
                ? this.renderSupplierPayment()
                : this.renderCategory()}

              <Row style={FormStyle.InputSection}>
                <EATextLabel labelText={"Payment Amount"} />
                <EATextInput
                  autoCapitalize="none"
                  value={this.state.paymentAmount}
                  keyboardType="number-pad"
                  error={this.state.paymentAmountError}
                  onBlur={this.onBlurText(
                    "numeric",
                    "paymentAmountError",
                    "paymentAmount"
                  )}
                  onChangeText={this.onChangeText("paymentAmount")}
                />
              </Row>
              <Row style={styles.InputSection}>
                <EATextLabel labelText={"Mode"} />
                <EAPicker
                  note
                  mode="dropdown"
                  selectedValue={this.state.mode}
                  option={this.state.arrPaymentModes}
                  error={this.state.modeError}
                  //  iosIcon={<Icon name="arrow-down" />}
                  onValueChange={this.onChangeText("mode")}
                />
              </Row>
              <Row style={FormStyle.InputSection}>
                <EATextLabel labelText={"Description"} />
                <EATextInput
                  autoCapitalize="none"
                  value={this.state.description}
                  keyboardType="default"
                  error={this.state.descriptionError}
                  onBlur={this.onBlurText(
                    "required",
                    "descriptionError",
                    "description"
                  )}
                  onChangeText={this.onChangeText("description")}
                />
              </Row>
              <Row style={FormStyle.fileInputSection}>
                <Button dark transparent activeOpacity={1}>
                  <Text style={FormStyle.inputLabel}>Attachments</Text>
                </Button>
                <Button
                  onPress={this.selectImage}
                  style={FormStyle.attachButton}
                  dark
                  transparent
                >
                  <Icon name="ios-add" style={FormStyle.attachIcon} />
                </Button>
              </Row>
            </Grid>
          </KeyboardAvoidingView>
          {this.state.paymentImage != null ? (
            <View style={FormStyle.fileSection}>
              <View>
                <FileItem
                  pressHandler={this.fileHandler}
                  fileData={this.state.paymentImage}
                  index={0}
                  type={0}
                ></FileItem>
              </View>
            </View>
          ) : (
            <></>
          )}
        </Content>
        <Footer>
          <FooterTab>
            <Button full onPress={this.submitPaymentForm}>
              <Text>Add Payment</Text>
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
              <Title style={FormStyle.headerColor}>Add Payment</Title>
            </Body>
            <Right />
          </Header>
          {this.state.isLoading ? <Loader /> : this.renderAddPayment()}
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

export default AddPaymentScreen;
