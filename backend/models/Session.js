const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  photo: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {type: String , enum: ['draft' ,'published'],deafult: 'published'}
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
