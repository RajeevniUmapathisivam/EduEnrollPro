const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  code: String,             // e.g., IT2212
  name: String,             // e.g., Management Information Systems
  faculty: String,          // e.g., Applied Science
  program: String,          // e.g., BSc (Hons) Computer Science
});

module.exports = mongoose.model('Course', CourseSchema);
