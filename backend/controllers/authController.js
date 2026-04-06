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
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      const isEmailMatch = userExists.email === email;
      return res.status(400).json({
        success: false,
        error: isEmailMatch
          ? "Email already in use"
          : "Username already in use",
        statusCode: 400,
      });
    }

    const user = await User.create({ username, email, password });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: { user: { ...user._doc, password: undefined }, token },
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

// login user

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
        statusCode: 400,
      });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
        statusCode: 401,
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
        statusCode: 401,
      });
    }
    const token = generateToken(user._id);
    res.status(200).json({
      success: true,
      data: { user: { ...user._doc, password: undefined }, token },
      message: "User logged in successfully",
    });
  } catch (error) {
    next(error);
  }
};

// get user profile

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: { user: { ...user._doc, password: undefined } },
      message: "User profile fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

// update user profile

export const updateProfile = async (req, res, next) => {
  try {
    const { username, email, profileImage } = req.body;
    const user = await User.findById(req.user._id);

    if (username) {
      user.username = username;
    }
    if (email) {
      user.email = email;
    }
    if (profileImage) {
      user.profileImage = profileImage;
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: { user: { ...user._doc, password: undefined } },
      message: "User profile updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// change password

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Please provide current password and new password",
        statusCode: 400,
      });
    }
    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid current password",
        statusCode: 401,
      });
    }
    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      //   data: { user: { ...user._doc, password: undefined } },
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};
