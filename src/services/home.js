"use strict";

import { BaseService } from "./base";
import WebUrlUtility from "./WebUrlUtility";
/**
 * @description This will handle the user related network requests.
 */
class HomeService extends BaseService {
  constructor() {
    super();
  }

  /**
   * @description - This service will get home page detail.
   */
  getHomeDetail = param => {
    return this.webServiceCall(
      `${this.base}${WebUrlUtility.homeDetail}`,
      param,
      1
    )
      .then(data => {
        return data.data;
      })
      .catch(error => {
        throw error;
      });
  };
}

const homeService = new HomeService();

export default homeService;
export { homeService, HomeService };
