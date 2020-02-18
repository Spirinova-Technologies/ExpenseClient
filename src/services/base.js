"use strict";
import { AsyncStorage } from "react-native";
import Constants from "expo-constants";
import WebUrlUtility from "./WebUrlUtility";
import axios from "axios";

class BaseService {
  constructor() {
    this.config = { ...Constants.manifest.extra };
    // this.base = this.config.server;
    this.base = WebUrlUtility.baseUrl;
    this.options = {};
  }

  /**
   * @description  TODO:
   */
  status = async response => {
    switch (response.status) {
      case 403:
        throw await response.json();
      case 401:
        throw await response.json();
      default:
        response.json().then(data => {
          return data;
        });
        break;
    }
  };

  /**
   * @description -
   */
  _authHeaders = async options => {
    axios.defaults.headers.common["Accept"] = "application/json";
    axios.defaults.headers.common["Content-Type"] = "application/json";

    let token = await AsyncStorage.getItem("userToken");
    if (token != null) {
      axios.defaults.headers.common["Authorization"] = token;
    }
  };

  /**
   * @description perform a network operation through this method, it takes identical params as fetch
   */
  webServiceCall = async (url, options, requestType) => {
    axios.defaults.headers.common["Accept"] = "application/json";
    axios.defaults.headers.common["Content-Type"] = "application/json";

    let token = await AsyncStorage.getItem("authToken");
    if (token != null) {
      axios.defaults.headers.common["Authorization"] = token;
    }



    if (requestType == 1) {
      //For Post method
      try {
        const serviceResponse = await axios
          .post(url, options)
          .then(response => {
          //  console.log("response.data : ",response.data);
            return Promise.resolve(response)
          })
          .catch(error => {
            //return Promise.reject(error)
          //  console.log("response error: ",error);
            throw "Something went wrong.Please try again.";
          });

       //   console.log("serviceResponse : ",serviceResponse.data);
          return serviceResponse

      } catch (error) {
        throw error;
      }
    } else  if (requestType == 2){
      //For multipart Upload method
    //  axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
      try {

        const serviceResponse = await axios
          .post(url, options)
          .then(response => {
          //  console.log("response.data : ",response.data);
            return Promise.resolve(response)
          })
          .catch(error => {
            //return Promise.reject(error)
        //    console.log("response error: ",error);
            throw "Something went wrong.Please try again.";
          });

          //console.log("serviceResponse : ",serviceResponse.data);
          return serviceResponse

      } catch (error) {
        throw error;
      }
    } 
    else {
      //For Get method
      try {
        const serviceResponse = await axios
          .get(url)
          .then(response => {
           // console.log(response.data);
            return Promise.resolve(response)
          })
          .catch(error => {
           // return Promise.reject(error)
            throw "Something went wrong.Please try again.";
          });

          console.log("serviceResponse : ",serviceResponse.data);
          return serviceResponse
      } catch (error) {
        throw error;
      }
    }
  };
}

const baseService = new BaseService();

export default baseService;
export { baseService, BaseService };
