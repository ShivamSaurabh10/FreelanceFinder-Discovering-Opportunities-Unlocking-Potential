const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Proposal = require('../models/Proposal');
const { protect, authorize } = require('../middleware/auth');

// @route GET /api/jobs - Get all jobs with filters
router.get('/', async (req, res) => {
  try {
    const {
      search, category, budget_min, budget_max, experience,
      duration, location, page = 1, limit = 10, sort = '-createdAt'
    } = req.query;

    const query = { status: 'open' };

    if (search) {
      query.$text = { $search: search };
    }
    if (category && category !== 'all') query.category = category;
    if (experience) query.experienceLevel = experience;
    if (duration) query.duration = duration;
    if (location) query.location = new RegExp(location, 'i');
    if (budget_min || budget_max) {
      query['budget.min'] = {};
      if (budget_min) query['budget.min'].$gte = Number(budget_min);
      if (budget_max) query['budget.max'] = { $lte: Number(budget_max) };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('client', 'name avatar rating reviewCount location isVerified')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      jobs,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/jobs/featured
router.get('/featured', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open', isFeatured: true })
      .populate('client', 'name avatar rating isVerified')
      .sort('-createdAt')
      .limit(6);
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('client', 'name avatar bio rating reviewCount location isVerified completedJobs createdAt');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/jobs - Create job (clients only)
router.post('/', protect, authorize('client', 'admin'), async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, client: req.user._id });
    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT /api/jobs/:id
router.put('/:id', protect, async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route DELETE /api/jobs/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await job.deleteOne();
    await Proposal.deleteMany({ job: req.params.id });
    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/jobs/:id/save
router.post('/:id/save', protect, async (req, res) => {
  try {
    const user = req.user;
    const jobId = req.params.id;
    const isSaved = user.savedJobs.includes(jobId);

    if (isSaved) {
      user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    } else {
      user.savedJobs.push(jobId);
    }
    await user.save();
    res.json({ success: true, saved: !isSaved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
