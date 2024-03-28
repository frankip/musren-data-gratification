
module.exports = {
  routes: [
    // { // Path defined with an URL parameter
    //   method: 'POST',
    //   path: '/restaurants/:id/review',
    //   handler: 'restaurant.review',
    // },
    { // Path defined with a regular expression
      method: 'POST',
      path: '/redemptions/gratify', // Only match when the URL parameter is composed of lowercase letters
      handler: 'custom-controller.gratification',
      config: {
        "policies": []
      }
    }
  ]
}
