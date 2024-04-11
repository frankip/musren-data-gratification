const { get } = require("lodash");
const { isFuture } = require("date-fns");

const SUCCESS_CODES = ["0"];
const THRESHOLD_ERROR_CODES = ["429.001"];
const SECURITY_ERROR_CODES = ["400.003"];
const SERVER_ERROR_CODES = ["500.001", "503.001", "504.001"];
const AUTH_ERROR_CODES = ["401.001", "401.002", "403.001"];
const VALIDATION_ERROR_CODES = [
  "400.001",
  "400.002",
  "404.001",
  "405.001",
  "415.001",
  "1999",
];

// const { createCoreController } = require('@strapi/strapi').factories;

const companyValidation = (company) => {
  const companyStatus = company.status;
  const companyExpiry = company.expirationDate;
  const companyIsActive = companyStatus === "ACTIVE";

  const companyNotExpired = isFuture(new Date(companyExpiry));
  const clearedcompany = companyIsActive && !companyNotExpired;
  return companyIsActive
}

module.exports = {
  async gratification(ctx, next) {
    try {
      const id = ctx.request
      const input = get(ctx.request, "body");
      const msisdn = get(input, "MSISDN");
      const transactionId = get(input, "TransID");
      const shortCode = get(input, "BusinessShortCode");

      if (!ctx.request.headers['content-type']) {
        console.log(ctx.request.headers['content-type']);
        return {
          message: 'Ensure that you have added "Content-Type" headers as "application/json"'
        }
      }

      const targetAmount = process.env.TARGET_AMOUNT
      const amount = input.TransAmount || 0;


      console.log('target amount', targetAmount);

      const checkAmount = amount < targetAmount ? (() => { ctx.badRequest("Amount is less than or equal to targetAmount"); })() : {};
      const bundleSize = `${process.env.TARGET_AMOUNT}`;

      // Identify the company the transaction belongs to
      const company = await strapi.db.query("api::business-payment-code.business-payment-code").findOne({where:
        {
          BusinessShortCode:shortCode
        },
        populate: {
          company:{
            fields:['id', 'Name', 'status']
          }
        },
      })
      const checkCompany = !company ? (() => {
        ctx.badRequest(`Sorry No company Associated with the ${input.TransactionType}`);
      })() : {};

      const validated = companyValidation(company.company);
      const checkValidation = !validated ? (() => {
        ctx.badRequest("The associated Company is Inactive");
      })() : {};

      // check if there is existing simialar redemptions
      const existingRedemption = await strapi.db.query('api::redemption.redemption').findOne({
        where: {
          transactionId: transactionId,
          company: company.id,
        }
      });

      const checkRedemption = existingRedemption ? (() => {
        ctx.badRequest("Duplicate redemption transaction", {
          duplicateTransaction: {
            transactionId: existingRedemption.transactionId,
            bundleSize: existingRedemption.bundle,
            status: existingRedemption.status,
            date: new Date(existingRedemption.created_at).toString()
          }
        });
      })() : {};

      // create the default payload to be saved to redemptions table
      const payload = {
        transactionId: transactionId,
        company: company.company.id,
        bundle: `MB_${bundleSize}`,
        msisdn: msisdn,
        status: 200,
        published: true,
      }

      try {
        // if there are no duplicate we proceede with the request
        const redeemBundleRequest = await strapi.service("api::redemption.redemption").dopGratification(msisdn);
      //   const redeemBundleRequest = {
      //     data: {
      //       "Result": "1000120200",
      //       "Description": "query subscribe relation auth faild.",
      //       "TransactionID": "1712608289"
      //   }
      // }

      // update the payload with data from Safaricom response
      payload['responseRefId'] = redeemBundleRequest.data.TransactionID;
      payload['message'] = redeemBundleRequest.data.TransactionID;


        const responseCode = get(
          redeemBundleRequest.data,
          "Result"
        );

    // check for success codes
    const isSuccessful = SUCCESS_CODES.includes(responseCode);
    if(isSuccessful){
      const newRedemption = await strapi.db.query('api::redemption.redemption').create({data: payload});
      const response = {
        ...input,
        company: company.Name,
        status: "Success",
        statusCode: 200,
        message: "Successfully gratified user",
      };
      return response;
    }else{
      payload.status = 400;
      const newRedemption = await strapi.db.query('api::redemption.redemption').create({data: payload});
      const validationErrorResponse = {
        ...input,
        status: "Error",
        statusCode: 400,
        message: "Sorry, something did not go right",
        error: {
          responseRefId: payload.responseRefId,
          responseDesc: payload.message
        }
      };
      return validationErrorResponse;
    }
  } catch (error) {
        payload.status = 500;
        payload.message = error
        const newRedemption = await strapi.db.query('api::redemption.redemption').create({data: payload});
        console.log('error');
        return {
          ...input,
          status: "Error",
          statusCode: 500,
          message: "Server Error",
        };
      }
    } catch (err) {
      const errorResponse = {
        status: "Error",
        statusCode: 502,
        message: "Service Unavailable",
        data: ctx.badRequest(err),
      };
      return errorResponse;
    }
  },
};
