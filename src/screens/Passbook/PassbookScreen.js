import React from "react";
import { ScrollView, StyleSheet, Modal, FlatList } from "react-native";
import {
  Container,
  Content,
  Icon,
  Grid,
  Row,
  Picker,
  View,
  H1,
  Toast,
  StyleProvider
} from "native-base";
import getTheme from "../../../native-base-theme/components";
import commonColors from "../../../native-base-theme/variables/commonColor";
import { EAButtonGroup, EABricks, EAListItem } from "../../components";
import { FabButtonPrimary } from "../../styles";

import { isValid, userPreferences, utility, Enums } from "../../utility";
import Loader from "../Shared/Loader";
import FilterScreen from "../Shared/FilterScreen";
import PaymentService from "../../services/payments";

class PassbookScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      filterModalVisible: false,
      arrPayments: [],
      fromDate: "",
      toDate: "",
      filterType: 0,
      expense: 0,
      cash: 0,
      balance: 0,
      transactionType: null,
      isLoading: false
    };
    this.btnFilterTap = this.btnFilterTap.bind(this);
    this.filterCompletionHandler = this.filterCompletionHandler.bind(this);
  }

  static navigationOptions = {
    headerShown: false
  };

  handleTabFocus = () => {
    this.getPayments();
  };

  setFilterModalVisible(visible) {
    this.setState({ filterModalVisible: visible });
  }

  onValueChange = value => {
    this.setState(
      {
        transactionType: value
      },
      () => {
        this.getPayments();
      }
    );
  };

  btnFilterTap(tabId) {
    if (tabId == 2) {
      this.setFilterModalVisible(true);
      this.setState({
        fromDate: "",
        toDate: "",
        filterType: tabId,
        arrPayments: [],
        expense: 0,
        cash: 0,
        balance: 0
      });
    } else {
      this.setState({ fromDate: "", toDate: "", filterType: tabId }, () => {
        this.getPayments();
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
          arrPayments: [],
          expense: 0,
          cash: 0,
          balance: 0
        },
        () => {
          this.getPayments();
        }
      );
    }
    this.setFilterModalVisible(false);
  }

  async componentDidMount() {
    this.props.navigation.addListener('didFocus', this.handleTabFocus)
   // this.getPayments();
  }

  async componentDidUpdate() {}

  getPayments = async () => {
    try {
      this.setState({
        arrPayments: [],
        expense: 0,
        cash: 0,
        balance: 0
      });
      let userId = await userPreferences.getPreferences(userPreferences.userId);
      let userShopId = await userPreferences.getPreferences(
        userPreferences.userShopId
      );
      var formData = {
        filterType: this.state.filterType,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
        transaction_type: this.state.transactionType,
        userId: userId,
        shopId:userShopId
      };
      this.setState({ isLoading: true });
      let serverCallPayments = await PaymentService.getPaymentList(formData);

      this.setState({ isLoading: false });
      if (serverCallPayments.status == 0) {
        var msg = serverCallPayments.msg;
        utility.showAlert(msg);
      } else {
        if (
          serverCallPayments.transaction != null ||
          serverCallPayments.transaction != ""
        ) {
          this.setState({
            arrPayments: serverCallPayments.transaction,
            expense: 0,
            cash: 0,
            balance: 0
          });
        } else {
          this.setState({
            arrPayments: [],
            expense: 0,
            cash: 0,
            balance: 0
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

  renderFilterPayment = () => {
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

  renderTransactionTypePicker = () => {
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
          selectedValue={this.state.transactionType}
          onValueChange={this.onValueChange.bind(this)}
        >
          <Picker.Item label="Select Type" value={null} key={"null"} />
          {Enums.paymentType.map((value, index) => {
            return (
              <Picker.Item
                label={value.text}
                value={value.key}
                key={value.key + ""}
              />
            );
          })}
        </Picker>
      </Row>
    );
  };

  renderPayment = () => {
    if (this.state.arrPayments.length == 0) {
      return (
        <View style={styles.message}>
          <H1>No Payments Data Available.</H1>
        </View>
      );
    } else {
      return (
        <>
          <Row style={styles.bricksContainer}>
            <EABricks
              brick1={{
                text1: this.state.expense,
                text2: "Expense",
                color: "#FE3852"
              }}
              brick2={{
                text1: this.state.cash,
                text2: "Cash",
                color: "#6DD400"
              }}
              brick3={{
                text1: this.state.balance,
                text2: "Balance",
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
                  data={this.state.arrPayments}
                  renderItem={({ item }) => (
                    <EAListItem paymentInfo={item} type={3} />
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
                {this.renderTransactionTypePicker()}
                {this.state.isLoading ? <Loader /> : this.renderPayment()}
              </Grid>
            </Content>
          </Container>
        </StyleProvider>
        {this.state.filterModalVisible ? this.renderFilterPayment() : <></>}
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
  message: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
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
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  pickerIcon: {
    color: "#FE3852",
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: 25
  },
  fabButton: FabButtonPrimary
});

export default PassbookScreen;
