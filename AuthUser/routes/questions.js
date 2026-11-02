const express = require("express");
const router = express.Router();
const questionController = require('../controllers/questionController');
const authenticate = require("../authenticate");

router.get('/', questionController.getAllQuestions);
router.get('/:questionId', questionController.getQuestionById);

router.post('/', authenticate.verifyUser, questionController.createQuestion);
router.put('/:questionId',authenticate.verifyUser,authenticate.verifyAuthor, questionController.updateQuestion);
router.delete('/:questionId',authenticate.verifyUser,authenticate.verifyAuthor, questionController.deleteQuestion);

module.exports = router;