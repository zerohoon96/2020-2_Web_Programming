const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../schemas/user');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exEmail = await User.findOne({ email });
    if (exEmail) {
      return res.redirect('/join?errorEmail=exist');
    }
    const exNick = await User.findOne({ nick });
    if (exNick) {
      return res.redirect('/join?errorNick=exist');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email: email,
      nick: nick,
      password: hash,
    });
    console.log('회원가입 완료');
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.log('로그인 에러');
        console.error(loginError);
        return next(loginError);
      }
      //console.log('auth.js에서 로그인 성공!!!');
      res.cookie('user',req.isAuthenticated());
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.

});

router.get('/logout', isLoggedIn, (req, res) => { //로그아웃
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
