const express = require('express');
const router = express.Router();

// Model
const User = require('../models/User');

const passport = require('passport');

router.get('/users/signup', (req, res) => {
  res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
  const { name, email, password, confirm_password } = req.body;
  let errors = [];
  const regExp_email = /[^@]+@[^\.]+\..+/;

  if (name.length <= 0) {
    errors.push({ text: 'Name field empty. Please! insert your name' });
  }

  if (email.length <= 0) {
    errors.push({ text: 'Email field empty. Please insert your email' });
  }

  if (!regExp_email.test(email)) {
    errors.push({ text: 'Insert a valid format email' });
  }

  if (password != confirm_password) {
    errors.push({ text: 'Password does not match' });
  }

  if (password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('users/signup', {
      errors,
      name,
      email,
      password,
      confirm_password
    });
  } else {
    // Look for email coincidence
    const emailUser = await User.findOne({ email: email });

    if (emailUser) {
      
      req.flash('error_msg', 'The email is already in use.');
      res.redirect('/users/signup');

    } else {
      // Saving a New User
      const newUser = new User({ name, email, password });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash('success_msg', 'You are registered!');
      res.redirect('/users/signin');

    }

  }
  
});

router.get('/users/signin', (req, res) => {
  res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
  successRedirect: '/notes',
  failureRedirect: '/users/signin',
  failureFlash: true
}));

module.exports = router;