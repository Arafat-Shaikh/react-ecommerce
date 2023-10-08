require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const productsRouter = require("./routes/Products");
const cartRouter = require("./routes/Cart");
const authRouter = require("./routes/Auth");
const orderRouter = require("./routes/Order");
const userRouter = require("./routes/User");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const { User } = require("./model/User");
const crypto = require("crypto");
const { filterUser, isAuth } = require("./services/common");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require("path");
const { env } = require("process");

const opts = {};
opts.jwtFromRequest = function (req, res) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};
opts.secretOrKey = process.env.JWT_SECRET_KEY;

app.use(express.static(path.resolve(__dirname, "build")));

app.use(cors({ exposedHeaders: ["X-DOCUMENT-COUNT"] }));

app.use(cookieParser());
app.use(
  session({
    // this will create session serialize and deserialize mentioned below.
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  // authenticate route for using this strategy as local.
  new LocalStrategy(
    { usernameField: "email" }, // here username field will change make email to use as a username.
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: "Invalid User." });
        }

        crypto.pbkdf2(
          password, // this entered password will be hashed.
          user.salt,
          310000,
          32,
          "sha256",
          async function (err, hashedPassword) {
            // it will compare the stored password and provided password.
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
              done(null, false, { message: "Invalid User" });
            } else {
              const token = jwt.sign(
                filterUser(user),
                process.env.JWT_SECRET_KEY
              );
              return done(null, { id: user.id, role: user.role, token });
            }
          }
        );
      } catch (err) {
        console.log(err);
        return done("Invalid User", false);
      }
    }
  )
);

passport.use(
  //authenticate route for using this strategy as jwt.
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log(jwt_payload); // it will hold user information which you will provide.
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, filterUser(user));
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

passport.serializeUser(function (user, done) {
  process.nextTick(function () {
    // this will create session and then you will be able to use that session for authentication.
    console.log("serialize");
    return done(null, filterUser(user));
  });
});

passport.deserializeUser(function (user, done) {
  process.nextTick(function () {
    //this will help to use created session.
    console.log("deserialize");

    return done(null, filterUser(user));
  });
});

app.use(express.json());

app.use("/auth", authRouter.router);
app.use("/products", productsRouter.router);
app.use("/cart", isAuth(), cartRouter.router);
app.use("/orders", isAuth(), orderRouter.router);
app.use("/users", isAuth(), userRouter.router);

app.use("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("database connected");
}

app.listen(process.env.PORT, () => {
  console.log("server is running.");
});
