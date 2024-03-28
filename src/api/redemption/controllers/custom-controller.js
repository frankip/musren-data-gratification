const { get } = require("lodash");
const { isFuture } = require("date-fns");

const SUCCESS_CODES = ["4000", "1000"];
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

const intergrationValidation = (integration) => {
  const integrationId = integration.id;
  const integrationStatus = integration.status;
  // const integrationOwnerId = integration.company.id;
  const integrationExpiry = integration.expirationDate;
  const integrationIsActive = integrationStatus === "ACTIVE";

  const integrationNotExpired = isFuture(new Date(integrationExpiry));
  const clearedIntegration = integrationIsActive && !integrationNotExpired;
  return clearedIntegration
}

module.exports = {
  async gratification(ctx, next) {
    try {
      const id = ctx.request
      const input = get(ctx.request, "body");
      const msisdn = get(input, "msisdn");
      // const bundleSize = `${get(input, "bundleSize")}MBS`;
      const transactionId = get(input, "transactionId");

      if (!ctx.request.headers['content-type']) {
        console.log(ctx.request.headers['content-type']);
        return {
          message: 'Ensure that you have added "Content-Type" headers as "application/json"'
        }
      }

      const targetAmount = process.env.TARGET_AMOUNT

      console.log('we are working');
      const amount = input.amount || 200;


      console.log('target amount', targetAmount);
      if(amount > targetAmount){
        const bundleSize = `${process.env.TARGET_AMOUNT}MBS`;

        console.log('------???????');

      const count = await strapi.db.query('api::company.company').findWithCount()

      // Identify the company the transaction belongs to
      // to update logic
      const company = await strapi.db.query("api::company.company").findOne({where: {id:1}})

      if(company){
        const validated = intergrationValidation(company);
        if(validated){
          const existingRedemption = await strapi.db.query('api::redemption.redemption').findOne({
            where: {
              transactionId: transactionId,
              company: company.id,
            }
          });
          // if there are no duplicate we proceede to send the request to safaricom
          if(!existingRedemption){

            // create the default payload to be saved to redemptions table
            const payload = {
              transactionId: transactionId,
              company: company.id,
              bundle: `MB_${input.bundleSize}`,
              msisdn: msisdn,
              status: 200,
              published: true,
            }

            const auth = await strapi.service("api::redemption.redemption").generateAccessToken()


            console.log('kkkkkkkkkkkkkkkkkkkkkkkk',auth);

            try {
              const redeemBundleRequest = {
                url: 'https://api.safaricom.co.ke/v2/consumer-resources/auth/billing/redemptionrequest',
                headers: {
                  Authorization: 'Bearer Bi9JMiHWeHazWy8seyGoc6sT6MrT',
                  'Content-Type': 'application/json',
                  'Accept-Encoding': 'application/json'
                },
                requestBody: {
                  id: '0724681326',
                  description: 'SAFPROMO10MBS',
                  pin: 'AFRONNECT',
                  password: 'Affr0nn3ct!'
                },
                data: {
                  responseRefId: '66422-36873496-1',
                  responseId: '254 *** *** ***',
                  responseDesc: 'Successfully allocated SAFPROMO10MBS resources. Balance now at 1963 units',
                  responseStatus: '1000'
                }
            }

          // update the payload with data from Safaricom response
          payload['responseRefId'] = redeemBundleRequest.data.responseRefId;
          payload['message'] = redeemBundleRequest.data.responseDesc.split('Balance', 1).join();


          const responseCode = get(
            redeemBundleRequest.data,
            "responseStatus"
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
              // await strapi.db.query('api::redemption.redemption').create({data: payload});
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
          }else{
            const errorResponse = {
              ...input,
              status: "Error",
              statusCode: 409,
              message: "Duplicate redemption transaction",
              duplicateTransaction: {
                transactionId: existingRedemption.transactionId,
                bundleSize: existingRedemption.bundle,
                status: existingRedemption.status,
                date: new Date(existingRedemption.created_at).toString()
              }
            };
            return errorResponse;
          }
        }else{
          return {
            ...input,
            status: "Error",
            statusCode: 403,
            message: "Authentication error",
          };
        }

      }
    }
    else{
      const response = {
      status: "ok",
      statusCode: 200,
      message: "ok",
    };
    return response;
    }
    } catch (err) {
      console.log('error');
      let error = ctx.badRequest("Companies controller error");
      const errorResponse = {
        status: "Error",
        statusCode: 502,
        message: "Service Unavailable",
        data: error,
      };
      return errorResponse;
    }
  },
};
