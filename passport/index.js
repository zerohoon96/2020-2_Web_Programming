const passport = require('passport');
const local = require('./localStrategy');
const User = require('../schemas/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    //console.log('씨리얼라이즈드');
    console.log(user.id);
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    //console.log('디씨리얼라이즈드');
    User.findById(id, function(err, user){
      done(null, user);
    });
  });

  local();
};
