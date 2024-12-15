const express = require('express');


const {register, getStudent, getStudents, getDefaulters, update, updateFees, waiveFees, getBranchStudents, changeStatus, toggleRemindersEnabled, sendReminders} = require('../data/Student');
const {isValidText,isValidDate,isValidImageUrl,} = require('../util/validation');

const router = express.Router();

router.post('/register', register);
router.get('/defaulters', getDefaulters);
router.get('/branch/:id', getBranchStudents);
router.get('/:id', getStudent);
router.get('/', getStudents);
router.put('/fees/:id', updateFees);
router.put('/waivefees', waiveFees);
router.put('/togReminder/:studentId', toggleRemindersEnabled);
router.put('/reminder/:studentId', sendReminders);
router.put('/:id', update);
router.patch('/:id/status', changeStatus);
module.exports = router;
