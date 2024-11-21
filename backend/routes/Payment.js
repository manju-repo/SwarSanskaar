const express = require('express');


const {feesPayment} = require('../data/Payment');
const {isValidText,isValidDate,isValidImageUrl,} = require('../util/validation');

const router = express.Router();


router.put('/fees', feesPayment);

module.exports = router;
