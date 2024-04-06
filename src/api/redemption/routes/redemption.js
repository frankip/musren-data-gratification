'use strict';

/**
 * redemption router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;
const defaultRouter = createCoreRouter('api::redemption.redemption');

const customRouter = (innerRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes.concat(extraRoutes);
      return routes;
    },
  };
};

const myExtraRoutes = [
  {
    method: "POST",
    path: '/redemptions/gratify',
    handler: "custom-controller.gratification",
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
