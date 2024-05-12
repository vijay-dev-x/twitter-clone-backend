import { userModel } from "../models/userScema.js";
import bcryptjs from "bcryptjs";
import { json } from "express";
import jwt from "jsonwebtoken";
import cookie from "cookie-parser";

export const Register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(401).json({
        msg: "please fill all the fields",
        status: false,
      });
    }
    const emailExist = await userModel.findOne({ email });
    if (emailExist) {
      return res
        .status(401)
        .json({ msg: "email already exist", sucess: false });
    }
    const usernameExist = await userModel.findOne({ username });
    if (usernameExist) {
      return res
        .status(401)
        .json({ msg: "username already exist", sucess: false });
    }

    const hashPassword = await bcryptjs.hash(password, 3);
    const newUser = new userModel({
      name,
      username,
      email,
      password: hashPassword,
    });
    await newUser.save();
    console.log("user created successfully");
    return res.status(201).json({
      msg: "user created successfully",
      status: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// login ---

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .json({ msg: "plese fill all the fields", status: false });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Email not exist", status: false });
    }
    const decryptPassword = await bcryptjs.compare(password, user.password);
    if (!decryptPassword) {
      return res
        .status(401)
        .json({ msg: "password is incorrect", status: false });
    }
    const tokenData = {
      userid: user._id,
    };
    const token = jwt.sign(tokenData, "vk12345", {
      expiresIn: "30d",
    });

    console.log("loggedIn succesfully");
    return res
      .status(200)
      .cookie("token", token, { expiresIn: "1d", httpOnly: true })
      .json({ msg: `welcome back ${user.name}`, token, status: true, user });
  } catch (error) {
    console.log(error);
  }
};
// logout
export const logout = (req, res) => {
  return res
    .status(200)
    .cookie("token", "", { expiresIn: new Date(Date.now()) })
    .json({
      msg: "user logged out successfully",
      status: true,
    });
};
// bookmark---
export const bookmark = async (req, res) => {
  const loggedUser = req.body.id;
  const tweetId = req.params.id;
  if (!loggedUser) {
    return res
      .status(401)
      .json({ msg: "plese fill all the fields", status: false });
  }
  const user = await userModel.findById(loggedUser);
  if (user.bookmark.includes(tweetId)) {
    await userModel.findByIdAndUpdate(loggedUser, {
      $pull: { bookmark: tweetId },
    });
    return res
      .status(200)
      .json({ msg: "removed bookmarked tweet successfully", status: true });
  } else {
    await userModel.findByIdAndUpdate(loggedUser, {
      $push: { bookmark: tweetId },
    });
    return res
      .status(200)
      .json({ msg: "Tweet bookmarked successfully", status: true });
  }
};
// getUserProfile------
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId).select("-password");
    return res
      .status(200)
      .json({ msg: "user got successfully", status: true, user });
  } catch (error) {
    console.log(error);
  }
};
//  update Profile------
export const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body;
    const user = await userModel.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    });
    return res.status(200).json({
      msg: "User updated successfully",
      updatedUserData,
      status: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

// all profile----------

export const allProfile = async (req, res) => {
  const loggedUser = req.params.id;
  const allUser = await userModel
    .find({ _id: { $ne: loggedUser } })
    .select("-password");
  return res
    .status(200)
    .json({ msg: "got all the user successfully", status: true, allUser });
};

// follow  ---------------
export const follow = async (req, res) => {
  try {
    const loggedUserId = req.body.id;
    const frontUserId = req.params.id;
    const loggedUser = await userModel.findById(loggedUserId);
    const frontUser = await userModel.findById(frontUserId);
    if (!loggedUser.following.includes(frontUserId)) {
      await loggedUser.updateOne({ $push: { following: frontUserId } });
      await frontUser.updateOne({ $push: { followers: loggedUserId } });
      return res
        .status(200)
        .json({ msg: `${loggedUser.name} followed -${frontUser.name}` });
    } else {
      return res.status(200).json({
        msg: `user alreday followed`,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
// unfollow  ---------------
export const unfollow = async (req, res) => {
  try {
    const loggedUserId = req.body.id;
    const frontUserId = req.params.id;
    const loggedUser = await userModel.findById(loggedUserId);
    const frontUser = await userModel.findById(frontUserId);
    if (loggedUser.following.includes(frontUserId)) {
      await loggedUser.updateOne({ $pull: { following: frontUserId } });
      await frontUser.updateOne({ $pull: { followers: loggedUserId } });
      return res
        .status(200)
        .json({ msg: `${loggedUser.name} unfollowed -${frontUser.name}` });
    } else {
      return res.status(200).json({
        msg: `user already unfollowed`,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
