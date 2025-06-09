import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [function() {
      return !this.googleId; // Password is required only if not using Google auth
    }, 'Please provide a password'],
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  image: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Delete the model if it exists to prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User; 