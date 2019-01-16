const express = require('express');
const router = express.Router();

router.get('/users/signin', (req, res) => {
  res.send('Signin Page')
});

router.get('/users/signup', (req, res) => {
  res.send('Signup Page');
});

module.exports = router;