import express from "express";
import {
  allTweets,
  createTweet,
  deleteTweet,
  followingTweets,
  likeDislike,
} from "../controllers/TweetControler.js";
const router = express.Router();

router.route("/tweet").post(createTweet);
router.route("/delete/:id").delete(deleteTweet);
router.route("/like/:id").put(likeDislike);
router.route("/alltweets/:id").get(allTweets);
router.route("/followingtweets/:id").get(followingTweets);

export default router;
