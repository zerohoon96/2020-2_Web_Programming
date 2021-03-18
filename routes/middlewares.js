exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    //console.log('로그인 돼있음');
    next();
  } else {
    //console.log('로그인 안돼있음. 필요함');
    res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //console.log('로그인 안돼있음');
    next();
  } else {
    //console.log('로그인 돼있음. 에러');
    const message = encodeURIComponent('로그인한 상태입니다.');
    res.redirect(`/?error=${message}`);
  }
};
