'use strict';

(function () {
  var amount = document.querySelector('#amount');
  var amountLabel = document.querySelector('label[for="amount"]');
  var email = document.querySelector('#email');
  var emailLabel = document.querySelector('label[for="email"]');
  var companyName = document.querySelector('#companyName');
  var companyNameLabel = document.querySelector('label[for="companyName"]');

  amount.addEventListener('focus', function () {
    amountLabel.className = 'has-focus';
  }, false);
  amount.addEventListener('blur', function () {
    amountLabel.className = '';
  }, false);

  email.addEventListener('focus', function () {
    emailLabel.className = 'has-focus';
  }, false);
  email.addEventListener('blur', function () {
    emailLabel.className = '';
  }, false);

  companyName.addEventListener('focus', function () {
    companyNameLabel.className = 'has-focus';
  }, false);
  companyName.addEventListener('blur', function () {
    companyNameLabel.className = '';
  }, false);
})();
