'use strict';
import React from 'react';
import {
	AsyncStorage
} from 'react-native';
class UserPreferences {
    constructor() {
    this.authToken = 'authToken',
    this.userId = 'userId',
    this.firstName = 'firstName',
    this.lastName  = 'lastName',
    this.emailId  = 'emailId',
    this.phoneNumber  = 'phoneNumber',
    this.address  = 'address',
    this.firebaseToken  = 'firebaseToken'
    }

    setPreferences = (key,value) =>{
        let flag = AsyncStorage.setItem(key,value);
    }

    getPreferences = (key) =>{
        let value = AsyncStorage.getItem(key);
        return value
    }

    clearPreferences(){
        AsyncStorage.removeItem(this.authToken)
        AsyncStorage.removeItem(this.userId)
        AsyncStorage.removeItem(this.firstName)
        AsyncStorage.removeItem(this.lastName)
        AsyncStorage.removeItem(this.emailId)
        AsyncStorage.removeItem(this.phoneNumber)
        AsyncStorage.removeItem(this.address)
        AsyncStorage.removeItem(this.firebaseToken)
    }

    clear(){
        AsyncStorage.clear()
    }
}


const userPreferences = new UserPreferences();
export { userPreferences};