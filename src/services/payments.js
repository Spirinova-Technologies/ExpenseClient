"use strict";

import { BaseService } from "./base";
import WebUrlUtility from "./WebUrlUtility";
/**
 * @description This will handle the user related network requests.
 */
class PaymentService extends BaseService {
  constructor() {
    super();
  }

  /**
   * @description This function will call the add payment api.
   */
  addPayment = payment => {
    return this.webServiceCall(
      `${this.base}${WebUrlUtility.addPayment}`,
      payment,
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
   * @description This function will call the update payment api.
   */
  updatePayment = payment => {
    return this.webServiceCall(
      `${this.base}${WebUrlUtility.updatePayment}/${payment.id}`,
      payment,
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
   * @description - This service will give suppliers bill list
   */
  getCategories = userId => {
    return this.webServiceCall(
      `${this.base}${WebUrlUtility.categoryList}`,
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
   * @description - This service will get list of payment
   */
  getPaymentList = paymentFilter => {
    return this.webServiceCall(
      `${this.base}${WebUrlUtility.paymentList}`,
      paymentFilter,
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

const paymentService = new PaymentService();

export default paymentService;
export { paymentService, PaymentService };
