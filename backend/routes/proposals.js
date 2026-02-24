const express = require('express');
const router = express.Router();
const Proposal = require('../models/Proposal');
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');

// @route GET /api/proposals/job/:jobId - Get proposals for a job (client only)
router.get('/job/:jobId', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const proposals = await Proposal.find({ job: req.params.jobId })
      .populate('freelancer', 'name avatar bio skills rating reviewCount completedJobs experience location')
      .sort('-createdAt');

    res.json({ success: true, proposals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/proposals/my - Get current user's proposals
router.get('/my', protect, async (req, res) => {
  try {
    const proposals = await Proposal.find({ freelancer: req.user._id })
      .populate('job', 'title status budget category client')
      .populate('job.client', 'name')
      .sort('-createdAt');
    res.json({ success: true, proposals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/proposals - Submit proposal
router.post('/', protect, authorize('freelancer'), async (req, res) => {
  try {
    const { jobId, coverLetter, bidAmount, deliveryTime, milestones } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.status !== 'open') return res.status(400).json({ success: false, message: 'Job is not accepting proposals' });

    const existing = await Proposal.findOne({ job: jobId, freelancer: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'You already submitted a proposal' });

    const proposal = await Proposal.create({
      job: jobId,
      freelancer: req.user._id,
      coverLetter,
      bidAmount,
      deliveryTime,
      milestones
    });

    await Job.findByIdAndUpdate(jobId, { $push: { proposals: proposal._id }, $inc: { proposalCount: 1 } });

    const populated = await proposal.populate('freelancer', 'name avatar skills rating');
    res.status(201).json({ success: true, proposal: populated });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You already submitted a proposal' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT /api/proposals/:id/status - Accept/Reject proposal
router.put('/:id/status', protect, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('job');
    if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found' });

    if (proposal.job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    proposal.status = req.body.status;
    await proposal.save();

    if (req.body.status === 'accepted') {
      await Job.findByIdAndUpdate(proposal.job._id, { status: 'in-progress' });
    }

    res.json({ success: true, proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route DELETE /api/proposals/:id - Withdraw proposal
router.delete('/:id', protect, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found' });

    if (proposal.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await proposal.deleteOne();
    await Job.findByIdAndUpdate(proposal.job, { $pull: { proposals: proposal._id }, $inc: { proposalCount: -1 } });

    res.json({ success: true, message: 'Proposal withdrawn' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
