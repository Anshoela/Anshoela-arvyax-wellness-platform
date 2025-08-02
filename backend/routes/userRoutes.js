const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware/authMiddleware');


//register user
router.post('/', async(req,res)=>{
    console.log("data recived:",req.body); 
    try{
        const{username, email,password} = req.body;
        const exist = await User.findOne({email});
        if(exist)
            return res.status(400).json({message:"User already Exixst"});

        const round=10;
        const hashpass= await bcrypt.hash(password,round);

        const newUser = new User({ username , email , password:hashpass});
        const saved = await newUser.save();
        res.status(201).json(saved);
    } catch(err)
    {
         console.error('Error saving user:', err.message);
        res.status(400).json({error:err.message});
    }
});

//list of all users
router.get('/',async(req,res) => {
    const users = await User.find();
    res.json(users);
});

router.get('/profile',authMiddleware,async (req,res)=>{
    res.json({message : `WWelcome ${req.user.username}`,userId:req.user.id});
});


//login Route 
router.post('/login', async (req,res) => {
    const {email,password} = req.body;

    try{
        
        const user = await User.findOne({email});
        if(!user)
            return res.status(400).json({message : "Invalid email "});

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) 
            return res.status(400).json({message : 'Invalid  password'});

        const token = jwt.sign(
            {   id:user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            {expiresIn : '1h'}
        );

        res.json({token,username:user.username});  
    }catch(err)
    {
        res.status(500).json({message: err.message});
    }
});
module.exports = router;