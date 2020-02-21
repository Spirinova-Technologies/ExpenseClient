import React from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Linking,
  FlatList
} from "react-native";
import {
  Container,
  Title,
  Content,
  Button,
  Icon,
  Text,
  Grid,
  Row,
  Col,
  View,
  Toast,
  Fab,
  H1,
  StyleProvider
} from "native-base";
import getTheme from "../../../native-base-theme/components";
import commonColors from "../../../native-base-theme/variables/commonColor";
import { FabButtonPrimary } from "../../styles";
import { EATextInput, EATextLabel, EAListItem } from "../../components";
import Loader from "../Shared/Loader";
import { userPreferences, utility } from "../../utility";
import SupplierService from "../../services/supplier";

class SupplierScreen extends React.Component {
  static navigationOptions = {
    headerShown: false
  };
  
  constructor(props) {
    super(props);
    this.state = {
      searchSupplier: "",
      arrSuppliers: [],
      arrFilteredSuppliers: [],
      isLoading: false
    };
    this.arrayholder = [];
    this.editSupplier = this.editSupplier.bind(this);
  }

  handleTabFocus = () => {
    this.getSupplier();
  };

  addSupplier = async () => {
    //Form type => 0:Add , 1:Edit
    this.props.navigation.navigate("AddSupplier", { formType: 0 });
  };

  editSupplier(supplierInfo) {
    this.props.navigation.navigate("AddSupplier", {
      formType: 1,
      supplier: supplierInfo
    });
  }

  linkHandler(supplierInfo,index) {
    if(index == 1){
      utility.phoneCall(supplierInfo.supplier_phone)
    }else if(index == 2){
      utility.openWhatsApp(supplierInfo.supplier_phone)
    }
  }

  onChangeText = key => text => {
    this.setState({
      [key]: text
    });
    this.SearchFilterFunction(text);
  };

  async componentDidMount() {
    this.props.navigation.addListener('didFocus', this.handleTabFocus)
  }

  async componentDidUpdate() {}

  SearchFilterFunction(text) {
    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.supplier_name.toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.setState({ arrFilteredSuppliers: newData });
  }

  getSupplier = async () => {
    try {
      let userId = await userPreferences.getPreferences(userPreferences.userId);
      let userShopId = await userPreferences.getPreferences(
        userPreferences.userShopId
      );
      this.setState({ isLoading: true });
      let supplierData = await SupplierService.getSupplierList(userId,userShopId);
      this.setState({ isLoading: false });
      if (supplierData.status == 0) {
        var msg = supplierData.msg;
        utility.showAlert(msg);
      } else {
        this.setState({
          arrSuppliers: supplierData.supplier,
          arrFilteredSuppliers: supplierData.supplier
        });
        this.arrayholder = supplierData.supplier;
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

  renderSuppliers = () => {
    if (this.state.arrFilteredSuppliers.length == 0) {
      return (
        <View style={styles.message}>
          <H1>No Suppliers Available.</H1>
        </View>
      );
    } else {
      return (
        <Row>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between"
            }}
          >
            <FlatList
              data={this.state.arrFilteredSuppliers}
              renderItem={({ item }) => (
                <EAListItem
                  supplier={item}
                  type={1}
                  pressHandler={this.editSupplier}
                  linkHandler={this.linkHandler}
                />
              )}
              keyExtractor={item => item.id + ""}
            />
          </ScrollView>
        </Row>
      );
    }
  };

  render() {
    return (
      <StyleProvider style={getTheme(commonColors)}>
        <Container>
          <Content padder contentContainerStyle={styles.container}>
            <Grid>
              <Row style={styles.rowSection}>
                <KeyboardAvoidingView style={{ flex: 1 }}>
                  <EATextInput
                    autoCapitalize="none"
                    value={this.state.searchSupplier}
                    keyboardType="default"
                    placeholder="Search"
                    onChangeText={this.onChangeText("searchSupplier")}
                  />
                </KeyboardAvoidingView>
              </Row>
              <>{this.state.isLoading ? <Loader /> : this.renderSuppliers()}</>
            </Grid>
          </Content>
          <View>
            <Fab
              direction="up"
              containerStyle={{}}
              style={styles.fabButton}
              position="bottomRight"
              onPress={this.addSupplier}
            >
              <Icon name="add" />
            </Fab>
          </View>
        </Container>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 0
  },
  rowSection: {
    alignItems: "center",
    justifyContent: "center",
    height: 65
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16
  },
  title: {
    fontSize: 32
  },
  message: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  fabButton: FabButtonPrimary
});

export default SupplierScreen;
