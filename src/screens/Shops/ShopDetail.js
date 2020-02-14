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
import Loader from "../Shared/Loader";

class ShopDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shopInfo: null,
      isLoading: true
    };
    this.editShop = this.editShop.bind(this);
  }

  static navigationOptions = {
    headerShown: false
  };

  componentDidMount() {
    const { navigation } = this.props;
    const shopInfo = navigation.getParam("shopInfo");
    this.setState({
      shopInfo: shopInfo,
      isLoading: false
    });
  }

  editShop() {
    if(this.state.shopInfo != null){
      this.props.navigation.navigate("AddShop", {
        formType: 1,
        shopInfo: this.state.shopInfo
      });
    }else{

    }
  }

  renderShop() {
    return (
      <Content padder contentContainerStyle={styles.container}>
        <Grid style={styles.item}>
          <Row style={styles.row}>
            <Col size={50}>
              <Row>
                <Text style={styles.subHeader}>Shop Name</Text>
              </Row>
              <Row>
                <Text style={styles.title}>
                  {this.state.shopInfo.shop_name}
                </Text>
              </Row>
            </Col>
            <Col size={50} style={styles.buttonRightCol}>
              <Row>
                <Button
                  small
                  dark
                  transparent
                  style={styles.listButton}
                  onPress={()=> this.editShop()}
                >
                  <Icon
                    type="EvilIcons"
                    name="pencil"
                    style={styles.iconText}
                  />
                </Button>
              </Row>
            </Col>
          </Row>
          <Row style={styles.row}>
            <Col size={50}>
              <Row>
                <Text style={styles.subHeader}>Phone Number</Text>
              </Row>
              <Row>
                <Text style={styles.title}>{this.state.shopInfo.contact}</Text>
              </Row>
            </Col>
            <Col size={50} style={styles.subHeaderCol}>
              <Row>
                <Text style={styles.subHeader}>GST Number</Text>
              </Row>
              <Row>
                <Text style={styles.title}>
                  {this.state.shopInfo.gstin_number}
                </Text>
              </Row>
            </Col>
          </Row>
          <Row style={styles.row}>
            <Col size={100}>
              <Row>
                <Text style={styles.subHeader}>Address</Text>
              </Row>
              <Row>
                <Text style={styles.title}>{this.state.shopInfo.address}</Text>
              </Row>
            </Col>
            <Col size={0} style={styles.subHeaderCol}></Col>
          </Row>
        </Grid>
      </Content>
    );
  }

  render() {
    return (
      <StyleProvider style={getTheme(commonColors)}>
        <Container>
          <Header noShadow style={{ zIndex: 999 }}>
            <Left>
              <Button
                transparent
                onPress={() => this.props.navigation.goBack()}
              >
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title style={FormStyle.headerColor}>
              {this.state.isLoading ? "" : (this.state.shopInfo.shop_name)}
              </Title>
            </Body>
            <Right></Right>
          </Header>
          {this.state.isLoading ? <Loader /> : this.renderShop()}
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
    marginBottom: 40
  },
  subHeaderCol: {
    alignItems: "flex-start"
  },
  buttonRightCol: {
    alignItems: "flex-end",
    marginRight: 20,
    justifyContent: "center"
  },
  title: {
    fontSize: 18,
    color: "#2e2e2e"
  },
  subHeaderIcon: {
    fontSize: 20
  },
  subHeader: {
    color: "#637381",
    fontSize: 15,
    fontWeight: "300"
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
    marginRight: 0
  }
});

export default ShopDetail;
