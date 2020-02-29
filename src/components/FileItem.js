import React, { Component } from "react";
import {  StyleSheet } from "react-native";
import {
  Button,
  Icon,
  View,
  Thumbnail,
  ListItem,
  Left,
  Body,
  Text,
  Right,
} from "native-base";

import { FormStyle } from "../styles";

import {
  isValid,
  userPreferences,
  utility,
  Enums,
  AppConstant
} from "../utility";

class FileItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { pressHandler, fileData, index,type } = this.props;
    console.log("fileitem : ", fileData.filename);
    return (
      <>
      <View style={styles.container}>
       <Thumbnail square source={{ uri: fileData.uri }} style={styles.listImage} />
        <Text style={styles.listText}>
        {fileData.filename}
        </Text>
        <Button transparent onPress={() => pressHandler(index,type)} style={FormStyle.listButton}>
           <Icon name="ios-trash" style={FormStyle.attachIcon} />
        </Button>
      </View>
      <View style={styles.separator}></View>
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:5,
    flexDirection: "row",
    alignItems:'center',
    justifyContent: "space-between",
    backgroundColor: "#ffffff"
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#637381',
  },
  listImage: { maxHeight: 40, maxWidth: 40, padding: 5, margin: 5 },
  listButton:{
    marginRight: 5
  },
  listText: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    color: "#637381",
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Roboto"
  }
});

export default FileItem;
