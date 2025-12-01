const express = require('express');
const router = express.Router();

const departments = ["Human Resources", "Finance", "DevOps", "IT Support", "Product Management", "Quality Assurance", "Software Engineering", "Business Consulting", "Cloud Services", "UI/UX", "Data & Analytics"]
router.get('/departments', (req, res) => {
    res.status(200).json(departments)
});

module.exports = router;
