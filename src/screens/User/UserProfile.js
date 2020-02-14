import React, { Component } from "react";
import { StyleSheet, Image,Platform } from "react-native";
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

import AppConstant from "../../utility/AppConstant";

class UserProfile extends Component {
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
              <Title style={FormStyle.headerColor}>Profile</Title>
            </Body>
            <Right></Right>
          </Header>
          <Content padder contentContainerStyle={styles.container}>
            <Grid style={styles.profile}>
              <Row>
                <Col size={20}></Col>
                <Col size={60}>
                  <Image
                    style={styles.profileImage}
                    source={AppConstant.ImageConstant.ic_silhouette}
                  />
                </Col>
                <Col size={20}>
                  <Button small dark transparent style={styles.listButton}>
                    <Icon
                      type="EvilIcons"
                      name="pencil"
                      style={styles.iconText}
                    />
                  </Button>
                </Col>
              </Row>
            </Grid>
            <Grid style={styles.item}>
              <Row style={styles.row}>
                <Col size={30} style={styles.leftCol}>
                  <Row>
                    <Text style={styles.leftTitle}>Name</Text>
                  </Row>
                </Col>
                <Col size={70} style={styles.rightCol}>
                  <Row>
                    <Text style={styles.rightTitle}>Rohit Verma</Text>
                  </Row>
                </Col>
              </Row>
            </Grid>
            <Grid style={styles.item}>
              <Row style={styles.row}>
                <Col size={30} style={styles.leftCol}>
                  <Row>
                    <Text style={styles.leftTitle}>Email Address</Text>
                  </Row>
                </Col>
                <Col size={70} style={styles.rightCol}>
                  <Row>
                    <Text style={styles.rightTitle}>RohitVerma@gmail.com</Text>
                  </Row>
                </Col>
              </Row>
            </Grid>
            <Grid style={styles.item}>
              <Row style={styles.row}>
                <Col size={30} style={styles.leftCol}>
                  <Row>
                    <Text style={styles.leftTitle}>Mobile No</Text>
                  </Row>
                </Col>
                <Col size={70} style={styles.rightCol}>
                  <Row>
                    <Text style={styles.rightTitle}>+91 8600272115</Text>
                  </Row>
                </Col>
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
    marginTop: 0
  },
  profile: {
    borderBottomWidth: 1,
    borderBottomColor: "#DFDFDF",
    minHeight: 200,
    alignItems: "center",
    marginTop: 10,
    paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 140 / 2,
    borderWidth:1,
    borderColor: "#DFDFDF",
    alignSelf: "center"
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "#DFDFDF"
  },
  row: {
    minHeight: 50
  },
  leftCol: {
    alignItems: "flex-start",
    marginLeft: 10
  },
  rightCol: {
    alignItems: "flex-end",
    marginRight: 10
  },
  leftTitle: {
    fontSize: 16,
    color: "#2e2e2e",
    fontWeight: "300",
    alignSelf: "center"
  },
  rightTitle: {
    fontSize: 15,
    color: "#2e2e2e",
    fontWeight: "500",
    alignSelf: "center"
  },
  listButton: {
    padding: 6,
    margin: 0,
    height: 45,
    width: 45,
    marginRight: 10
  },
  iconText: {
    fontSize: 40,
    marginLeft: 0,
    marginRight: 0,
  }
});

export default UserProfile;
