import React, { Component } from "react";
import { StyleSheet } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Col,
  Grid,
  Row,
  StyleProvider
} from "native-base";

import getTheme from "../../../native-base-theme/components";
import commonColors from "../../../native-base-theme/variables/commonColor";
import { ToolbarHeader, FormStyle } from "../../styles";

const shopData = {
  id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
  name: "Indira Hotel",
  checked: true,
  location: "Pune",
  phone: "+91 8600272115",
  gstNo: "22AAAAA0000A1Z5",
  address: "Menlo Park, California, United States(US),Pincode:- 422101"
};

class AboutScreen extends Component {
  static navigationOptions = {
    headerShown: false
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
              <Title style={FormStyle.headerColor}>{shopData.name}</Title>
            </Body>
            <Right></Right>
          </Header>
          <Content padder contentContainerStyle={styles.container}>
            <Grid style={styles.item}>
              <Row style={styles.row}>
                <Col size={50}>
                  <Row>
                    <Text style={styles.subTitle}>ABOUT US</Text>
                  </Row>
                </Col>
                <Col size={50}></Col>
              </Row>
              <Row style={styles.row40}>
                <Text style={styles.description}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum.
                </Text>
              </Row>
              <Row style={styles.row}>
                <Col size={100} style={styles.dangerCol}>
                  <Button
                    style={styles.listButton}
                    iconLeft
                    dark
                    transparent
                  >
                    <Icon type="MaterialIcons" name="phone" style={styles.iconText}/>
                    <Text style={styles.dangerTitle}>+91 8600272115</Text>
                  </Button>
                </Col>
                <Col size={0}></Col>
              </Row>
              <Row style={styles.row}>
                <Col size={100} style={styles.dangerCol}>
                  <Button
                    style={styles.listButton}
                    iconLeft
                    dark
                    transparent
                  >
                    <Icon type="MaterialIcons" name="mail" style={styles.iconText} />
                    <Text style={styles.dangerTitle}>emailid@google.com</Text>
                  </Button>
                </Col>
                <Col size={0}></Col>
              </Row>
            </Grid>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flexGrow: 1,
    justifyContent: "space-between",
    padding: 5,
    marginTop: 10
  },
  row: {
    marginBottom: 20
  },
  row40: {
    marginBottom: 40
  },
  dangerCol: {
    alignItems: "flex-start"
  },
  description: {
    fontSize: 15,
    color: "#2e2e2e"
  },
  subHeaderIcon: {
    fontSize: 20
  },
  subTitle: {
    color: "#637381",
    fontSize: 18,
    fontWeight: "500"
  },
  dangerTitle: {
    fontSize: 18,
    color: "#FE3852"
  },
  listButton: {
    margin: 0,
  },
  iconText: {
    height: 40,
    width: 40,
    fontSize: 40,
    marginLeft: 0,
    marginRight: 0
  }
});

export default AboutScreen;
