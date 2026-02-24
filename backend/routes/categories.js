const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// @route GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Job.aggregate([
      { $match: { status: 'open' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const allCategories = [
      'Web Development', 'Mobile Development', 'Design & Creative',
      'Writing & Content', 'Data Science & ML', 'Digital Marketing',
      'Video & Animation', 'Finance & Accounting', 'Customer Support', 'Other'
    ];

    const result = allCategories.map(cat => ({
      name: cat,
      count: categories.find(c => c._id === cat)?.count || 0
    }));

    res.json({ success: true, categories: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
