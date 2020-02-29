"use strict";

import { BaseService } from "./base";
import WebUrlUtility from "./WebUrlUtility";
/**
 * @description This will handle the user related network requests.
 */
class BillService extends BaseService {
  constructor() {
    super();
  }

  /**
   * @description This function will call the add Bill api.
   */
  addBill = bill => {
    return this.webServiceCall(`${this.base}${WebUrlUtility.addBill}`, bill, 2)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  };

  /**
   * @description This function will call the update Bill api.
   */
  updateBill = bill => {
    return this.webServiceCall(
      `${this.base}${WebUrlUtility.updateBill}/${bill.id}`,
      bill,
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
   * @description - This service will give suppliers bill list
   */
  getSupplierBills = supplierId => {
    return this.webServiceCall(
      `${this.base}${WebUrlUtility.supplierBillsList}/${supplierId}`,
      {},
      0
    )
      .then(data => {
        return data.data;
      })
      .catch(error => {
        throw error;
      });
  };

  /**
   * @description - This service will get list of Bill
   */
  getBillList = billFilter => {
    return this.webServiceCall(
      `${this.base}${WebUrlUtility.billList}`,
      billFilter,
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

const billService = new BillService();

export default billService;
export { billService, BillService };
