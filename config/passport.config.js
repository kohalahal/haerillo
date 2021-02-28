const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require("../models").users
const { Strategy: LocalStrategy } = require('passport-local');



/* 사용자 인증 */
const auth = async (username, password, done) => {
  User.findOne({ where: { username: username } })
    .then(function (user) {
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.password === password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    })
    .catch(err => done(err));
  };

  passport.use('local', new LocalStrategy(auth));


  module.exports = () => {
     passport
  };