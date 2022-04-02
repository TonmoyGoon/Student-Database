const mongoose = require("mongoose");
const Student = require("./model");

mongoose.connect("mongodb://localhost:27017/studentInfo")
    .then(() => console.log("Mongoose Connection Open"))
    .catch((err) => {
        console.log("Problem Occuered")
        console.log(err)
    })

const allStudents =
    [
        {
            name: "Mirza",
            age: 23,
            hobby: ["tour", "programming"],
            doTuition: true,
            university: "butex"
        },
        {
            name: "Durjoy",
            age: 21,
            hobby: ["thinking", "chess"],
            doTuition: false,
            university: "du"
        },
        {
            name: "Partho",
            age: 18,
            hobby: ["programming"],
            doTuition: false,
            university: "ruet"
        }
    ];

Student.insertMany(allStudents)
    .then(data => console.log(data))
    .catch(err => console.log(err))