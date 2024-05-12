import express from "express";
import {
  Register,
  allProfile,
  bookmark,
  follow,
  getUserProfile,
  login,
  logout,
  unfollow,
  updateProfile,
} from "../controllers/Register.js";
const router = express.Router();
// middleware
router.use(express.json());

// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

router.route("/register").post(Register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/bookmark/:id").put(bookmark);
router.route("/profile/:id").get(getUserProfile);
router.route("/updateprofile/:id").put(updateProfile);
router.route("/allprofile/:id").get(allProfile);
router.route("/follow/:id").put(follow);
router.route("/unfollow/:id").put(unfollow);

router.post("/api3", (req, res) => {
  const data = req.body;
  console.log(data);
  res.send(data);
});

export default router;
