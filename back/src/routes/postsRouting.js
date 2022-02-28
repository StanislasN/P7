const { BASE_API, BASE_POSTS } = process.env;
const express = require("express");
const router = express.Router();
const fs = require('fs')
const path = require('path')
const Posts = require("../database/table/posts");
const multer = require("../middleware/multer-config");

const baseUrl = `${BASE_API}${BASE_POSTS}`;
router.post(`${baseUrl}`, multer.single('posts_file'), async (req, res) => {
  const filePath = path.join(__dirname, `../../assets/img/${req.file.filename}`)

  if (fs.existsSync(filePath)) {
    const postsTable = new Posts()
    postsTable.set({
      ...req.body,
      posts_file: req.file.filename
    })

    const result = await postsTable.create()
    result[0].posts_file = `${BASE_POSTS}/public/image/${req.file.filename}`
    res.json(result)
  } else {
    res.json(false)
  }

});

router.get(`${baseUrl}/public/image/:img`, async (req, res) => {
  res.sendFile(path.join(__dirname, `../../assets/img/${req.params.img}`))
})

module.exports = router;
