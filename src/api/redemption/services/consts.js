const GRANT_TYPE = "client_credentials";
const APP_PIN = process.env.DARAJA_APP_PIN;
const MERCHANT_ID = process.env.DARAJA_MERCHANT_ID;
const MERCHANT_PASSWORD = process.env.DARAJA_MERCHANT_PW;
const APP_PASSWORD = process.env.DARAJA_APP_PW;
const ACCOUNT_ID = process.env.DARAJA_ACCOUNT_ID;
const AUTH_BASE_URL = "https://api.safaricom.co.ke/oauth2/v3";
// const AUTH_BASE_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

const BALANCE_REDEEM_BASE_URL =
  "https://api.safaricom.co.ke/v2/consumer-resources/auth/billing";
const REDEEM_BASE_URL =
  "https://api.safaricom.co.ke/v1/bulk-data-revamp/lucky-box-promo";

// /generate?grant_type=${GRANT_TYPE}
// /query/balance
// /redemptionrequest

module.exports = {
  APP_PIN,
  GRANT_TYPE,
  ACCOUNT_ID,
  MERCHANT_ID,
  APP_PASSWORD,
  AUTH_BASE_URL,
  REDEEM_BASE_URL,
  MERCHANT_PASSWORD
};
