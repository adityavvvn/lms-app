const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => Date.now().toString()
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  videoUrl: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Basic YouTube URL validation
        return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(v);
      },
      message: props => `${props.value} is not a valid YouTube URL!`
    }
  },
  order: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { _id: true });

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  text: { type: String, trim: true },
});

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  subcategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true,
  },
  thumbnail: {
    type: String,
    trim: true,
  },
  chapters: [chapterSchema],
  enrolledStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      completedChapters: [{
        type: String
      }],
      lastAccessedChapter: {
        type: String
      },
      lastAccessedAt: {
        type: Date
      }
    }
  }],
  analytics: {
    totalEnrollments: {
      type: Number,
      default: 0
    },
    recentEnrollments: {
      type: Number,
      default: 0
    },
    activeStudents: {
      type: Number,
      default: 0
    },
    averageProgress: {
      type: Number,
      default: 0
    },
    enrollmentHistory: [{
      date: {
        type: Date,
        default: Date.now
      },
      count: {
        type: Number,
        default: 0
      }
    }],
    chapterViews: [{
      chapter: {
        type: String
      },
      views: {
        type: Number,
        default: 0
      },
      lastViewed: {
        type: Date
      }
    }]
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  reviews: [reviewSchema],
});

// Update the updatedAt timestamp before saving
courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add method to calculate course progress for a student
courseSchema.methods.getStudentProgress = function(studentId) {
  const enrollment = this.enrolledStudents.find(e => e.student.toString() === studentId.toString());
  if (!enrollment) return 0;
  
  const totalChapters = this.chapters.length;
  if (totalChapters === 0) return 0;
  
  const completedChapters = enrollment.progress.completedChapters.length;
  return (completedChapters / totalChapters) * 100;
};

// Add method to update course analytics
courseSchema.methods.updateAnalytics = async function() {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Update total enrollments
    this.analytics.totalEnrollments = this.enrolledStudents.length;

    // Update recent enrollments (last 7 days)
    this.analytics.recentEnrollments = this.enrolledStudents.filter(
      enrollment => enrollment.enrolledAt >= sevenDaysAgo
    ).length;

    // Update active students (last 30 days)
    this.analytics.activeStudents = this.enrolledStudents.filter(
      enrollment => enrollment.progress.lastAccessedAt >= thirtyDaysAgo
    ).length;

    // Calculate average progress
    const totalProgress = this.enrolledStudents.reduce((sum, enrollment) => {
      return sum + this.getStudentProgress(enrollment.student);
    }, 0);
    this.analytics.averageProgress = this.enrolledStudents.length > 0
      ? totalProgress / this.enrolledStudents.length
      : 0;

    // Update enrollment history
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const existingHistoryEntry = this.analytics.enrollmentHistory.find(
      entry => entry.date.getTime() === today.getTime()
    );

    if (existingHistoryEntry) {
      existingHistoryEntry.count = this.analytics.totalEnrollments;
    } else {
      this.analytics.enrollmentHistory.push({
        date: today,
        count: this.analytics.totalEnrollments
      });
    }

    // Keep only last 30 days of history
    this.analytics.enrollmentHistory = this.analytics.enrollmentHistory
      .filter(entry => entry.date >= thirtyDaysAgo)
      .sort((a, b) => a.date - b.date);

    await this.save();
    return this.analytics;
  } catch (error) {
    console.error('Error updating course analytics:', error);
    throw error;
  }
};

const Course = mongoose.model('Course', courseSchema);

module.exports = Course; 