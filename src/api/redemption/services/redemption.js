'use strict';

const fetch = require("node-fetch");
const crypto = require('crypto');
const CryptoJS = require('crypto-js');


const {
  ACCOUNT_ID,
  APP_PASSWORD,
  DOP_URL
} = require("./consts");

/**
 * redemption service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::redemption.redemption', ({strapi}) =>({

    async dopGratification(msisdn){

      const [timespan, noncetime] = getDateTime();
      const [base64, nonce] = generateDigest(noncetime, timespan, APP_PASSWORD);
      console.log(nonce);

      let headers = {
        "Authorization":"WSSE realm=\"DOP\", profile=\"UsernameToken\"",
        "X-WSSE":"UsernameToken Username=\""+ACCOUNT_ID+"\", PasswordDigest=\""+base64+"\", Nonce=\""+nonce+"\", Created=\""+timespan+"\"",
        "X-RequestHeader": `request TransId="${Date.now()/1000}"`,
        "Content-Type": "application/json; charset=UTF-8",

      };
      const payload = {
          "ProductID":"SAFPROMO10MBS",
          "MSISDN":msisdn,
          "extendInfos":[{"key":"Specification", "value":"450"}]
      }

      console.log(payload);

      try {
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        const res = await fetch(DOP_URL, {
          method: "POST",
          headers: {
            ...headers,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error(`Request failed with >>>: ${res.status}`);
        }
        const data = await res.json();
        console.warn("Response is JSON:", data);
        const response = {
          success: true,
          data: data,
        };
        return response;
      } catch (err) {
        strapi.log.debug("generateAccessTokenError", err);
        console.log({
          err,
        });
        throw err
      }
    }
}));
function generateDigest(noncetime, timespan, password) {

  var nonveArray = CryptoJS.enc.Utf8.parse(noncetime);

  var nonce=CryptoJS.enc.Base64.stringify(nonveArray);

  // Combine nonce, created timestamp, and password
  var rawStr =nonce+timespan+password;//Unencoded initial packet

  var wordArray = CryptoJS.enc.Utf8.parse(rawStr);

  var SHA256 = CryptoJS.SHA256(wordArray);

  //var SHA256Array = CryptoJS.enc.Utf8.parse(SHA256);

  var base64 = CryptoJS.enc.Base64.stringify(SHA256);

  return [base64, nonce];
}

function getDateTime(){
  const ISOTIME = new Date().toISOString();
  let timespan = ISOTIME.slice(0, -5) + 'Z';

  const regex = /\d+/g;
  let noncetime = ISOTIME.match(regex);

  const index = noncetime.indexOf('08');
  if (index > -1) { // only splice array when item is found
    noncetime.splice(index, 1); // 2nd parameter means remove one item only
  }
  let formartedNonceTime =noncetime.join("")

  console.log('get date time',formartedNonceTime);
  return [timespan, formartedNonceTime]
}

