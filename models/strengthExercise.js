const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const StrengthExerciseSchema = new Schema({
  // UserId = MongoDB ObjectId of corresponding User
  UserId: {
    type: String
  },
  ExerciseName: {
    type: String,
    required: true
  },
  LowerRepRange: {
    type: Number,
    required: false
  },
  UpperRepRange: {
    type: Number,
    required: false
  },
  StrengthWeight: {
    type: Number,
    required: false
  },
});

module.exports = StrengthExercise = mongoose.model('StrengthExercises', StrengthExerciseSchema);