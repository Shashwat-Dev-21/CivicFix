const mongoose = require('mongoose');
const validator = require('validator');



const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      enum: ['pothole', 'garbage', 'streetlight', 'water', 'other'],
      required: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    status: {
      type: String,
      enum: ['reported', 'acknowledged', 'in-progress', 'resolved'],
      default: 'reported',
    },
    imageUrl: {
      type: String,
      default: '',
      validate: {
        validator: function (value) {
          return value === '' || validator.isURL(value);
        },
        message: 'Image URL must be a valid URL',
      },
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Issue', issueSchema);