const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const authenticate = require("../authenticate");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res, next) => {
    try {
        const { username, password, isAdmin = false } = req.body;

        if (
            typeof username !== "string" ||
            !username.trim() ||
            typeof password !== "string" ||
            !password
        ) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        // Kiểm tra isAdmin phải là boolean
        if (typeof isAdmin !== "boolean") {
            return res.status(400).json({
                message: "isAdmin must be true or false"
            });
        }

        const existingUser = await User.findOne({
            username: username.trim()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Username already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username: username.trim(),
            password: hashedPassword,
            admin: isAdmin
        });

        return res.status(201).json({
            message: isAdmin
                ? "Admin registered successfully"
                : "User registered successfully",
            user: {
                _id: user._id,
                username: user.username,
                isAdmin: user.admin
            }
        });

    } catch (error) {
        next(error);
    }
});

// LOGIN
router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (
            typeof username !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        const user = await User.findOne({
            username
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const isValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isValid) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { id: user._id.toString() },
            process.env.JWT_SECRET,
            {
                algorithm: "HS256",
                expiresIn: "2h"
            }
        );

        return res.json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                username: user.username,
                isAdmin: user.admin
            }
        });

    } catch (error) {
        next(error);
    }
});

// GET ALL USERS - ADMIN ONLY
router.get(
    "/",
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    async (req, res, next) => {
        try {
            const users = await User.find()
                .select("_id username admin");

            return res.json(users);
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;