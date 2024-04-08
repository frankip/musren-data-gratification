'use strict';

const fetch = require("node-fetch");
const crypto = require('crypto');


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

    async generateDigest(nonce, created, password) {

    },

    async testAccessToken(){
      const url = 'https://159.138.162.228:18312/tmf-api/party/v1/Dispatch'
      const username = process.env.AppKey;
      const password = process.env.AppSecret;
      const nonce = crypto.randomBytes(32).toString('hex');
      const created = new Date().toISOString().slice(0, -5) + 'Z';
      const digest = generateDigest(nonce, created, password);

      const aust = {
        "nonce": nonce,
        "digest": digest,
        "created": created
      }

      console.log('---', aust);

      let headers = {
        "Authorization": `WSSE realm="DOP",profile="UsernameToken"`,
        "X-WSSE":`UsernameToken Username="${username}",PasswordDigest=${digest},Nonce=${nonce}, Created="${created}"`,
        "X-RequestHeader": `request TransId="${Date.now()/1000}"`,

      };


      const payload = {
        ProductID:"SAFPROMO10MBS",
        MSISDN:"724681326",
      };


      try {
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        const res = await fetch(url, {
          method: "POST",
          headers: {
            ...headers,
          },
          body: JSON.stringify(payload),
        });

        console.log('>>>>>response', res.ok);

        if (!res.ok) {
          throw new Error(`Request failed with >>>: ${res.status}`);
        }

        const contentType = res.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          console.warn("Response is not JSON:", text);
        }else {
          const data = await res.json();
          console.warn("Response is JSON:", data);
          // Process valid JSON data
        }


        // const data = await res.json();
        // console.log('dajdijfda----------', data);

        const response = {
          success: true,
          data: res,
        };
        return response;
      } catch (err) {
        strapi.log.debug("generateAccessTokenError", err);
        console.log({
          err,
        });
        throw err
      }

    },





}));
function generateDigest(nonce, created, password) {
  // Combine nonce, created timestamp, and password
  const data = nonce + created + password;

  // Create a SHA-256 hash object
  const hash = crypto.createHash('sha256');

  // Update the hash with the combined data
  hash.update(data);

  // Digest the hash in Base64 encoding
  const digest = hash.digest('base64');

  return digest;
}
