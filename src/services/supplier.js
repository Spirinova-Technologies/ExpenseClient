"use strict";

import { BaseService } from "./base";
import WebUrlUtility from "./WebUrlUtility";
/**
 * @description This will handle the user related network requests.
 */
class SupplierService extends BaseService {
  constructor() {
    super();
  }

  /**
   * @description This function will call the add Supplier api.
   */
  addSupplier = supplier => {
    return this.webServiceCall(`${this.base}${WebUrlUtility.addSupplier}`, supplier, 1)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  };

   /**
   * @description This function will call the update Supplier api.
   */
  updateSupplier = supplier => {
    return this.webServiceCall(`${this.base}${WebUrlUtility.updateSupplier}/${supplier.id}`, supplier, 1)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  };



  /**
   * @description - This service will get list of supplier
   */
  getSupplierList = (userId,shopId) => {
    return this.webServiceCall(`${this.base}${WebUrlUtility.supplierList}/${userId}/${shopId}`, {}, 0)
      .then(data => {
        return data.data;
      })
      .catch(error => {
        throw error;
      });
  };
}

const supplierService = new SupplierService();

export default supplierService;
export { supplierService, SupplierService };
