import React from "react";
import { StyleSheet, Modal } from "react-native";
import { DrawerActions } from "react-navigation-drawer";
import {
  Container,
  Header,
  Title,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  StyleProvider,
  View
} from "native-base";
import getTheme from "../../native-base-theme/components";
import commonColors from "../../native-base-theme/variables/commonColor";
import { ToolbarHeader } from "../styles";
import { PopoverMenu } from "../components";
import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from "react-native-popup-menu";

class MainScreen extends React.Component {
  static navigationOptions = {
    headerShown: false
  };

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      arrMenuItem: [
        { key: 0, text: "Add Bill" },
        { key: 1, text: "Add Payment" },
        { key: 2, text: "Add Money" },
        { key: 3, text: "Add Supplier" },
        { key: 4, text: "Import Suppliers" }
      ]
    };
    this.optionClickHandler = this.optionClickHandler.bind(this);
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  optionClickHandler(value) {
    switch (value.key) {
      case 0:
        console.log("key :" + value.key);
        this.props.navigation.navigate("AddBill",{formType:0});
        // code block
        break;
      case 1:
        this.props.navigation.navigate("AddPayment",{formType:0});
        // code block
        break;
      case 2:
        // this.props.navigation.navigate("AddBill",{formType:0});
        // code block
        break;
      case 3:
        this.props.navigation.navigate("AddSupplier",{formType:0});
        // code block
        break;
      case 4:
        // code block
        break;
      default:
      // code block
    }
    console.log("val :" + value.text);
    
  }

  render() {
    return (
      <StyleProvider style={getTheme(commonColors)}>
        <>
          <Header noShadow>
            <Left>
              <Button
                transparent
                onPress={() => this.props.navigation.openDrawer()}
              >
                <Icon name="menu" />
              </Button>
            </Left>
            <Body>
              <Title style={styles.headerColor}>{this.props.title}</Title>
            </Body>
            <Right>
              <PopoverMenu
                menutext="Menu"
                menustyle={styles.menuBar}
                textStyle={styles.menuText}
                menuItems={this.state.arrMenuItem}
                optionClickHandler={this.optionClickHandler}
              />
            </Right>
          </Header>
        </>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  headerColor: ToolbarHeader,
  menuBar: {
    marginRight: 0,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  menuText: {
    color: "white"
  }
});

export default MainScreen;
