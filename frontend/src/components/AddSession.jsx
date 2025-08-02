import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AddSession.css';


function AddSession() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [draftTimeout , setDraftTimeout] = useState('null');
  const[status, setStatus] = useState('published');
  const token = localStorage.getItem('token');


  //add A Draft
  useEffect(() => {
    if(draftTimeout) clearTimeout(draftTimeout);

    const timeout = setTimeout(()=>{
      saveDraft();
    },2000);

    setDraftTimeout(timeout);
    return () => clearTimeout(timeout);
  },[title,desc]);

  const saveDraft = async ()=>{
    try{
      await axios.post('http://localhost:5000/api/sessions/draft',{
        title,
        desc,
        photoName : photo?.name || null
      },
    {
      headers:{Authorization: `Bearer ${token}`},
    }
  );
  console.log('Draft auto-saved');
    } catch(error)
    {
      console.error('Draft save failed :', error.response?.data || error.message);
    }
  };


  //load draft on mount
  useEffect(()=>{
    const fetchDraft = async () =>{
      try{
        const res = await axios.get('http://localhost:5000/api/sessions/draft', {
      headers: {
        Authorization: `Bearer ${token}`},
      });

      if(res.data)
      {
        setTitle(res.data.title || '');
        setDesc(res.data.desc || '');
      }
    }catch(error)
    {
      console.error('Failed to load draft:',error.message);
    } 
  };

  fetchDraft()
},[]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!title || !desc || !photo) {
    setMessage("All fields are required.");
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', desc);
  formData.append('photo', photo);
  formData.append('status', status);

  try {
  
    const res = await axios.post('http://localhost:5000/api/sessions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

    setMessage("Session added successfully!");
    setTitle('');
    setDesc('');
    setPhoto(null);
  } catch (err) {
    setMessage("Failed to add session.");
    console.error("Upload error:", err.response?.data || err.message);
  }
};


  return (
    <div className="add-session-container">
  <div className="add-session-bg">

      <h2>Add New Session</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Title:</label><br />
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Description:</label><br />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)}></textarea>
        </div>
        <div>
          <label>Photo:</label><br />
          <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
        </div>
        <div>
  <label>Status:</label><br />
  <select value={status} onChange={(e) => setStatus(e.target.value)}>
    <option value="published">Publish</option>
    <option value="draft">Save as Draft</option>
  </select>
</div>
        <button type="submit">Add Session</button>
      </form>
    </div>
    </div>
  );
}

export default AddSession;
