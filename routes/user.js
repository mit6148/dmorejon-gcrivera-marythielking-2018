const express = require('express');
const passport = require('./passport');
const utils = require('../utils');

const router = express.Router();

// authentication routes
router.get('/auth/facebook', passport.authenticate('facebook'));

router.get(
  '/auth/facebook/callback',
  passport.authenticate(
    'facebook',
    { failureRedirect: '/' }
  ),
  function(req, res) {
    res.redirect('/');
  }
);

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// GET /user
  // Response body:
    // success: true if user info retrieved from database; false otherwise
    // err: on error, an error message
    // user: user object (see above schema)
router.get('/', async (req, res) => {
  try {
    await user.getUser(req.user);
    utils.sendSuccessResponse(res);
  } catch(e) {
    utils.sendErrorResponse(res, 400, e.msg);
  }
});

// PUT /user
  // Request body:
    // username
    // email
  // Response body:
    // success: true if user info updated in database; false otherwise
    // err: on error, an error message
    // user: user object (see above schema)
router.put('/', async (req, res) => {
  try{
    await user.updateUser(req.user, req.body.username, req.body.email);
    utils.sendSuccessResponse(res);
  } catch(e) {
    utils.sendErrorResponse(res, 400, e.msg);
  }
});

module.exports = router;