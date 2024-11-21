const express = require('express');


const {create, getBranch, getBranches, update} = require('../data/Branch');
const {isValidText,isValidDate,isValidImageUrl,} = require('../util/validation');

const router = express.Router();

router.post('/', create);
router.get('/:id',getBranch);
router.get('/', getBranches);
router.put('/:id', update);

module.exports = router;
