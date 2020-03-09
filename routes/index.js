const express = require("express"),
  router = express.Router();
albumModel = require("../models/albumModel");

/* GET home page. */

router.get("/", async function(req, res, next) {
  const data = await albumModel.getAllAlbums();
  console.log("data", data);

  res.render("template", {
    locals: {
      title: "Album Review Daily ",
      data: data,
      is_logged_in: req.session.is_logged_in
    },
    partials: {
      partial: "partial-index"
    }
  });
});

router.post("/", async function(req, res) {
  console.log("req body:", req.body);
  const { album_id, review_title, review_text } = req.body;
  const postData = await albumModel.addReview(
    album_id,
    review_title,
    review_text
  );
  console.log(postData);
  res.sendStatus(200);
});

module.exports = router;
