const express = require('express');
const router = express.Router();

// @desc    Get departments list
// @route   GET /api/data/departments
// @access  Public
const getDepartments = (req, res) => {
    const departments = [
        "Human Resources",
        "Finance",
        "DevOps",
        "IT Support",
        "Product Management",
        "Quality Assurance",
        "Software Engineering",
        "Business Consulting",
        "Cloud Services",
        "UI/UX",
        "Data & Analytics"
    ];
    res.json(departments);
};

router.get('/departments', getDepartments);

module.exports = router;
