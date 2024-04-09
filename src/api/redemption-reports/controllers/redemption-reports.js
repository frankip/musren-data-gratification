'use strict';

/**
 * A set of functions called "actions" for `redemption-reports`
 */

module.exports = {
  redemptionReports: async (ctx, next) => {
    // find the company the user belongs to and pass to the fetch redemption service
    const companyId=1
    if(!companyId){
      ctx.badRequest("no companies associated",)
    }
    try {
      const redeemed = await strapi.service("api::redemption-reports.redemption-reports").fetchRedemptions(companyId);
      const response = {
        status:'ok',
        data:redeemed
      }
      ctx.body = response
    } catch (err) {
      ctx.badRequest("controller error", { moreDetails: err });
    }
  }
};
