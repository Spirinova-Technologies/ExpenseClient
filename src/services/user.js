"use strict";

import { BaseService } from "./base";
import WebUrlUtility from "./WebUrlUtility";
/**
 * @description This will handle the user related network requests.
 */
class UserService extends BaseService {
  constructor() {
    super();
    this.prefix = "users";
  }

  /**
   * @description This function will call the login api with email and password.
   */
  login = user => {
    return this.webServiceCall(`${this.base}${WebUrlUtility.login}`, user, 1)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  };

  /**
   * @description - This Service will return the user details
   */
  getProfile = userId => {
    return this.webServiceCall(
      `${this.base}${WebUrlUtility.profileDetails}/${userId}`,
      {},
      0
    )
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  };

  /**
   * @description This function will call the update user api.
   */
  updateProfile = (user, userId) => {
    return this.webServiceCall(
      `${this.base}${WebUrlUtility.updateProfile}/${userId}`,
      user,
      2
    )
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  };

  /**
   * @description - This service will create a new user and default organisation and store for the same user
   */
  signup = user => {
    return this.webServiceCall(`${this.base}${WebUrlUtility.register}`, user, 1)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  };

  /**
   * @description This function will call the forgot password api with email .
   */
  forgotPassword = user => {
    return this.webServiceCall(
      `${this.base}${WebUrlUtility.forgotPassword}`,
      user,
      1
    )
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  };

  /**
   * @description This function will call the otp verification  api with email .
   */
  otpVerification = user => {
    return this.webServiceCall(
      `${this.base}${WebUrlUtility.otpVerification}`,
      user,
      1
    )
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  };

  /**
   * @description This function will call the change password  api with email .
   */
  changePassword = user => {
    return this.webServiceCall(
      `${this.base}${WebUrlUtility.changePassword}`,
      user,
      1
    )
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  };
}

const userService = new UserService();

export default userService;
export { userService, UserService };
