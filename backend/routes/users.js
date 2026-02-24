const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const { protect } = require('../middleware/auth');

// @route GET /api/users/freelancers - Browse freelancers
router.get('/freelancers', async (req, res) => {
  try {
    const { search, skills, experience, minRate, maxRate, page = 1, limit = 10 } = req.query;

    const query = { role: 'freelancer', isActive: true };

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { bio: new RegExp(search, 'i') },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    if (skills) {
      const skillsArray = skills.split(',').map(s => new RegExp(s.trim(), 'i'));
      query.skills = { $in: skillsArray };
    }
    if (experience) query.experience = experience;
    if (minRate) query.hourlyRate = { $gte: Number(minRate) };
    if (maxRate) query.hourlyRate = { ...query.hourlyRate, $lte: Number(maxRate) };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const freelancers = await User.find(query)
      .select('-password -savedJobs')
      .sort('-rating -completedJobs')
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, freelancers, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -savedJobs');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/users/:id/jobs - Get client's posted jobs
router.get('/:id/jobs', async (req, res) => {
  try {
    const jobs = await Job.find({ client: req.params.id })
      .populate('client', 'name avatar')
      .sort('-createdAt')
      .limit(20);
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/users/dashboard/stats - Dashboard stats
router.get('/dashboard/stats', protect, async (req, res) => {
  try {
    const user = req.user;
    let stats = {};

    if (user.role === 'client') {
      const totalJobs = await Job.countDocuments({ client: user._id });
      const openJobs = await Job.countDocuments({ client: user._id, status: 'open' });
      const inProgressJobs = await Job.countDocuments({ client: user._id, status: 'in-progress' });
      const completedJobs = await Job.countDocuments({ client: user._id, status: 'completed' });
      stats = { totalJobs, openJobs, inProgressJobs, completedJobs };
    } else {
      const { Proposal } = require('../models/Proposal');
      stats = {
        completedJobs: user.completedJobs,
        rating: user.rating,
        reviewCount: user.reviewCount
      };
    }

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
