import React, { Component } from "react";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { Button, Icon, Text, Grid, Row, Col, View } from "native-base";

import AppConstant from "../utility/AppConstant";

class EASingleListItem extends Component {
  render() {
    const {
      data,
      name,
      location,
      pressHandler,
      selectHandler,
      selectedId
    } = this.props;
    return (
      <TouchableOpacity onPress={() => pressHandler(data)} activeOpacity={1}>
        <Grid style={styles.item}>
          <Row style={styles.row}>
            <Col size={70}>
              <Text style={styles.title}>
                {name} - {location}
              </Text>
            </Col>
            <Col size={30} style={styles.amountCol}>
              <Button
                style={styles.btnImage}
                transparent
                onPress={() => selectHandler(data)}
              >
                {data.id + "" == selectedId ? (
                  <Image
                    style={styles.imageStatus}
                    source={AppConstant.ImageConstant.ic_checked}
                  />
                ) : (
                  <Image
                    source={AppConstant.ImageConstant.ic_unchecked}
                    style={styles.imageStatus}
                  />
                )}
              </Button>
            </Col>
          </Row>
        </Grid>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#DFDFDF"
  },
  row: {
    justifyContent: "center",
    alignItems: "center"
  },
  amountCol: {
    alignItems: "flex-end"
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    textTransform: 'capitalize',
    color: "#2e2e2e"
  },
  btnImage: {
    margin: 0,
    height: 50,
    width: 50,
    marginRight: 10
  },
  imageStatus: {
    margin: 0,
    height: 50,
    width: 50
  },
  iconText: {
    fontSize: 20,
    marginLeft: 0,
    marginRight: 0
  },
  dangerText: {
    color: "#FE3852"
  },
  displayNone: {
    display: "none"
  }
});

export default EASingleListItem;
