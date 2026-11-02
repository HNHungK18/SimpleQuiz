const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate('questions');
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId).populate('questions');
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createQuiz = async (req, res) => {
    try {
        const quiz = new Quiz({
            title: req.body.title,
            description: req.body.description,
            questions: req.body.questions // Array of question IDs
        });
        const newQuiz = await quiz.save();
        res.status(201).json(newQuiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateQuiz = async (req, res) => {
    try{
        const quiz = await Quiz.findByIdAndUpdate(req.params.quizId, req.body, { new: true, runValidators: true }).populate('questions');
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(
            req.params.quizId
        );

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        res.json({
            message: "Quiz deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};

exports.getQuizPopulate = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId)
      .populate({
        path: "questions",
        match: {
          text: { $regex: "capital", $options: "i" }
        }
      });

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }

    res.status(200).json(quiz);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.addQuestionToQuiz = async (req, res) => {
  try {
    // tìm quiz
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }

    // tạo question mới
    const question = new Question({
      text: req.body.text,
      options: req.body.options,
      keywords: req.body.keywords,
      correctAnswerIndex: req.body.correctAnswerIndex,
      author: req.user._id
    });

    
    const savedQuestion = await question.save();

    
    quiz.questions.push(savedQuestion._id);

    
    await quiz.save();

    res.status(201).json(savedQuestion);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

exports.addManyQuestionsToQuiz = async (req, res) => {
  try {
    
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }

    
    const questions = await Question.insertMany(req.body);

    
    const questionIds = questions.map(
      question => question._id
    );

    
    quiz.questions.push(...questionIds);

    await quiz.save();

    res.status(201).json({
      message: "Questions added successfully",
      questions: questions
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

exports.addExistingQuestions = async (req, res, next) => {
    try {
        const { quizId } = req.params;
        const { questionIds } = req.body;

        // Kiểm tra danh sách Question
        if (!Array.isArray(questionIds) || questionIds.length === 0) {
            return res.status(400).json({
                message: "Please provide questionIds"
            });
        }

        // Kiểm tra ID hợp lệ
        if (
            !mongoose.isValidObjectId(quizId) ||
            questionIds.some(id => !mongoose.isValidObjectId(id))
        ) {
            return res.status(400).json({
                message: "Invalid Quiz or Question ID"
            });
        }

        // Kiểm tra Quiz tồn tại
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        // Loại bỏ ID trùng trong request
        const uniqueIds = [...new Set(questionIds.map(String))];

        // Kiểm tra các Question có tồn tại không
        const questions = await Question.find({
            _id: { $in: uniqueIds }
        });

        if (questions.length !== uniqueIds.length) {
            return res.status(404).json({
                message: "Some questions do not exist"
            });
        }

        // Thêm các Question vào Quiz, không thêm trùng
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            quizId,
            {
                $addToSet: {
                    questions: { $each: uniqueIds }
                }
            },
            { new: true }
        ).populate("questions");

        return res.status(200).json({
            message: "Existing questions added successfully",
            quiz: updatedQuiz
        });

    } catch (error) {
        next(error);
    }
};