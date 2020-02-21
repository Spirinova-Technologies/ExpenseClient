import React from "react";
import {
  ScrollView,
  StyleSheet,
  FlatList,
  Modal,
  TouchableHighlight
} from "react-native";
import {
  Container,
  Content,
  Button,
  View,
  Grid,
  Fab,
  Row,
  Col,
  Text,
  H1,
  Picker,
  StyleProvider,
  Toast,
  Icon
} from "native-base";
import getTheme from "../../../native-base-theme/components";
import commonColors from "../../../native-base-theme/variables/commonColor";
import { EAButtonGroup, EABricks, EAListItem } from "../../components";
import { FabButtonPrimary } from "../../styles";
import { userPreferences, utility, Enums } from "../../utility";
import BillService from "../../services/bills";
import SupplierService from "../../services/supplier";
import SettleBill from "../Shared/SettleBill";
import FilterScreen from "../Shared/FilterScreen";
import Loader from "../Shared/Loader";

class BillScreen extends React.Component {
  static navigationOptions = {
    headerShown: false
  };
  
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      filterModalVisible: false,
      arrBills: [],
      arrSuppliers: [],
      fromDate: "",
      toDate: "",
      unSettle: null,
      settle: null,
      filterType: 0,
      supplierId: null,
      isLoading: false
    };
    this.editBill = this.editBill.bind(this);
    this.btnFilterTap = this.btnFilterTap.bind(this);
    this.filterCompletionHandler = this.filterCompletionHandler.bind(this);
  }

  handleTabFocus = () => {
    console.log("got worked")
    this.getSuppliers();
    this.getBills();
  };

  setFilterModalVisible(visible) {
    this.setState({ filterModalVisible: visible });
  }

  onValueChange = value => {
    this.setState(
      {
        supplierId: value
      },
      () => {
       
        this.getBills();
      }
    );
  };

  addBill = async () => {
    this.props.navigation.navigate("AddBill", { formType: 0 });
  };

  editBill(data) {
    if(data.bill_status != 2){
      this.props.navigation.navigate("AddBill", { formType: 1, billInfo: data });
    }else{
      Toast.show({
        text: "The bill is settled.You cannot edit it.",
        buttonText: "Okay",
        type: "danger",
        duration: 5000
      });
    }
    
  }

  btnFilterTap(tabId) {
    if (tabId == 2) {
      this.setFilterModalVisible(true);
      this.setState({
        fromDate: "",
        toDate: "",
        filterType: tabId,
        arrBills: [],
        unSettle: 0,
        settle: 0
      });
    } else {
      this.setState({ fromDate: "", toDate: "", filterType: tabId }, () => {
        this.getBills();
      });
    }
  }

  filterCompletionHandler(type, fromDate, toDate) {
    if (type == 1) {
      this.setState(
        {
          fromDate: fromDate,
          toDate: toDate,
          filterType: 2,
          arrBills: [],
          unSettle: 0,
          settle: 0
        },
        () => {
          this.getBills();
        }
      );
    }
    this.setFilterModalVisible(false);
  }

  async componentDidMount() {
    this.props.navigation.addListener('didFocus', this.handleTabFocus)
  }

  async componentDidUpdate() {}

  getBills = async () => {
    console.log("hitted ")
    try {
      this.setState({
        arrBills: [],
        unSettle: 0,
        settle: 0
      });
      let userId = await userPreferences.getPreferences(userPreferences.userId);
      let userShopId = await userPreferences.getPreferences(
        userPreferences.userShopId
      );
      var formData = {
        filterType: this.state.filterType,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
        supplierId: this.state.supplierId,
        shopId: userShopId,
        userId: userId
      };
      this.setState({ isLoading: true });
      let serverCallBill = await BillService.getBillList(formData);

      this.setState({ isLoading: false });
      if (serverCallBill.status == 0) {
        var msg = serverCallBill.msg;
        utility.showAlert(msg);
      } else {
        if (serverCallBill.bills != null || serverCallBill.bills != "") {
          this.setState({
            arrBills: serverCallBill.bills,
            unSettle: serverCallBill.unpaidCount,
            settle: serverCallBill.paidCount
          });
        } else {
          this.setState({
            arrBills: [],
            unSettle: 0,
            settle: 0
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
        utility.showAlert(msg);
      } else {
        if (supplierData.supplier != null) {
          this.setState({
            arrSuppliers: supplierData.supplier
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

  renderSupplierPicker = () => {
    return (
      <Row style={styles.dropdownContainer}>
        <Icon
          name="keyboard-arrow-down"
          type="MaterialIcons"
          style={styles.pickerIcon}
        />
        <Picker
          note={true}
          mode="dropdown"
          style={{ backgroundColor: "transparent", width: "100%" }}
          selectedValue={this.state.supplierId}
          onValueChange={this.onValueChange.bind(this)}
        >
          <Picker.Item label="Select Supplier" value={null} key={"null"} />
          {this.state.arrSuppliers.map((value, index) => {
            return (
              <Picker.Item
                label={value.supplier_name}
                value={value.id}
                key={value.id + ""}
              />
            );
          })}
        </Picker>
      </Row>
    );
  };

  renderFilterBill = () => {
    return (
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.filterModalVisible}
          style={styles.modal}
          onRequestClose={() => {}}
        >
          <View style={styles.modal}>
            <FilterScreen
              completionHandler={this.filterCompletionHandler}
            ></FilterScreen>
          </View>
        </Modal>
      </View>
    );
  };

 

  renderBills = () => {
    if (this.state.arrBills.length == 0) {
      return (
        <View style={styles.message}>
          <H1>No Bill Data Available.</H1>
        </View>
      );
    } else {
      return (
        <>
          <Row style={styles.bricksContainer}>
            <EABricks
              brick1={{
                text1: this.state.unSettle,
                text2: "unsettled",
                color: "#FE3852"
              }}
              brick2={{
                text1: this.state.settle,
                text2: "settled",
                color: "#6DD400"
              }}
              brick3={{
                text1: this.state.arrBills.length,
                text2: "bills count",
                color: "#F7B500"
              }}
            />
          </Row>
          <Row>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "space-between"
              }}
            >
              <Row>
                <FlatList
                  data={this.state.arrBills}
                  renderItem={({ item }) => (
                    <EAListItem
                      billInfo={item}
                      type={2}
                      pressHandler={this.editBill}
                    />
                  )}
                  keyExtractor={item => item.id + ""}
                />
              </Row>
            </ScrollView>
          </Row>
        </>
      );
    }
  };

  render() {
    return (
      <>
        <StyleProvider style={getTheme(commonColors)}>
          <Container>
            <Content padder contentContainerStyle={styles.container}>
              <Grid>
                <Row style={styles.buttonGroupSection}>
                  <EAButtonGroup pressHandler={this.btnFilterTap} />
                </Row>
                {this.state.arrSuppliers.length != 0 ? (
                  this.renderSupplierPicker()
                ) : (
                  <></>
                )}
                {this.state.isLoading ? <Loader /> : this.renderBills()}
              </Grid>
            </Content>
            <View>
              <Fab
                direction="up"
                containerStyle={{}}
                style={styles.fabButton}
                position="bottomRight"
                onPress={this.addBill}
              >
                <Icon name="add" />
              </Fab>
            </View>
          </Container>
        </StyleProvider>
        
        {this.state.filterModalVisible ? this.renderFilterBill() : <></>}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    fontFamily: "Roboto"
  },
  buttonGroupSection: {
    height: 60
  },
  dropdownContainer: {
    height: 50,
    position: "relative"
  },
  bricksContainer: {
    height: 90
  },
  pickerIcon: {
    color: "#FE3852",
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: 25
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  message: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  fabButton: FabButtonPrimary
});

export default BillScreen;
