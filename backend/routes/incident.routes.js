const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const Comment = require('../models/Comment');
const { protect, authorize } = require('../middleware/auth');

// Get all incidents
router.get('/', async (req, res) => {
  try {
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resource
    query = Incident.find(JSON.parse(queryStr)).populate({
      path: 'user',
      select: 'name'
    });
    
    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Incident.countDocuments(JSON.parse(queryStr));
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const incidents = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: incidents.length,
      pagination,
      data: incidents
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get single incident
router.get('/:id', async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id).populate({
      path: 'user',
      select: 'name'
    });
    
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }
    
    res.status(200).json({
      success: true,
      data: incident
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Create new incident
router.post('/', protect, async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;
    
    // Validate based on incident type
    const { type } = req.body;
    
    if (type === 'question' || type === 'other') {
      if (!req.body.title || !req.body.description) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide both a title and description' 
        });
      }
    } else if (type === 'issue') {
      if (!req.body.title || !req.body.timestamp || !req.body.service) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please fill in all required fields for an issue' 
        });
      }
    } else if (type === 'news') {
      if (!req.body.title) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide a headline' 
        });
      }
    } else if (type === 'poll') {
      if (!req.body.question || !req.body.options || req.body.options.some(opt => !opt.trim())) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide a question and at least two options' 
        });
      }
    }
    
    const incident = await Incident.create(req.body);
    
    res.status(201).json({
      success: true,
      data: incident
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update incident
router.put('/:id', protect, async (req, res) => {
  try {
    let incident = await Incident.findById(req.params.id);
    
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }
    
    // Make sure user is incident owner or admin
    if (incident.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this incident' });
    }
    
    // Update timestamp
    req.body.updatedAt = Date.now();
    
    incident = await Incident.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: incident
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Delete incident
router.delete('/:id', protect, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }
    
    // Make sure user is incident owner or admin
    if (incident.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this incident' });
    }
    
    await incident.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get comments for an incident
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ incident: req.params.id }).populate({
      path: 'user',
      select: 'name'
    }).sort('createdAt');
    
    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Add comment to incident
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }
    
    // Add user and incident to req.body
    req.body.user = req.user.id;
    req.body.incident = req.params.id;
    
    const comment = await Comment.create(req.body);
    
    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Vote on a poll option
router.post('/:id/vote', protect, async (req, res) => {
  try {
    const { optionIndex } = req.body;
    
    if (optionIndex === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide an option to vote for' 
      });
    }
    
    const incident = await Incident.findById(req.params.id);
    
    if (!incident) {
      return res.status(404).json({ 
        success: false, 
        message: 'Incident not found' 
      });
    }
    
    if (incident.type !== 'poll') {
      return res.status(400).json({ 
        success: false, 
        message: 'This incident is not a poll' 
      });
    }
    
    if (optionIndex < 0 || optionIndex >= incident.options.length) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid option index' 
      });
    }
    
    // Here you would typically track who voted for what
    // For simplicity, we're just incrementing a vote counter
    incident.votes += 1;
    await incident.save();
    
    res.status(200).json({
      success: true,
      data: incident
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;