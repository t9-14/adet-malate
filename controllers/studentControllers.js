const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAllStudent = async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT student_id, lname_e, fname_e, mname_e, user_id, course_id, created_at, updated_at FROM student'); // Fix: added missing comma
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT student_id, lname_e, fname_e, mname_e, user_id, course_id, created_at, updated_at FROM student WHERE student_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createStudent = async (req, res) => {
  const { lname_e, fname_e, mname_e, user_id, course_id } = req.body; 

  try {
    const [result] = await pool.query('INSERT INTO student (lname_e, fname_e, mname_e, user_id, course_id) VALUES (?, ?, ?, ?, ?)', [lname_e, fname_e, mname_e, user_id, course_id]); // Fix: added course_id
    res.status(201).json({ message: 'Student Successfully Registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { lname_e, fname_e, mname_e } = req.body;

  try {
    const [result] = await pool.query('UPDATE student SET lname_e = ?, fname_e = ?, mname_e = ? WHERE student_id = ?', [lname_e, fname_e, mname_e, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Changes Successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM student WHERE student_id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student Removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllStudent, getStudentById, createStudent, updateStudent, deleteStudent };
