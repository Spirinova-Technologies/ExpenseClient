import React, { Component } from "react";
import { StyleSheet, Image, Platform,AsyncStorage } from "react-native";
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
  Thumbnail,
  View,
  H1,
  Toast,
  StyleProvider
} from "native-base";

import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import getTheme from "../../../native-base-theme/components";
import commonColors from "../../../native-base-theme/variables/commonColor";
import { ToolbarHeader, FormStyle } from "../../styles";
import { isValid, userPreferences, utility,createFormData } from "../../utility";
import Loader from "../Shared/Loader";
import AppConstant from "../../utility/AppConstant";
import UserService from "../../services/user";

class UserProfile extends Component {
  static navigationOptions = {
    headerShown: false
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      hasCameraPermission: null,
      profileInfo: null,
      profileImage: null,
      profileImageObject: null
    };
  }

  async componentDidMount() {
    this.getProfile();
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      this.setState({ hasCameraPermission: status === "granted" });
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      allowsEditing: false,
      quality: 1
    });

    if (!result.cancelled) {
      console.log(" image object : ",result);
      this.setState({ profileImage: result.uri, profileImageObject: result },()=>{
        this.updateProfile()
      });
      
    }
  };

  updateProfile = async () => {
    if(this.state.profileInfo == null){
      return
    }
    try {
      this.setState({ isLoading: true });

      let userId = await userPreferences.getPreferences(userPreferences.userId);

      var formData = {
        first_name: this.state.profileInfo.first_name,
        last_name: this.state.profileInfo.last_name,
        phone_number: this.state.profileInfo.phone_number,
        address: this.state.profileInfo.address == undefined ? "":this.state.profileInfo.address,
        business_name:this.state.profileInfo.business_name,
        id: userId
      };

      let multipartData = formData;
        if(this.state.profileImageObject != null){
          multipartData = await createFormData('profile_photo',this.state.profileImageObject,formData,false)
        }

      let serverCallUser = await UserService.updateProfile(multipartData,formData.id);
      this.setState({ isLoading: false });
      if (serverCallUser.status == 0) {
        var msg = serverCallUser.msg;
        Toast.show({
          text: msg,
          buttonText: "Okay",
          type: "success",
          duration: 5000
        });
      } else {
     //  this.getProfile()
        var msg = serverCallUser.msg;
        Toast.show({
          text: msg,
          buttonText: "Okay",
          type: "success",
          duration: 5000
        });
      }
    } catch (error) {
      this.setState({ isLoading: false }, () => {
        Toast.show({
          text:
            error && error.message
              ? error.message
              : error || "Not Valid Error!",
          buttonText: "Okay",
          type: "danger",
          duration: 5000
        });
      });
    }
  };

  getProfile = async () => {
    try {
      let userId = await userPreferences.getPreferences(userPreferences.userId);
      this.setState({ isLoading: true });
      let userData = await UserService.getProfile(userId);
      this.setState({ isLoading: false });
      console.log("respone :", userData);
      if (userData.status == 0) {
        var msg = userData.msg;
        Toast.show({
          text: msg,
          buttonText: "Okay",
          type: "success",
          duration: 5000
        });
      } else {
        if (userData.userInfo != null) {
          this.setState({
            profileInfo: userData.userInfo,
            profileImage:
            userData.userInfo.profile_photo != null ? userData.userInfo.profile_photo : null
          });
        }
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

  renderProfileImage() {
    if (this.state.profileImage == null || this.state.profileImage == "") {
      return (
        <Thumbnail
          circle
          large
          source={AppConstant.ImageConstant.ic_silhouette}
          style={styles.profileImage}
        />
      );
    } else {
      return (
        <Thumbnail
          circle
          large
          source={{ uri: this.state.profileImage }}
          style={styles.profileImage}
        />
      );
    }
  }

  renderProfile = () => {
    if (this.state.profileInfo == null) {
      return (
        <View style={styles.message}>
          <H1>Oops something went wrong.Please try again.</H1>
        </View>
      );
    } else {
      return (
        <Content padder contentContainerStyle={styles.container}>
          <Grid style={styles.profile}>
            <Row>
              <Col size={20}></Col>
              <Col size={60}>{this.renderProfileImage()}</Col>
              <Col size={20}>
                <Button
                  small
                  dark
                  transparent
                  style={styles.listButton}
                  onPress={this.selectImage}
                >
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
                  <Text style={styles.userName}>
                    {this.state.profileInfo.first_name}{" "}
                    {this.state.profileInfo.last_name}
                  </Text>
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
                  <Text style={styles.rightTitle}>
                    {this.state.profileInfo.email_id}
                  </Text>
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
                  <Text style={styles.rightTitle}>
                    {this.state.profileInfo.phone_number}
                  </Text>
                </Row>
              </Col>
            </Row>
          </Grid>
        </Content>
      );
    }
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
          {this.state.isLoading ? <Loader /> : this.renderProfile()}
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
    paddingTop: Platform.OS === "ios" ? 20 : 0
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 140 / 2,
    borderWidth: 1,
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
  userName:{
    fontSize: 15,
    textTransform: 'capitalize',
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
    marginRight: 0
  },
  message: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default UserProfile;
