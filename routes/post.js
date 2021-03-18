const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../schemas/user');
const Post = require('../schemas/post');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

//최초 게시판 화면
router.get('/', async (req, res, next) => {
  try {
    console.log('게시판 진입 시도');
    const posts = await Post.find({}).populate('commenter');
    res.render('board', {
      title: '게시판',
      user:req.user,
      posts
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

//write 버튼 눌렀을 때 처리
router.get('/write', isLoggedIn, (req, res) => {
  res.render('write', { title: '새 글 작성' });
});

//write post 처리
router.post('/write', isLoggedIn, async (req, res, next) => {
  const { title, content} = req.body;
  try {

    //////입력된 데이터를 post 스키마에 저장

    await Post.create({
      commenter: req.user.id,
      title,
      content,
    });
    console.log('쓰기 완료');
    return res.redirect('/board');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

//셀의 데이터를 업로드하기 위한 axios get
router.get('/contents', async (req, res, next) => {
  try{  
    const contents=await Post.find({}).populate('commenter');
    res.json(contents);
  }
  catch(err){
    console.error(err);
    next(err);
  }
});

router.route('/:id')
  .patch(async (req, res, next) => { //수정 버튼을 눌렀을 때
    //console.log(req.user.id);
    //console.log(req.body.commenter);
    if(!req.isAuthenticated()||req.user.id!=req.body.commenter._id){ //작성자와 사용자가 다른 경우 or 로그인이 되어 있지 않은 경우
      //console.log('수정 불가능');
      res.send({success:false});
    }
    else{ //작성자와 사용자가 같은 경우
      try {
        await Post.update({ 
          _id: req.params.id,
        }, {
          content: req.body.content,
        });
        res.send({success:true});
      } catch (err) {
        console.error(err);
        next(err);
      }
    }
  })
  .delete(async (req, res, next) => { //삭제 버튼을 눌렀을 때
    if(!req.isAuthenticated()||req.user.id!=req.body.commenter._id){ //작성자와 사용자가 다른 경우 or 로그인이 되어 있지 않은 경우
      //console.log('삭제 불가능');
      res.send({success:false});
    }
    else{ //작성자와 사용자가 같은 경우
      try {
        await Post.remove({ _id: req.params.id });
        res.send({success:true});
      } catch (err) {
        console.error(err);
        next(err);
      }}
    });

module.exports = router;