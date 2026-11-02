const Question = require('../models/Question');

exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createQuestion = async (req, res) => {
  try {
    const question = new Question({
      text: req.body.text,
      options: req.body.options,
      keywords: req.body.keywords,
      correctAnswerIndex: req.body.correctAnswerIndex,
      author: req.user._id
    });

    const savedQuestion = await question.save();

    res.status(201).json(savedQuestion);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

exports.updateQuestion = async (req, res, next) => {
    try {
        const allowedFields = [
            "text",
            "options",
            "keywords",
            "correctAnswerIndex"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const question = await Question.findByIdAndUpdate(
            req.params.questionId,
            { $set: updates },
            {
                new: true,
                runValidators: true
            }
        );

        res.json({
            message: "Question updated successfully",
            question
        });

    } catch (error) {
        next(error);
    }
};

const Quiz = require("../models/Quiz");

exports.deleteQuestion = async (req, res, next) => {
    try {
        const questionId = req.params.questionId;

        await Quiz.updateMany(
            { questions: questionId },
            { $pull: { questions: questionId } }
        );

        await Question.findByIdAndDelete(questionId);

        res.json({
            message: "Question deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};