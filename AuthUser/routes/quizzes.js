const express = require("express");
const router = express.Router();

const quizController = require("../controllers/quizController");
const authenticate = require("../authenticate");

router.get("/", quizController.getAllQuizzes);

router.get("/:quizId", quizController.getQuizById);


router.post("/",authenticate.verifyUser, authenticate.verifyAdmin, quizController.createQuiz);

router.put("/:quizId", authenticate.verifyUser, authenticate.verifyAdmin, quizController.updateQuiz);

router.delete("/:quizId", authenticate.verifyUser, authenticate.verifyAdmin, quizController.deleteQuiz);

router.get("/:quizId/populate",quizController.getQuizPopulate);

router.post("/:quizId/question",authenticate.verifyUser, authenticate.verifyAdmin,quizController.addQuestionToQuiz);

router.post("/:quizId/questions",authenticate.verifyUser, authenticate.verifyAdmin, quizController.addManyQuestionsToQuiz);

router.post(
    "/:quizId/existing-questions",
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    quizController.addExistingQuestions
);

module.exports = router;