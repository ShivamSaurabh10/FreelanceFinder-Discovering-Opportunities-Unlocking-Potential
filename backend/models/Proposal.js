const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverLetter: {
    type: String,
    required: [true, 'Cover letter is required'],
    maxlength: 2000
  },
  bidAmount: {
    type: Number,
    required: [true, 'Bid amount is required'],
    min: 1
  },
  deliveryTime: {
    type: Number, // in days
    required: [true, 'Delivery time is required'],
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  attachments: [{
    name: String,
    url: String
  }],
  milestones: [{
    title: String,
    amount: Number,
    dueDate: Date,
    description: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one proposal per freelancer per job
proposalSchema.index({ job: 1, freelancer: 1 }, { unique: true });

module.exports = mongoose.model('Proposal', proposalSchema);
