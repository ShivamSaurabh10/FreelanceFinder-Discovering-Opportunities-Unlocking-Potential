const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: 5000
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Web Development',
      'Mobile Development',
      'Design & Creative',
      'Writing & Content',
      'Data Science & ML',
      'Digital Marketing',
      'Video & Animation',
      'Finance & Accounting',
      'Customer Support',
      'Other'
    ]
  },
  skills: [{
    type: String,
    trim: true
  }],
  budget: {
    type: {
      type: String,
      enum: ['fixed', 'hourly'],
      default: 'fixed'
    },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 }
  },
  duration: {
    type: String,
    enum: ['less-than-1-month', '1-3-months', '3-6-months', 'more-than-6-months'],
    default: '1-3-months'
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'intermediate', 'expert'],
    default: 'intermediate'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  proposals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal'
  }],
  proposalCount: {
    type: Number,
    default: 0
  },
  attachments: [{
    name: String,
    url: String
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date
  },
  location: {
    type: String,
    default: 'Remote'
  },
  tags: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
jobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Text search index
jobSchema.index({ title: 'text', description: 'text', skills: 'text', tags: 'text' });

module.exports = mongoose.model('Job', jobSchema);
