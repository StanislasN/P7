const { BASE_API, BASE_USERS, BASE_POSTS, BASE_COMMENTS } = process.env;
const express = require("express");
const router = express.Router();

const pathList = [
  {
    path: BASE_USERS,
    model: "users",
  },
  {
    path: BASE_POSTS,
    model: "posts",
  },
  {
    path: BASE_COMMENTS,
    model: "comments",
  },
];

for (const mapping of pathList) {
  const baseUrl = `${BASE_API}${mapping.path}`;
  const Model = require(`../database/table/${mapping.model}`);


  //GET
  router.get(`${baseUrl}`, async (req, res) => {
    console.log("get", baseUrl);
    const model = new Model();
    const data = await model.getAll();
    res.json(data);
  });

  //POST
  router.post(`${baseUrl}`, async (req, res) => {
    console.log("post", baseUrl);
    const model = new Model();
    model.set(req.body);
    const data = await model.create();
    res.json(data);
  });

  //PUT
  router.put(`${baseUrl}`, async (req, res) => {
    console.log("put", baseUrl);
    const model = new Model();
    model.set(req.body);
    const data = await model.modify(req.body);
    res.json(data);
  });

  //DELETE
  router.delete(`${baseUrl}/:id`, async (req, res) => {
    const model = new Model();
    const data = await model.delete(req.params.id);
    res.json(data);
  });
}

module.exports = router;
