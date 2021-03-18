const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../schemas/user');
const Post = require('../schemas/post');
const Gallery = require('../schemas/gallery');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();
const upload2 = multer();
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

try{
  fs.readdirSync('uploads');
} catch(error){
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

router.get('/', async (req, res, next) => {
  try {
    console.log('갤러리 진입 시도');
    const datas = await Gallery.find({}).populate('commenter');
    res.render('gallery', {
      title: '갤러리',
      user:req.user,
      datas
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
router.post('/',isLoggedIn,upload2.none(),async(req,res,next)=>{
  try{
    //이미지가 입력된 경우에만 진행
    if(req.body.url){ 
      const post = await Gallery.create({
      commenter: req.user.id,
      img: req.body.url,
    });
  }
  res.redirect('/gallery');
  } catch(error){
    console.error(error);
    next(error);
  }
});

router.post('/update/:id',isLoggedIn,async(req,res,next)=>{
  try{
    //이미지가 입력된 경우에만 진행
    var new_img=req.body.new_img;
    var content=req.body.content;
    if(req.body.new_img){
      console.log('변경가능');
      await Gallery.update({ _id: req.params.id }, { $set: { img: new_img } });
    }
    else{
      console.log("입력안함");
//      console.log(req.body);
    }
  res.send();
  } catch(error){
    console.error(error);
    next(error);
  }
});

router.get('/insert', isLoggedIn, (req, res) => {
  console.log(req.body);
  res.render('photo', { title: '사진 업로드', });
});

router.post('/img',isLoggedIn,upload.single('img'),(req,res)=>{
  res.json({url:`/img/${req.file.filename}`});
});

router.post('/img/post',isLoggedIn,upload2.none(),async (req,res,next)=>{
  try{
    const post = await Gallery.create({
      commenter: req.body.content,
      img: req.body.url,
    });
    res.redirect('/gallery');
  } catch(error){
    console.error(error);
    next(error);
  }
});

//셀의 데이터를 업로드하기 위한 axios get
router.get('/contents', async (req, res, next) => {
  try{  
    const contents=await Gallery.find({}).populate('commenter');
    res.json(contents);
  }
  catch(err){
    console.error(err);
    next(err);
  }
});


router.route('/:id')
  .patch(async (req, res, next) => { //수정 버튼을 눌렀을 때
    
    if(!req.isAuthenticated()||req.user.id!=req.body.commenter._id){ //작성자와 사용자가 다른 경우 or 로그인이 되어 있지 않은 경우
      //console.log('수정 불가능');
      res.send({success:false});
    }
    else{ //작성자와 사용자가 같은 경우
      try { 
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
        await Gallery.remove({ _id: req.params.id });
        res.send({success:true});
      } catch (err) {
        console.error(err);
        next(err);
      }}
    });


module.exports = router;