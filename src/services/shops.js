"use strict";

import { BaseService } from "./base";
import WebUrlUtility from "./WebUrlUtility";
/**
 * @description This will handle the user related network requests.
 */
class ShopService extends BaseService {
  constructor() {
    super();
  }


/**
   * @description This function will call the add Money api.
   */
  addMoney = param => {
    return this.webServiceCall(`${this.base}${WebUrlUtility.addMoney}`, param, 1)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  };

  /**
   * @description This function will call the add Shop api.
   */
  addShop = shop => {
    return this.webServiceCall(`${this.base}${WebUrlUtility.addShop}`, shop, 1)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  };

    /**
   * @description This function will call the update Shop api.
   */
  updateShop = shop => {
    return this.webServiceCall(`${this.base}${WebUrlUtility.updateShop}/${shop.id}`, shop, 1)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  };

  /**
   * @description - This service will give shops list
   */
  getShopList = userId => {
    return this.webServiceCall(`${this.base}${WebUrlUtility.shopList}/${userId}`, {}, 0)
      .then(data => {
        return data.data;
      })
      .catch(error => {
        throw error;
      });
  };
}

const shopService = new ShopService();

export default shopService;
export { shopService, ShopService };
