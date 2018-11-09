'use strict';

var braintree = require('braintree');
var environment, gateway;
var config = require('../config/config');

require('dotenv').config();
environment = config.BT_ENVIRONMENT.charAt(0).toUpperCase() + config.BT_ENVIRONMENT.slice(1);

gateway = braintree.connect({
  environment: braintree.Environment[environment],
  merchantId: config.BT_MERCHANT_ID,
  publicKey: config.BT_PUBLIC_KEY,
  privateKey: config.BT_PRIVATE_KEY
});

module.exports = gateway;
