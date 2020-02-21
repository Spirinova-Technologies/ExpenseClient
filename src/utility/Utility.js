"use strict";
import React from "react";
import { AlertIOS, Toast, Platform, Linking, Alert } from "react-native";

class Utility {
  showAlert = async msg => {
    alert(msg);
  };

  showToast = async (text, buttonText, type) => {
    Toast.show({
      text: text,
      buttonText: buttonText,
      type: type,
      duration: 5000
    });
  };

  phoneCall(phone) {
    let phoneNumber = phone;
    if (Platform.OS !== "android") {
      phoneNumber = `telprompt://${phone}`;
    } else {
      phoneNumber = `tel://${phone}`;
    }
    console.log("phoneNumber ----> ", phoneNumber);
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert("Cannot make a call");
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.log(err));
  }

  openWhatsApp(phone){
    // Linking.openURL(
      //   'http://api.whatsapp.com/send?phone=91' + supplierInfo.supplier_phone
      // );
    let url = 'whatsapp://send?phone=91' + phone;
    Linking.openURL(url).then((data) => {
      console.log('WhatsApp Opened');
    }).catch(() => {
      Alert.alert('Make sure Whatsapp installed on your device');
    });
  }


  formatDate(date){
    var formatedDate =  date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate();
    return formatedDate;
  }
}

const utility = new Utility();

const createFormData = (fileKey, fileObject, body) => {
  const data = new FormData();

  data.append(fileKey, {
    name: fileObject.fileName,
    type: fileObject.type,
    uri:
      Platform.OS === "android"
        ? fileObject.uri
        : fileObject.uri.replace("file://", "")
  });

  Object.keys(body).forEach(key => {
    data.append(key,body[key]);
  });

  return data;
};

export { utility, createFormData };
