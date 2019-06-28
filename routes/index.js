var home = function(req, res, next){
  res.render('home', {name: 'Edge DevTools'});
  // if (req.user){
  //   console.log(req.user);
  //   res.render('home', {name: req.user.displayName});
  // } else {
  //   res.render('login');
  // }
};

module.exports.home = home;
