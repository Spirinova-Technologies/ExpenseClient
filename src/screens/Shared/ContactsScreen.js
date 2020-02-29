import React, { Component } from "react";
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
  Grid,
  Row,
  Text,
  Toast,
  StyleProvider,
  List,
  ListItem,
  Item,
  Input
} from "native-base";
import * as Contacts from "expo-contacts";
import { StyleSheet, TouchableOpacity } from "react-native";
import Loader from "./Loader";
class ContactsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      contacts: [],
      refreshing: false
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.loadContacts();
  }

  loadContacts = async () => {
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails]
    });

    console.log(data);
    this.setState({ contacts: data, inMemoryContacts: data, loading: false });
  };

  searchContacts = value => {
    const filteredContacts = this.state.inMemoryContacts.filter(contact => {
      let contactLowercase = (
        contact.firstName +
        " " +
        contact.lastName
      ).toLowerCase();

      let searchTermLowercase = value.toLowerCase();

      return contactLowercase.indexOf(searchTermLowercase) > -1;
    });
    this.setState({ contacts: filteredContacts });
  };

  renderItem = (item, pressHandler) => (
    <ListItem
      onPress={() => this.props.pressHandler(1, item)}
      key={item.id + ""}
    >
      <Body>
        <Text>
          {" "}
          {item.firstName + " "}
          {item.lastName}
        </Text>
        <Text note> {item.phoneNumbers[0].digits}</Text>
      </Body>
      <Right>
        <Icon name="arrow-forward" />
      </Right>
    </ListItem>
  );

  render() {
    const { pressHandler } = this.props;
    return (
      <Container>
        <Header searchBar rounded>
          <Button transparent onPress={() => pressHandler(0, {})}>
            <Text>Back</Text>
          </Button>
          <Item>
            <Icon name="ios-search" />
            <Input
              placeholder="Search"
              onChangeText={value => this.searchContacts(value)}
            />
            <Icon name="ios-people" />
          </Item>
        </Header>

        {this.state.loading == true ? (
          <Loader />
        ) : (
          <Content>
            <List>
              {this.state.contacts.map((value, index) => {
                return this.renderItem(value, pressHandler);
              })}
            </List>
          </Content>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({});

export default ContactsScreen;
