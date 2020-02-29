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
    const arrMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var formatedDate =  date.getDate() +
    "-" +
    arrMonth[(date.getMonth())] +
    "-" +
    date.getFullYear();
    return formatedDate;
  }
  capitalize(str){
    var capitalizeStr = str+""
    if(capitalizeStr.length >= 2){
      capitalizeStr = capitalizeStr.charAt(0).toUpperCase() + capitalizeStr.slice(1)
    }else{
      capitalizeStr = capitalizeStr.charAt(0).toUpperCase() 
    }
    console.log(capitalizeStr)
    return capitalizeStr;
    }

    removeSpecialCharacter(str){
      console.log("clearedStr : ",str)
      var clearedStr = str+"".replace(/[^0-9]/g,"")
      console.log("clearedStr : ",clearedStr)
      return clearedStr;
    }
}



const utility = new Utility();

const createFormData = (fileKey, fileObject, body,isArray) => {
  const data = new FormData();
 
  if(isArray == true){
    var fileCount = 0
    fileObject.forEach(key => {
      data.append(fileKey,{
        name: "Testname"+fileCount,
        type: 'image/jpeg',//fileObject.type,
        uri:
          Platform.OS === "android"
            ? key.uri
            : key.uri.replace("file://", "")
      });
      fileCount = fileCount + 1;
    })
   
  }else{
    data.append(fileKey, {
      name: "Testname",
      type: 'image/jpeg',//fileObject.type,
      uri:
        Platform.OS === "android"
          ? fileObject.uri
          : fileObject.uri.replace("file://", "")
    });
  }

  Object.keys(body).forEach(key => {
    data.append(key,body[key]);
  });

  return data;
};

export { utility, createFormData };
