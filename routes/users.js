const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/usermodel");
const catchAsync = require("../utils/catchAsync");

// Register

router.get("/register", (req, res) => {
    res.render("users/register");
})

router.post("/register", catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.flash("success", "Welcome to Student db website");
        res.redirect("/students");
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/register");
    }
}))

// Login

router.get("/login", (req, res) => {
    res.render("users/login")
})

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash("success", "Welcome back");
    const redirectUrl = req.session.returnTo || "/students";
    console.log(redirectUrl);
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})


// Logout

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Goodbye!!");
    res.redirect("/students");
})

module.exports = router;