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
   * @description This function will call the add Supplier api.
   */
  addBill = bill => {
    console.log("bill :",bill);
    console.log("Request" + `${this.base}${WebUrlUtility.addBill}`);
    return this.webServiceCall(`${this.base}${WebUrlUtility.addBill}`, bill, 1)
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
  updateBill = bill => {
    console.log("Request" + `${this.base}${WebUrlUtility.updateBill}/${bill.id}`);
    return this.webServiceCall(`${this.base}${WebUrlUtility.updateBill}/${bill.id}`, bill, 1)
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
  getBillList = billFilter => {
    console.log("Request" + `${this.base}${WebUrlUtility.billList}`);
    return this.webServiceCall(`${this.base}${WebUrlUtility.billList}`, billFilter, 1)
      .then(data => {
        console.log("data : " + data);
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
