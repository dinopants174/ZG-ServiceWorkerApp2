var home = function(req, res, next){
  if (req.user){
    console.log(req.user);
    res.render('home', {name: req.user.displayName});
  } else {
    res.render('login');
  }
};

module.exports.home = home;
