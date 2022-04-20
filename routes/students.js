const express = require("express");
const router = express.Router({ mergeParams: true });
const Student = require("../models/studentmodel");
const { isLoggedIn } = require("../middleware");

const appError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")

const level = [1, 2, 3, 4];
const term = [1, 2];
const allBatch = [43, 44, 45, 46, 47];
const allDept = ["ye", "fe", "wpe", "ae", "tem", "tfd", "ipe", "tmdm", "dce", "ese"];


// Index/Allstudents

router.get("/", catchAsync(async (req, res) => {
    const { batch, dept } = req.params;
    const students = await Student.find({ batch: batch, dept: dept });
    console.log(batch, dept);
    res.render("students/index", { students, batch, dept });
}))

// Create

router.get("/new", isLoggedIn, catchAsync(async (req, res) => {
    const { batch, dept } = req.params;
    const student = await Student.find({ batch: batch });
    res.render("students/new", { student, level, term, dept, batch, allDept, allBatch })
}))

router.post("/", isLoggedIn, catchAsync(async (req, res) => {
    const { batch, dept } = req.params;
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.redirect(`/students/${batch}/${dept}/allstudentslist`)
}))


// Showpage

router.get("/:id", catchAsync(async (req, res) => {
    const { batch, dept, id } = req.params;
    const student = await Student.findById(id);
    res.render("students/show", { student, dept, batch });
}))


// Update

router.get("/:id/update", isLoggedIn, catchAsync(async (req, res) => {
    const { batch, dept, id } = req.params;
    const student = await Student.findById(id);
    res.render("students/update", { student, batch, dept, level, term, allBatch, allDept });
}))

router.put("/:id", isLoggedIn, catchAsync(async (req, res) => {
    const { batch, dept, id } = req.params;
    const student = await Student.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
    res.redirect(`/students/${batch}/${dept}/allstudentslist/${student._id}`)
}))


// Delete

router.delete("/:id", isLoggedIn, catchAsync(async (req, res) => {
    const { batch, dept, id } = req.params;
    const deleteStudent = await Student.findByIdAndDelete(id);
    res.redirect(`/students/${batch}/${dept}/allstudentslist`)
}))


module.exports = router;