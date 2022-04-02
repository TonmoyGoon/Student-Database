const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        min: [200000000, "ID should be 9/10 digits and starting with digit 2"],
        max: [3000000000, "ID should be 9/10 digits and starting with digit 2"],
        required: true
    },
    batch: {
        type: Number,
        min: 43,
        max: 47,
        required: true
    },
    dept: {
        type: String,
        enum: ["ye", "fe", "wpe", "ae", "tem", "tfd", "ipe", "tmdm", "dce", "ese"],
        // required: true
    },
    level: {
        type: Number,
        min: 1,
        max: 4,
        required: true
    },
    term: {
        type: Number,
        min: 1,
        max: 2,
        required: true
    },
    email: {
        type: String,
        // required: true
    },
    address: String,
    phone: {
        type: Number,
        min: 1000000000,
        // required: true
    }
})

const Student = new mongoose.model("Student", studentSchema)

module.exports = Student;

// dept,email,address,phone no.