const User = require("../models/User");

exports.login = async (req, res, next) => {
  try {
    const { password, email } = req.body;

    // validate email & password

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Please provide an email and password",
      });
    }

    // check for users
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "invalid credentials",
      });
    }
    //// is match
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid credentials not match!" });
    }

    // const token = user.getSignedJwtToken();
    // res.status(200).json({success: true, token});
    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res
      .status(401)
      .json({
        success: false,
        msg: "can't convert email or password to string",
      });
  }
};

//@desc    Log user out / clear cookie
//@route   GET /api/v1/auth/logout
//@access  Private
exports.logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    //Creaete user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    const token = user.getSignedJwtToken();
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false });
    console.log(err.stack);
  }
};

//JWT_COOKIE_EXPIRE

const sendTokenResponse = (user, statusCode, res) => {
  //  create token
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  //res.status(statusCode).cookie('token', token, options).json({success: true, token})
  res.status(statusCode).json({
    success: true,

    _id: user._id,
    name: user.name,
    email: user.email,

    token,
  });
};

exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
};
