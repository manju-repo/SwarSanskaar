const express = require('express');


const {register, getStudent, getStudents, update, updateFees, waiveFees, getBranchStudents, changeStatus, toggleRemindersEnabled} = require('../data/Student');
const {isValidText,isValidDate,isValidImageUrl,} = require('../util/validation');

const router = express.Router();

router.post('/register', register);
router.get('/branch/:id', getBranchStudents);
router.get('/:id', getStudent);
router.get('/', getStudents);
router.put('/fees/:id', updateFees);
router.put('/waivefees', waiveFees);
router.put('/reminder/:studentId', toggleRemindersEnabled);
router.put('/:id', update);
router.patch('/:id/status', changeStatus);
module.exports = router;
