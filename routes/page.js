const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../schemas/user');
const Post = require('../schemas/post');
const router = express.Router();

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: '회원가입' });
});

router.get('/', async (req, res, next) => {
  //console.log('메인 페이지');
  //console.log(req.isAuthenticated());
    
  try {
    //console.log(req.isAuthenticated());
    var title='메인화면';
    if(req.user){
      title+=' - 로그인 완료';
    }
    res.render('layout', {
      title,
      user:req.user,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/about', async (req, res, next) => {
  try {
    res.render('about', {
      title: '소개페이지',
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
module.exports = router;
