import React from "react";
import { View, StyleSheet, Dimensions,ScrollView } from "react-native";
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
  Toast,
  StyleProvider
} from "native-base";
import getTheme from "../../native-base-theme/components";
import commonColors from "../../native-base-theme/variables/commonColor";
import { userPreferences, utility, Enums } from "../utility";
import HomeService from "../services/home";
import Loader from "./Shared/Loader";

const SCREEN_MIN_WIDTH = Math.round((Dimensions.get("window").width - 40) / 2);
class HomeScreen extends React.Component {
  static navigationOptions = {
    headerShown: false
  };

  constructor(props) {
    super(props);
    this.state = {
      billOutStanding: null,
      overallSpending: null,
      paymentMade: null,
      pettyCash: null,
      otherExpense: null,
      isLoading: false
    };
  }

  handleTabFocus = async () => {
    let homeTab = await userPreferences.getPreferences(
      userPreferences.homeTab
    );
    if(homeTab != null && homeTab == "1"){
      await userPreferences.setPreferences(
        userPreferences.homeTab,"0"
      );
      this.getHomeDetail();
    }
  };

  addBillHandler = async () => {
    this.props.navigation.navigate("AddBill", { formType: 0 });
  };

  addPaymentHandler = async () => {
    this.props.navigation.navigate("AddPayment", { formType: 0 });
  };

  exportSummaryReportHandler = async () => {};

  async componentDidMount() {
    this.getHomeDetail();
    this.props.navigation.addListener("didFocus", this.handleTabFocus);
  }

  getHomeDetail = async () => {
    let userShopId = await userPreferences.getPreferences(
      userPreferences.userShopId
    );

    if (userShopId == null) {
      return;
    }

    try {
      this.setState({
        billOutStanding: null,
        overallSpending: null,
        paymentMade: null,
        pettyCash: null,
        otherExpense: null
      });
      let userId = await userPreferences.getPreferences(userPreferences.userId);
    
      var formData = {
        userId: userId,
        shopId: userShopId
      };
      this.setState({ isLoading: true });
      let serverCallHome = await HomeService.getHomeDetail(formData);

      this.setState({ isLoading: false });
      if (serverCallHome.status == 0) {
        this.setState({
          billOutStanding: null,
          overallSpending: null,
          paymentMade: null,
          pettyCash: null,
          otherExpense: null
        });
        var msg = serverCallHome.msg;
        utility.showAlert(msg);
      } else {
        console.log("serverCallHome :", serverCallHome);
        this.setState({
          billOutStanding: serverCallHome.bills_outstanding,
          overallSpending: serverCallHome.overall_spending,
          paymentMade: serverCallHome.payment_mode,
          pettyCash: serverCallHome.petty_cash,
          otherExpense: serverCallHome.other_expense
        });
        console.log("getHomeDetail");
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

  renderHomeDetail = () => {
    return (
      <Grid>
        <Row style={styles.overdueContainer}>
          <Text style={styles.textLabel}>Overall Spending</Text>
          {/* <H1 style={{ fontWeight: '500'}}>150,000 Rs</H1> */}
          <Text>
            <H1 style={{ fontWeight: "500", fontSize: 30 }}>
              {this.state.overallSpending != null
                ? this.state.overallSpending
                : "0"}
            </H1>{" "}
            Rs
          </Text>
        </Row>
        <Row size={60} style={styles.cardContainer}>
          <Card style={styles.cardStyle}>
            <CardItem>
              <Body style={styles.cardTextBody}>
                <Text style={styles.textLabel}>Bills Outstanding</Text>
                <Text style={[styles.textHeaderOuter, styles.textDanger]}>
                  <H1 style={[styles.textHeader, styles.textDanger]}>
                    {this.state.billOutStanding != null
                      ? this.state.billOutStanding
                      : "0"}
                  </H1>{" "}
                  Rs
                </Text>
              </Body>
            </CardItem>
          </Card>
          <Card style={styles.cardStyle}>
            <CardItem>
              <Body style={styles.cardTextBody}>
                <Text style={styles.textLabel}>Payments Made</Text>
                <Text style={styles.textHeaderOuter}>
                  <H1 style={styles.textHeader}>
                    {this.state.paymentMade != null
                      ? this.state.paymentMade
                      : "0"}
                  </H1>{" "}
                  Rs
                </Text>
              </Body>
            </CardItem>
          </Card>
          <Card style={styles.cardStyle}>
            <CardItem>
              <Body style={styles.cardTextBody}>
                <Text style={styles.textLabel}>Petty Cash</Text>
                <Text style={styles.textHeaderOuter}>
                  <H1 style={styles.textHeader}>
                    {this.state.pettyCash != null ? this.state.pettyCash : "0"}
                  </H1>{" "}
                  Rs
                </Text>
              </Body>
            </CardItem>
          </Card>
          <Card style={styles.cardStyle}>
            <CardItem>
              <Body style={styles.cardTextBody}>
                <Text style={styles.textLabel}>Other Expenses</Text>
                <Text style={styles.textHeaderOuter}>
                  <H1 style={styles.textHeader}>
                    {this.state.otherExpense != null
                      ? this.state.otherExpense
                      : "0"}
                  </H1>{" "}
                  Rs
                </Text>
              </Body>
            </CardItem>
          </Card>
        </Row>
        <Row size={40} style={styles.redirectContainer}>
          <Button
            onPress={() => this.addBillHandler()}
            style={styles.redirectButton}
            iconLeft
            dark
            transparent
          >
            <Icon name="md-paper" />
            <Text> + Add Bills</Text>
          </Button>
          <Button
            style={styles.redirectButton}
            iconLeft
            dark
            transparent
            onPress={this.addPaymentHandler}
          >
            <Icon type="SimpleLineIcons" name="wallet" />
            <Text>+ Add payments</Text>
          </Button>
          <Button
            style={styles.redirectButton}
            iconLeft
            dark
            transparent
            onPress={this.exportSummaryReportHandler}
          >
            <Icon type="SimpleLineIcons" name="share" />
            <Text>Export Summary Report</Text>
          </Button>
        </Row>
      </Grid>
    );
  };

  render() {
    return (
      <StyleProvider style={getTheme(commonColors)}>
        <Container>
          <Content padder contentContainerStyle={styles.container}>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "space-between"
              }}
              showsHorizontalScrollIndicator={false}
            >
              {this.state.isLoading ? <Loader /> : this.renderHomeDetail()}
            </ScrollView>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    fontFamily: "Roboto",
    backgroundColor: "#F9F9F9"
  },
  cardContainer: {
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "flex-start"
  },
  overdueContainer: {
    height: 100,
    padding: 5,
    flexDirection: "column",
    justifyContent: "center"
  },
  redirectContainer: {
    padding: 10,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  cardStyle: {
    flexGrow: 0,
    minWidth: SCREEN_MIN_WIDTH,
    padding: 10,
    justifyContent: "center"
  },
  cardTextBody: {
    alignItems: "center"
  },
  textLabel: {
    fontFamily: "Roboto",
    fontSize: 15,
    fontWeight: "500",
    paddingBottom: 8
  },
  textHeaderOuter: {
    color: "#2e2e2e"
  },
  textDanger: {
    color: "#FE3852"
  },
  textHeader: {
    fontWeight: "500",
    color: "#2e2e2e"
  },
  redirectButton: {
    marginBottom: 10,
    textTransform: "capitalize"
  }
});

export default HomeScreen;
