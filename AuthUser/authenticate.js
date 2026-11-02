const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Question = require("./models/Question");

// 1. Kiểm tra đăng nhập bằng JWT
exports.verifyUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            { algorithms: ["HS256"] }
        );

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "Invalid user"
            });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

// 2. Kiểm tra quyền Admin
exports.verifyAdmin = (req, res, next) => {
    if (req.user && req.user.admin === true) {
        return next();
    }

    const err = new Error(
        "You are not authorized to perform this operation!"
    );

    err.status = 403;
    return next(err);
};

// 3. Kiểm tra tác giả của Question
exports.verifyAuthor = async (req, res, next) => {
    try {
        const question = await Question.findById(
            req.params.questionId
        );

        if (!question) {
            const err = new Error("Question not found");
            err.status = 404;
            return next(err);
        }

        if (
            !question.author ||
            !question.author.equals(req.user._id)
        ) {
            const err = new Error(
                "You are not the author of this question"
            );

            err.status = 403;
            return next(err);
        }

        req.question = question;
        next();

    } catch (error) {
        next(error);
    }
};