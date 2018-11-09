'use strict';

var express = require('express');
var braintree = require('braintree');
var router = express.Router(); // eslint-disable-line new-cap
var gateway = require('../lib/gateway');
var { sesConfig,mailConfig } = require('../config/config');
var btConfig = require('../config/config');

const awsConfig = sesConfig();

var ses = require('node-ses'), client = ses.createClient({ 
  key: awsConfig.key, 
  secret: awsConfig.secret
});

var TRANSACTION_SUCCESS_STATUSES = [
  braintree.Transaction.Status.Authorizing,
  braintree.Transaction.Status.Authorized,
  braintree.Transaction.Status.Settled,
  braintree.Transaction.Status.Settling,
  braintree.Transaction.Status.SettlementConfirmed,
  braintree.Transaction.Status.SettlementPending,
  braintree.Transaction.Status.SubmittedForSettlement
];

function formatErrors(errors) {
  var formattedErrors = '';

  for (var i in errors) { // eslint-disable-line no-inner-declarations, vars-on-top
    if (errors.hasOwnProperty(i)) {
      formattedErrors += 'Error: ' + errors[i].code + ': ' + errors[i].message + '\n';
    }
  }
  return formattedErrors;
}

function handleSES(result, transaction) {
  if (result.statusCode) {

    const mailerMessage = mailConfig(transaction);

    if (btConfig.BT_ENVIRONMENT.toLowerCase() == 'sandbox') {
      client.sendEmail({
        to: transaction.customer.email
      , from: 'SkyViewAcademy@codedenver.com'
      //, cc: 'lisarecine@gmail.com'
      , bcc: 'jbishop@codedenver.com'
      , subject: 'SkyView Academy - Thank You from the Plaid Carpet Team'
      , message: mailerMessage.sponsorMessage
     }, function (err, data, res) {
      console.log( (err != null) ? err : "");
     });
    }
    else {
      client.sendEmail({
        to: transaction.customer.email
      , from: 'SkyViewAcademy@codedenver.com'
      //, cc: 'lisarecine@gmail.com'
      , bcc: 'jbishop@codedenver.com'
      , subject: 'SkyView Academy - Thank You from the Plaid Carpet Team'
      , message: mailerMessage.sponsorMessage
     }, function (err, data, res) {
      console.log( (err != null) ? err : "");
     });
    }
       
  }
}

function createResultObject(transaction) {
  var result;
  var status = transaction.status;

  if (TRANSACTION_SUCCESS_STATUSES.indexOf(status) !== -1) {
    result = {
      header: 'Thank you! We\'re grateful for your sponsorship!',
      icon: 'success',
      message: 'Your sponsorship was successfully processed.',
      statusCode: true
    };
  } else {
    result = {
      header: 'Transaction Failed',
      icon: 'fail',
      message: 'Your transaction has a status of ' + status + '. Please check your card and try again.',
      statusCode: false
    };
  }

  return result;
}

router.get('/', function (req, res) {
  res.redirect('/checkouts/new');
});

router.get('/checkouts/new', function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    res.render('checkouts/new', {enviro: btConfig.BT_ENVIRONMENT, clientToken: response.clientToken, messages: req.flash('error')});
  });
});

router.get('/checkouts/:id', function (req, res) {
  var result;
  var transactionId = req.params.id;

  gateway.transaction.find(transactionId, function (err, transaction) {
    result = createResultObject(transaction);
    handleSES(result, transaction);
    res.render('checkouts/show', {enviro: btConfig.BT_ENVIRONMENT, transaction: transaction, result: result});
  });
});

router.post('/checkouts', function (req, res) {
  var transactionErrors;
  var amount = req.body.amount; // In production you should not take amounts directly from clients
  var nonce = req.body.payment_method_nonce;
  var email = req.body.email;
  var companyName = req.body.companyName;

  gateway.transaction.sale({
    amount: amount,
    paymentMethodNonce: nonce,
    options: {
      submitForSettlement: true
    },
    customer: {
      email: email,
      company: companyName
    },
    customFields: {
      sponsorLevel: 'BigEvent 2019'
    }
  }, function (err, result) {
    if (result.success || result.transaction) {
      res.redirect('checkouts/' + result.transaction.id);
    } else {
      transactionErrors = result.errors.deepErrors();
      req.flash('error', {msg: formatErrors(transactionErrors)});
      res.redirect('checkouts/new');
    }
  });
});

module.exports = router;
