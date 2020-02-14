'use strict';
import React from 'react';
import {
    AlertIOS,
    Toast,
    Platform
} from 'react-native';

class Utility {
    showAlert = async (msg) => {
        alert(msg);
    }

    showToast = async (text,buttonText,type) => {
        Toast.show({
            text: text,
            buttonText: buttonText,
            type: type,
            duration: 5000
          });
    }
}


const utility = new Utility();

const createFormData = (fileKey,fileObject, body) => {
    const data = new FormData();
  
    data.append(fileKey, {
      name: fileObject.fileName,
      type: fileObject.type,
      uri:
        Platform.OS === "android" ? fileObject.uri : fileObject.uri.replace("file://", "")
    });
  
    // Object.keys(body).forEach(key => {
    //   data.append(key, body[key]);
    // });
  
    return data;
  };

export { utility,createFormData};