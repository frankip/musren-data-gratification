'use strict';

const fetch = require("node-fetch");

const {
  APP_PIN,
  ACCOUNT_ID,
  GRANT_TYPE,
  MERCHANT_ID,
  APP_PASSWORD,
  AUTH_BASE_URL,
  REDEEM_BASE_URL,
  MERCHANT_PASSWORD,
  BALANCE_REDEEM_BASE_URL
} = require("./consts");

/**
 * redemption service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::redemption.redemption', ({strapi}) =>({


    async redeemBundle(accessToken, phoneNumber, bundleSize) {
      const url = `${REDEEM_BASE_URL}`;
      console.log("url>>>>", accessToken, phoneNumber, bundleSize);


      let headers = {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
        "Accept-Encoding": "application/json",
      };

      const requestBody = {
        // either 254701234567 or 701234567 or 0701234567
        id: phoneNumber,
        description: `SAFPROMO${bundleSize}`,
        pin: APP_PIN,
        password: APP_PASSWORD,
      };

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            ...headers,
          },
          body: JSON.stringify(requestBody),
        });

        const data = await res.json();

        if (data.err) {
          console.log({
            name: "hereee",
            error: data.err,
            data
          });
        }
        console.log({
          requestBody,
          data,
        });

        const response = {
          success: true,
          data,
        };
        return response;
      } catch (err) {
        strapi.log.debug("queryBalance", err);
        console.log({requestBody, err});
        throw err
      }
    },

    /**
     * Fetch for bundle balance
     * args
     *    "accessToken": string
     *    "bundleSize": string
     * returns
          "responseRefId": string,
          "responseId": string,
          "responseDesc": "string,
          "responseStatus": string
     */
    async queryBalance(accessToken, bundleSize) {
      const url = `${BALANCE_REDEEM_BASE_URL}/query/balance`;

      let headers = {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
        "Accept-Encoding": "application/json",
      };

      const requestBody = {
        id: ACCOUNT_ID,
        description: `SAFPROMO${bundleSize}`,
        pin: APP_PIN,
        password: APP_PASSWORD,
      };

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            ...headers,
          },
          body: JSON.stringify(requestBody),
        });

        const data = await res.json();
        console.log({
          url,
          headers,
          requestBody,
          data,
        });

        const response = {
          success: true,
          data,
        };
        return response;
      } catch (err) {
        strapi.log.debug("queryBalance", err);
        console.log({
          url,
          headers,
          requestBody,
          err,
        });
        const response = {
          success: false,
          error: err,
        };
        return response;
      }
    },
    /**
     * Generate access token (valid for 1hr)
     * returns
          "access_token": string,
          "expires_in": string (seconds)
     */
    async generateAccessToken() {
      const url = `${AUTH_BASE_URL}/generate?grant_type=${GRANT_TYPE}`;
      // const url = AUTH_BASE_URL
      const username = `${MERCHANT_ID}`;
      const password = `${MERCHANT_PASSWORD}`;
      const authString = `${username}:${password}`;

      let headers = {
        Authorization:
          "Basic " + Buffer.from(authString, "binary").toString("base64"),
          // "Bearer cFJZcjZ6anEwaThMMXp6d1FETUxwWkIzeVBDa2hNc2M6UmYyMkJmWm9nMHFRR2xWOQ=="
      };

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            ...headers,
          },
        });
        const data = await res.json();
        const response = {
          success: true,
          data,
        };
        return response;
      } catch (err) {
        strapi.log.debug("generateAccessToken", err);
        console.log({
          err,
        });
        throw err
      }
    },




}));
