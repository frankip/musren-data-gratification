'use strict';

/**
 * redemption controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::redemption.redemption', ({strapi}) => ({
  gratify: async (ctx) => {
     // following variable will get url `id` param value.
      const id = ctx
      try {
        console.log('we are working');
        return {
          "status":"working",
          "id":"franciss"
        }
      } catch (err) {
        ctx.badRequest("Post report controller error");
      }
  }
}));
