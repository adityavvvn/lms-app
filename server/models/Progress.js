const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedChapters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  }],
  lastAccessedChapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure one progress record per user per course
progressSchema.index({ user: 1, course: 1 }, { unique: true });

// Update the updatedAt timestamp before saving
progressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add method to calculate progress percentage
progressSchema.methods.calculateProgress = function(totalChapters) {
  if (!totalChapters) return 0;
  this.progress = (this.completedChapters.length / totalChapters) * 100;
  return this.progress;
};

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress; 