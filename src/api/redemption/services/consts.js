const GRANT_TYPE = "client_credentials";
const APP_PASSWORD = process.env.AppSecret;
const ACCOUNT_ID = process.env.AppKey;
const PRODUCT_ID = process.env.PRODUCT

const DOP_URL = process.env.DOP_URL

module.exports = {
  ACCOUNT_ID,
  APP_PASSWORD,
  DOP_URL,
  PRODUCT_ID
};
