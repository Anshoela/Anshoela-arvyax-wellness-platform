const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const sessionRoutes = require('./routes/sessionRoutes');
const sessionDraftRoutes = require('./routes/sessionRoutes')
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error(err));

app.use(cors());
app.use(express.json());
app.use('/api/sessions', sessionRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/sessions/draft', sessionDraftRoutes);



//Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users',userRoutes);

app.get('/',(req,res)=> {
    res.send('API Is Working');

});

const PORT = process.env.PORT || 5000;
app.listen(PORT,() =>console.log(`Server started on port ${PORT}`));