'use strict';

require('dotenv').config({silent:true});

exports.BT_ENVIRONMENT= process.env.BT_ENVIRONMENT || 'Sandbox';
exports.BT_MERCHANT_ID= process.env.BT_MERCHANT_ID || 'p83hwhxnkgt7t3q8';
exports.BT_PUBLIC_KEY = process.env.BT_PUBLIC_KEY  || 'pzty4f9k4cddfpr9';
exports.BT_PRIVATE_KEY= process.env.BT_PRIVATE_KEY || 'c64d9f535b04813aa4ac7157733e16f8';

exports.sesConfig = function sesConfig(){
    return {
        key: 'AKIAJHFBEDDZ7FGIWRVA',        //process.env.AWS_KEY, //'AKIAICNUZWUX3GLHHOBA',
        secret: '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'  //process.env.AWS_SECRET //'nLFC5bFDYWC2kbysD13iCclpnAzgGEmZGakkpbpc'
    }
}
exports.mailConfig = function mailConfig(transaction) {
    return {
        sponsorMessage:`Hello,<br/><br/>Thank you for your generous donation to SkyView Academy in the amount of 
        $${transaction.amount}.<br/><br/>We're excited to acknowlege you as a sponsor for our upcoming 2019 Plaid Carpet Event! 
        In order to ensure your sponsorship goes smoothly, please review the following next steps:<br/><br/>
        1. If you haven't already, email Lisa at <u>lisarecine@gmail.com</u> with your company logo.<br/>
        2. Confirm your sponsor name is '${transaction.customer.company}'<br/>
        3. For your records, please find our 501(c)(3) details below:<br/><br/>
        Organization Name: SkyView Academy Foundation<br/>
        Organization Address: 6161 Business Center Drive, Highlands Ranch, CO 80130<br/>
        Organization Tax EIN: 27-3612126<br/><br/>
        Thank you,<br/>The Plaid Carpet Event Team`
    }
}