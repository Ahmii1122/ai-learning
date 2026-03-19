import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate JWT token

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// register new user

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }] });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: userExists.email
          ? "Email already in use"
          : "Username already in use",
        statusCode: 400,
      });
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: { user: { ...user._doc }, token, password: undefined },
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

// login user

export const login = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

// get user profile

export const getProfile = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

// update user profile

export const updateProfile = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

// change password

export const changePassword = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
