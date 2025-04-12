const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all patients (for doctors)
router.get('/patients', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can access patient list' });
    }
    
    const patients = await User.find({ role: 'patient' })
      .select('_id name username')
      .sort({ name: 1 });
    
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Error fetching patients' });
  }
});

// Get all chats for a user
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    } else {
      query.patient = req.user._id;
    }
    
    const chats = await Chat.find(query)
      .populate('patient', 'name username')
      .populate('doctor', 'name username')
      .populate('messages.sender', 'name username')
      .sort({ lastMessage: -1 });
    
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Error fetching chats' });
  }
});

// Get or create a chat with a specific patient (for doctors)
router.get('/with-patient/:patientId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can access patient chats' });
    }
    
    const patientId = req.params.patientId;
    
    // Check if patient exists
    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Find existing chat or create a new one
    let chat = await Chat.findOne({
      doctor: req.user._id,
      patient: patientId
    }).populate('patient', 'name username')
      .populate('messages.sender', 'name username');
    
    if (!chat) {
      chat = new Chat({
        doctor: req.user._id,
        patient: patientId,
        messages: []
      });
      await chat.save();
      
      // Populate the newly created chat
      chat = await Chat.findById(chat._id)
        .populate('patient', 'name username')
        .populate('messages.sender', 'name username');
    }
    
    res.json(chat);
  } catch (error) {
    console.error('Error getting/creating chat with patient:', error);
    res.status(500).json({ message: 'Error getting/creating chat' });
  }
});

// Get or create a chat with the doctor (for patients)
router.post('/with-doctor', auth, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Only patients can access doctor chats' });
    }
    
    // Find the doctor
    const doctor = await User.findOne({ role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Find existing chat or create a new one
    let chat = await Chat.findOne({
      doctor: doctor._id,
      patient: req.user._id
    }).populate('doctor', 'name username')
      .populate('messages.sender', 'name username');
    
    if (!chat) {
      chat = new Chat({
        doctor: doctor._id,
        patient: req.user._id,
        messages: []
      });
      await chat.save();
      
      // Populate the newly created chat
      chat = await Chat.findById(chat._id)
        .populate('doctor', 'name username')
        .populate('messages.sender', 'name username');
    }
    
    res.json(chat);
  } catch (error) {
    console.error('Error getting/creating chat with doctor:', error);
    res.status(500).json({ message: 'Error getting/creating chat' });
  }
});

// Send a message in a chat
router.post('/:chatId/messages', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const chatId = req.params.chatId;
    
    // Find the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // Check if user is part of the chat
    if (chat.doctor.toString() !== req.user._id.toString() && 
        chat.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not part of this chat' });
    }
    
    // Add the message
    chat.messages.push({
      sender: req.user._id,
      content,
      timestamp: new Date()
    });
    
    // Update lastMessage timestamp
    chat.lastMessage = new Date();
    
    await chat.save();
    
    // Return the updated chat with populated fields
    const updatedChat = await Chat.findById(chatId)
      .populate('doctor', 'name username')
      .populate('patient', 'name username')
      .populate('messages.sender', 'name username');
    
    res.json(updatedChat);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

// Get messages for a specific chat
router.get('/:chatId/messages', auth, async (req, res) => {
  try {
    const chatId = req.params.chatId;
    
    // Find the chat
    const chat = await Chat.findById(chatId)
      .populate('doctor', 'name username')
      .populate('patient', 'name username')
      .populate('messages.sender', 'name username');
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // Check if user is part of the chat
    if (chat.doctor._id.toString() !== req.user._id.toString() && 
        chat.patient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not part of this chat' });
    }
    
    res.json(chat.messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

module.exports = router; 