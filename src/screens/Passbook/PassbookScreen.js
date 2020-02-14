import React from "react";
import { ScrollView, StyleSheet, FlatList } from "react-native";
import {
  Container,
  Content,
  Icon,
  Grid,
  Row,
  Picker,
  StyleProvider
} from "native-base";
import getTheme from "../../../native-base-theme/components";
import commonColors from "../../../native-base-theme/variables/commonColor";
import { EAButtonGroup, EABricks, EAListItem } from "../../components";
import { FabButtonPrimary } from "../../styles";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    name: "General Expense",
    outstanding: 1000,
    credit: null,
    location: "23rd July 2019"
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    name: "ABC Supplier Payment",
    outstanding: null,
    credit: 1000,
    location: "23rd July 2019"
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    name: "Subahshguy",
    outstanding: null,
    credit: 4440,
    location: "23rd July 2019"
  },
  {
    id: "bd7acbea-c1b1-46c2-aed5-sdsdfsdfsdf",
    name: "Payment Electricity",
    outstanding: null,
    credit: 1220,
    location: "23rd July 2019"
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-sdfsdfsfsdf",
    name: "Second Item",
    outstanding: null,
    credit: 1220,
    location: "23rd July 2019"
  },
  {
    id: "58694a0f-3da1-471f-bd96-qweqweqwe",
    name: "Third Item",
    outstanding: null,
    credit: 44330,
    location: "23rd July 2019"
  },
  {
    id: "bd7acbea-c1b1-46c2-aed5-qasdd",
    name: "First Item",
    outstanding: null,
    credit: 1500,
    location: "23rd July 2019"
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-xcvxcv",
    name: "Second Item",
    outstanding: 234434,
    credit: null,
    location: "23rd July 2019"
  },
  {
    id: "58694a0f-3da1-471f-bd96-ytht",
    name: "Third Item",
    outstanding: null,
    credit: 13213,
    location: "23rd July 2019"
  },
  {
    id: "bd7acbea-c1b1-46c2-aed5-fbb",
    name: "First Item",
    outstanding: 21200,
    credit: null,
    location: "23rd July 2019"
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-123gr",
    name: "Second Item",
    outstanding: 1000,
    credit: null,
    location: "23rd July 2019"
  },
  {
    id: "58694a0f-3da1-471f-bd96-lgeoterot",
    name: "Third Item",
    outstanding: 1000,
    credit: null,
    location: "23rd July 2019"
  }
];

class PassbookScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    };
    this.btnFilterTap = this.btnFilterTap.bind(this);
  }

  static navigationOptions = {
    headerShown: false
  };

  onValueChange = value => {
    this.setState({
      selected: value
    });
  };

  btnFilterTap(tabId) {}

  render() {
    return (
      <StyleProvider style={getTheme(commonColors)}>
        <Container>
          <Content padder contentContainerStyle={styles.container}>
            <Grid>
              <Row style={styles.buttonGroupSection}>
                <EAButtonGroup />
              </Row>
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
                  selectedValue={this.state.selected}
                  onValueChange={this.onValueChange.bind(this)}
                >
                  <Picker.Item label="All Types" value={null} />
                  <Picker.Item label="Petty Cash" value="key0" />
                  <Picker.Item label="Electricity" value="key1" />
                  <Picker.Item label="Petrol" value="key2" />
                  <Picker.Item label="Salary" value="key3" />
                  <Picker.Item label="Medical" value="key4" />
                </Picker>
              </Row>
              <Row style={styles.bricksContainer}>
                <EABricks
                  brick1={{ text: "expense", color: "#FE3852" }}
                  brick2={{ text: "cash", color: "#6DD400" }}
                  brick3={{ text: "balance", color: "#2e2e2e" }}
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
                      data={DATA}
                      renderItem={({ item }) => (
                        <EAListItem
                          creditText={false}
                          debitText={false}
                          secondLineIcon={false}
                          thirdLine={false}
                          supplier={item}
                          showNegative={false}
                          type={3}
                        />
                      )}
                      keyExtractor={item => item.id}
                    />
                  </Row>
                </ScrollView>
              </Row>
            </Grid>
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
  fabButton: FabButtonPrimary
});

export default PassbookScreen;
