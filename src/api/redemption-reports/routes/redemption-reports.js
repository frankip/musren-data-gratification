module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/redemption-reports',
     handler: 'redemption-reports.redemptionReports',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
