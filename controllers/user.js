module.exports.renderSignUp = async (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let newUser = new User({ username, email });
    await User.register(newUser, password);
    req.login(newUser, (err) => {
      if (err) return next(err);
      req.flash("success", "user was registered");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", "User is already exists.");
    res.redirect("/signup");
  }
};

module.exports.renderLogin = async (req, res) => {
  res.render("user/login.ejs");
};

module.exports.loginUser = async (req, res) => {
  req.flash("success", "user was LoggedIn");
  let redirect = res.locals.redirectUrl || "/listings";
  res.redirect(redirect);
};

module.exports.logoutUser = (req, res) => {
  req.logOut((err) => {
    if (err) return next(err);
    req.flash("success", "logged you out!");
    res.redirect("/listings");
  });
};
