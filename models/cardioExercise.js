const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CardioExerciseSchema = new Schema({
  // UserId = MongoDB ObjectId of corresponding User
  UserId: {
    type: String
  },
  ExerciseName: {
    type: String,
    required: true
  },
  CardioTime: {
    type: Number,
    required: false
  }
});

module.exports = CardioExercise = mongoose.model('CardioExercises', CardioExerciseSchema);