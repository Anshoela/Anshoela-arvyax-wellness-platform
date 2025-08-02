const mongoose = require('mongoose');

const sessionDraftSchema = new mongoose.Schema({
    title: {type:String},
    desc : {type: String},
    photoName : {trype: String},
    userId : {type:mongoose.Schema.Types.ObjectId,ref:'User', required: true, unique: true },
},{timestamps:true});

module.exports = mongoose.model('SessionDraft',sessionDraftSchema);