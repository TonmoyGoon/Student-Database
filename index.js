if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override")
app.use(methodOverride("_method"));
const session = require("express-session");
const flash = require("connect-flash");

const appError = require("./utils/appError")
const catchAsync = require("./utils/catchAsync")

const studentRoutes = require("./routes/students");
const userRoutes = require("./routes/users");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const level = [1, 2, 3, 4];
const term = [1, 2];
const allBatch = [43, 44, 45, 46, 47];
const allDept = ["ye", "fe", "wpe", "ae", "tem", "tfd", "ipe", "tmdm", "dce", "ese"];

const MongoStore = require('connect-mongo');

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/studentInfo";
// "mongodb://localhost:27017/studentInfo"

mongoose.connect(dbUrl)
    .then(() => console.log("Mongoose Connection Open"))
    .catch((err) => {
        console.log("Problem Occuered")
        console.log(err)
    })

const Student = require("./models/studentmodel");
const User = require("./models/usermodel");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine("ejs", ejsMate);

const sessionConfig = {
    store: MongoStore.create({
        mongoUrl: dbUrl,
        secret: "thisshouldbeabettersecret!",
        touchAfter: 24 * 60 * 60   // in second    --  https://github.com/jdesboeufs/connect-mongo#readme
    }),
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/students/:batch/:dept/allstudentslist", studentRoutes);
app.use("/", userRoutes);

app.get("/home", (req, res) => {
    res.render("home", { allBatch, allDept });
})

// Page not found
app.all("*", (req, res, next) => {
    next(new appError("Page Not Found !!!!", 404));
})

// Error handling route
app.use((err, req, res, next) => {
    const { status = 200 } = err;
    if (!err.message) err.message = "An Error occured!!!";
    console.log(err);
    res.status(status).render("error", { err });
})

const port = process.env.PORT || 2323;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})


// mongodb+srv://tonmoy:<password>@cluster1.wozys.mongodb.net/myFirstDatabase?retryWrites=true&w=majority