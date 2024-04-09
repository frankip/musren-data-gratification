'use strict';

/**
 * redemption-reports service
 */

module.exports = () => ({
  fetchRedemptions: async (companyId) =>{
    try {
      // fetch company redemptions
      const redemptions = await strapi.entityService.findMany("api::redemption.redemption", {
        filters: {
          company:{
            id:{
              $eq: companyId, // Filter by category ID equal to 1
            },
          },
        },
        populate:{
          company:{
            fields:['id', 'Name']
          }
        }
      });

      const successful = redemptions.filter(redemption => redemption.status == '200')
      const unsuccessful = redemptions.filter(redemption => redemption.status == '400' ||  redemption.status == '500')
      const response = {
        totalRedemptions:{
          count: redemptions.length,
        },
        successfulRedemptions:{
          count:successful.length,
          data: successful
        },
        failedRedemptions:{
          count: unsuccessful.length,
          data: unsuccessful
        },
      }
      return response;

    } catch (error) {
      return error;
    }
  }
});
