const express = require('express');
const router = express.Router();
const { createSession, getSessions ,updateSession } = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');
const Session = require('../models/Session'); 
const SessionDraft= require('../models/SessionDraft');

const upload = require('../middleware/upload'); 
router.put('/:id', authMiddleware, upload.single('photo'), updateSession);

//protected route
router.get('/my-sessions', authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.id });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch sessions' });
  }
});


//update a session
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) return res.status(404).json({ message: 'Session not found' });

    
    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to edit this session' });
    }
    session.title = req.body.title || session.title;
    session.content = req.body.content || session.content;

    const updated = await session.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating session' });
  }
});

//delete a session
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this session' });
    }

    await session.deleteOne();
    res.json({ message: 'Session deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting session' });
  }
});

// create new session
router.post('/', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const photo = req.file?.filename || null;

    const session = new Session({
      title,
      description,
      photo,
      userId: req.user.id,
      status: status || 'published',
    });

    await session.save();
    res.status(201).json({ message: 'Session created successfully', session });
  } catch (err) {
    res.status(500).json({ message: 'Error creating session', error: err.message });
  }
});


//get session
router.get('/', async (req, res) => {
  try {
    const status = req.query.status || 'published';  
    const sessions = await Session.find({ status });
    const updatedSessions = sessions.map(session => ({
      ...session._doc,
      photo: `${req.protocol}://${req.get('host')}/uploads/${session.photo}`
    }));
    res.json(updatedSessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

//save draft 
router.post('/draft',authMiddleware,async(req,res)=>{
  const {title , desc , photoName } = req.body;

  try{
    const existing = await SessionDraft.findOne({ userId : req.user.id});

    if(existing)
    {
      existing.title = title;
      existing.desc = desc;
      existing.photoName = photoName;
      existing.updatedAt = new Date();
      await existing.save();
      return res.json(existing);
    }
    const draft = new SessionDraft({
      userId: req.user.id,
      title,
      desc,
      photoName,
    });
    await draft.save();
    res.json(draft);
  }catch(err)
  {
    console.error('Draft save error:' , err);
    res.status(500).json({error:'Failed to save draft'});
  }
});

//get Draft
router.get('/draft',authMiddleware, async(req,res)=>{
  try{
    const draft = await SessionDraft.findOne({userId : req.user.id});
    if(!draft) 
      return res.status(204).send();
    res.json(draft);
  } catch(err)
  {
    res.status(500).json({error: 'Failed to load draft'});
  }
});

//changing draft to publish or publish to draft
router.patch('/:id/status', authMiddleware,async(req,res)=>
{
  try{
    const session = await Session.findOne({_id: req.params.id , userId: req.user.id});
    if(!session) 
      return res.status(404).json({message: 'Session not found'});

    session.status = session.status === 'draft' ? 'published' : 'draft';
    await session.save();

    res.json({ message: 'Status updated' , status:session.status});
  }catch(err)
  {
    res.status(500).json({message: 'Failed to update status' , error:err.message});
  }
});

module.exports = router;