//This is an example code for the popup menu//
import React, { Component } from "react";
//import react in our code.
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
//import all the components we are going to use.
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";

import { Icon, Button } from "native-base";
//import menu and menu item

class PopoverMenu extends Component {
  constructor(props) {
    super(props);

    this.click1 = this.click1.bind(this);
  }

  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };
  showMenu = () => {
    this._menu.show();
  };
  hideMenu = () => {
    this._menu.hide();
  };
  click1 = value => {
    this._menu.hide();
    console.log("val :" + value.text);
    // this.props.option1Click();
  };
  render() {
    return (
      <View style={this.props.menustyle}>
        <Menu
          ref={this.setMenuRef}
          button={
            <Button transparent onPress={this.showMenu}>
              <Icon name="md-more" style={styles.menuIcon} />
            </Button>
          }
        >
          {this.props.menuItems.map((value, index) => {
            return (
              <MenuItem onPress={() => this.click1(value)} key={index}>
                {value.text}
              </MenuItem>
            );
          })}
        </Menu>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menuButton: {
    marginRight: 0,
    width: 40,
    height: 40,
    justifyContent: "center"
  },
  menuIcon: {
    alignSelf: "center",
    color: "#FE3852"
  }
});

export default PopoverMenu;
