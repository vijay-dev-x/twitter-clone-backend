import { tweetModel } from "../models/tweetScema.js";
import { userModel } from "../models/userScema.js";

export const createTweet = async (req, res) => {
  try {
    const { description, userid } = req.body;
    if (!description || !userid) {
      return res
        .status(401)
        .json({ msg: "plese fill al the fields", description, userid });
    }
    const userDetails = await userModel.findById(userid).select("-password");
    const newTweet = new tweetModel({
      description,
      userid: userid,
      userDetails: userDetails,
    });
    await newTweet.save();
    return res
      .status(201)
      .json({ msg: "Tweet created", description, userid, userDetails });
  } catch (error) {
    console.log(error);
  }
};
// delete tweet

export const deleteTweet = async (req, res) => {
  try {
    const { id } = req.params;
    await tweetModel.findByIdAndDelete(id);
    res.status(200).json({ msg: "tweet deleted successfully", status: true });
  } catch (error) {
    console.log(error);
  }
};
// like dislike
export const likeDislike = async (req, res) => {
  try {
    const userId = req.body.id;
    const tweetId = req.params.id;
    console.log(userId, tweetId);
    if (!userId) {
      console.log("fill the id field");
      return res.status(401).json({ msg: "plese fill all the fields" });
    }
    const tweetUser = await tweetModel.findById(tweetId);
    console.log(tweetUser);
    if (tweetUser.like.includes(userId)) {
      // dislike
      await tweetModel.findByIdAndUpdate(tweetId, { $pull: { like: userId } });
      return res
        .status(200)
        .json({ msg: "tweet disliked successfully", status: true });
    } else {
      // like
      await tweetModel.findByIdAndUpdate(tweetId, { $push: { like: userId } });
      return res
        .status(200)
        .json({ msg: "tweet liked successfully", status: true });
    }
  } catch (error) {
    console.log(error);
  }
};
// all tweets---------
export const allTweets = async (req, res) => {
  try {
    const loggedInUserId = req.params.id;
    const loggedInUser = await userModel.findById(loggedInUserId);
    const loggedInUserTweet = await tweetModel.find({ userid: loggedInUserId });
    // console.log(loggedUserFollowingsTweets);
    // const userDetails = await userModel.findById()

    const loggedUserFollowingsTweets = await Promise.all(
      loggedInUser.following.map((followingId) => {
        return tweetModel.find({ userid: followingId });
      })
    );
    // console.log(loggedUserFollowingsTweets);

    const allTweetUsers = await Promise.all(
      loggedUserFollowingsTweets[0].map(async (value) => {
        return await userModel.findById(value.userid);
      })
    );
    const allLoggedUsers = await Promise.all(
      loggedInUserTweet.map(async (value) => {
        return await userModel.findById(value.userid);
      })
    );
    const combineAllUsers = allLoggedUsers.concat(allTweetUsers);
    console.log(combineAllUsers);

    return res.status(200).json({
      tweets: loggedInUserTweet.concat(...loggedUserFollowingsTweets),
    });
  } catch (error) {
    console.log(error);
  }
};
// following tweets---------
export const followingTweets = async (req, res) => {
  try {
    const loggedInUserId = req.params.id;
    const loggedInUser = await userModel.findById(loggedInUserId);
    const loggedInUserTweet = await tweetModel.find({ userid: loggedInUserId });

    const loggedUserFollowingsTweets = await Promise.all(
      loggedInUser.following.map((followingId) => {
        return tweetModel.find({ userid: followingId });
      })
    );
    const flattenedTweets = loggedUserFollowingsTweets.flat();

    console.log(flattenedTweets);
    return res.status(200).json({
      tweets: flattenedTweets,
    });
  } catch (error) {
    console.log(error);
  }
};
