const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  excerpt: {
    type: String,
    maxlength: [200, 'Excerpt cannot be more than 200 characters']
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'published', 'rejected'],
    default: 'draft'
  },
  tags: {
    type: [String],
    required: true
  },
  featuredImage: {
    type: String
  },
  comments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment'
    }
  ],
  publishedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Reverse populate with virtuals
BlogPostSchema.virtual('commentsCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  count: true
});

// Update the updatedAt field before saving
BlogPostSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
BlogPostSchema.index({ 
  title: 'text', 
  content: 'text', 
  tags: 'text' 
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);