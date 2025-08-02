const authMiddleware = require('../middleware/authMiddleware');
const Session = require('../models/Session');

// create a new session
const createSession = async (req, res) => {
  try {
    console.log("req.user:", req.user); 

    const { title, description , name } = req.body;
    const photo = req.file ? req.file.filename : null;

    if (!title || !description || !photo) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized: no user info' });
    }

    const session = new Session({
      title,
      description,
      photo,
      userId: req.user.id,

    });

    await session.save();
    res.status(201).json(session);
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: 'Failed to create session' });
  }
};

// get all sessions of the current user
const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user.id });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};

// update session
const updateSession = async (req, res) => {
  try {
    const { title, description } = req.body;
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (title) session.title = title;
    if (description) session.description = description;
    if (req.file) session.photo = req.file.filename;

    await session.save();
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update session' });
  }
};


module.exports = { createSession, getSessions, updateSession };
