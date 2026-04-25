const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const User = require('../models/User');
const Course = require('../models/Course');
const sendEmail = require('../utils/sendEmail');


// ==========================
// CREATE REGISTRATION
// ==========================
router.post('/', async (req, res) => {
  const { studentId, courseId } = req.body;

  try {
    // ✅ Validate input
    if (!studentId || !courseId) {
      return res.status(400).json({ msg: 'Student ID and Course ID required' });
    }

    // ✅ Check valid student
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(400).json({ msg: 'Invalid student ID' });
    }

    // ✅ Check valid course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({ msg: 'Invalid course ID' });
    }

    // ✅ Prevent duplicate
    const existing = await Registration.findOne({ studentId, courseId });
    if (existing) {
      return res.status(400).json({ msg: 'Already registered' });
    }

    // ✅ Save registration
    const reg = new Registration({ studentId, courseId });
    await reg.save();

    // ✅ Send email safely
    const studentEmail = student.email;
    const studentName = student.name || 'Student';
    const courseName = course.name || 'your course';

    const message = `Hi ${studentName},

You have successfully submitted your registration for "${courseName}".
Status: PENDING approval by admin.

We will notify you once your registration is reviewed.

Regards,
Course Registration System`;

    try {
      if (studentEmail) {
        await sendEmail(studentEmail, 'Course Registration Received', message);
      } else {
        console.warn("⚠️ No email found, skipping email");
      }
    } catch (emailErr) {
      console.error("❌ Email failed:", emailErr.message);
    }

    res.json({ msg: 'Registration submitted', reg });

  } catch (err) {
    console.error('❌ Error during registration:', err.message);
    res.status(500).json({ msg: err.message });
  }
});


// ==========================
// GET STUDENT REGISTRATIONS
// ==========================
router.get('/:studentId', async (req, res) => {
  try {
    const registrations = await Registration.find({
      studentId: req.params.studentId
    }).populate('courseId');

    res.json(registrations);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// ==========================
// GET ALL REGISTRATIONS
// ==========================
router.get('/', async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('courseId')
      .populate('studentId');

    res.json(registrations);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// ==========================
// UPDATE STATUS (ADMIN)
// ==========================
router.patch('/:id', async (req, res) => {
  const { status } = req.body;

  try {
    // ✅ Validate status
    if (!status) {
      return res.status(400).json({ msg: 'Status is required' });
    }

    const reg = await Registration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('studentId')
      .populate('courseId');

    if (!reg) {
      return res.status(404).json({ msg: 'Registration not found' });
    }

    console.log("UPDATED REG:", reg);

    // ✅ Safe access
    const studentEmail = reg?.studentId?.email;
    const studentName = reg?.studentId?.name || 'Student';
    const courseName = reg?.courseId?.name || 'a course';

    // ⚠️ If student missing → DO NOT FAIL
    if (!studentEmail) {
      console.warn("⚠️ Student email missing → skipping email");
      return res.json({
        msg: `Registration ${status} (email skipped)`,
        reg
      });
    }

    const message = `Hi ${studentName},

Your registration for "${courseName}" has been updated to: ${status.toUpperCase()}.

Regards,
Admin`;

    try {
      await sendEmail(studentEmail, 'Course Registration Status Update', message);
    } catch (emailErr) {
      console.error("❌ Email failed:", emailErr.message);
    }

    res.json({ msg: `Registration ${status}`, reg });

  } catch (err) {
    console.error('❌ Error updating registration:', err.message);
    res.status(500).json({ msg: err.message });
  }
});


// ==========================
// STATS: COURSE COUNTS
// ==========================
router.get('/stats/course-counts', async (req, res) => {
  try {
    const result = await Registration.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'courseId',
          foreignField: '_id',
          as: 'course'
        }
      },
      { $unwind: '$course' },
      {
        $group: {
          _id: '$course.name',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(result);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// ==========================
// STATS: FACULTY
// ==========================
router.get('/stats/faculty-distribution', async (req, res) => {
  try {
    const result = await Registration.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'courseId',
          foreignField: '_id',
          as: 'course'
        }
      },
      { $unwind: '$course' },
      {
        $group: {
          _id: '$course.faculty',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(result);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// ==========================
// STATS: YEARLY
// ==========================
router.get('/stats/yearly-trends', async (req, res) => {
  try {
    const result = await Registration.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(result);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


module.exports = router;