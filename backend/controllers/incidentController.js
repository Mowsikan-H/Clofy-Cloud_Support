const Incident = require('../models/Incident');
const User = require('../models/User');
const mongoose = require('mongoose');

// Helper function to check if a poll has ended
const isPollEnded = (incident) => {
  if (!incident.endDate) return false;
  return new Date() > new Date(incident.endDate);
};

// Get all incidents
exports.getAll = async (req, res) => {
  try {
    const incidents = await Incident.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    // Add hasVoted flag for the current user
    const enhancedIncidents = incidents.map(incident => {
      const incidentObj = incident.toObject();
      
      // Check if current user has voted on this incident
      if (req.user && incident.voters) {
        incidentObj.hasVoted = incident.voters.some(voter => 
          voter.toString() === req.user._id.toString() ||
          (voter.user && voter.user.toString() === req.user._id.toString())
        );
      }
      
      // For polls, check if ended
      if (incident.type === 'poll') {
        incidentObj.isEnded = isPollEnded(incident);
      }
      
      return incidentObj;
    });
    
    return res.json({
      success: true,
      data: enhancedIncidents
    });
  } catch (err) {
    console.error('Error fetching incidents:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get a single incident by ID
exports.getById = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('user', 'name email')
      .populate('comments.user', 'name email')
      .populate('comments.replies.user', 'name email');
    
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }
    
    const incidentObj = incident.toObject();
    
    // Check if current user has voted
    if (req.user && incident.voters) {
      incidentObj.hasVoted = incident.voters.some(voter => {
        if (typeof voter === 'object' && voter.user) {
          return voter.user.toString() === req.user._id.toString();
        }
        return voter.toString() === req.user._id.toString();
      });
      
      // For polls, get which option the user voted for
      if (incident.type === 'poll') {
        const userVote = incident.voters.find(voter => {
          if (typeof voter === 'object' && voter.user) {
            return voter.user.toString() === req.user._id.toString();
          }
          return false;
        });
        
        if (userVote && userVote.optionIndex !== undefined) {
          incidentObj.userVotedOption = userVote.optionIndex;
        }
      }
    }
    
    // For polls, check if ended
    if (incident.type === 'poll') {
      incidentObj.isEnded = isPollEnded(incident);
    }
    
    return res.json({
      success: true,
      data: incidentObj
    });
  } catch (err) {
    console.error('Error fetching incident:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create a new incident
exports.create = async (req, res) => {
  try {
    const { type, title, description, provider, tags, ...typeSpecificData } = req.body;
    
    // Create base incident object
    const incidentData = {
      type,
      title,
      description,
      provider,
      tags: tags || [],
      user: req.user._id
    };
    
    // Add type-specific fields
    if (type === 'issue') {
      const { timestamp, service, urgency, components, category, region } = typeSpecificData;
      Object.assign(incidentData, {
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        service,
        urgency: urgency || 'medium',
        components: components || [],
        category,
        region
      });
    } else if (type === 'poll') {
      const { question, options, duration } = typeSpecificData;
      
      // Format options as objects with text field
      const formattedOptions = options.map(opt => {
        if (typeof opt === 'string') {
          return { text: opt, votes: 0 };
        }
        return { ...opt, votes: 0 };
      });
      
      Object.assign(incidentData, {
        question: question || title,
        options: formattedOptions,
        duration: duration || 7
      });
      
      // Calculate end date
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + parseInt(duration || 7));
      incidentData.endDate = endDate;
    } else if (type === 'news') {
      const { newsDate, sourceUrl, excerpt } = typeSpecificData;
      Object.assign(incidentData, {
        newsDate: newsDate ? new Date(newsDate) : new Date(),
        sourceUrl,
        excerpt
      });
    }
    
    const incident = new Incident(incidentData);
    await incident.save();
    
    return res.status(201).json({
      success: true,
      data: incident
    });
  } catch (err) {
    console.error('Error creating incident:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Server error'
    });
  }
};

// Upvote an incident
exports.upvote = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const incident = await Incident.findById(req.params.id);
    
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }
    
    // Check if user has already voted
    if (incident.voters && incident.voters.some(voter => {
      if (typeof voter === 'object' && voter.user) {
        return voter.user.toString() === req.user._id.toString();
      }
      return voter.toString() === req.user._id.toString();
    })) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted on this incident'
      });
    }
    
    // Add user to voters and increment vote count
    incident.voters.push(req.user._id);
    incident.votes = (incident.votes || 0) + 1;
    
    await incident.save();
    
    return res.json({
      success: true,
      data: {
        votes: incident.votes,
        hasVoted: true
      }
    });
  } catch (err) {
    console.error('Error upvoting incident:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Vote on a poll
exports.vote = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const { optionIndex } = req.body;
    
    if (optionIndex === undefined || optionIndex === null) {
      return res.status(400).json({
        success: false,
        message: 'Option index is required'
      });
    }
    
    const incident = await Incident.findById(req.params.id);
    
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }
    
    if (incident.type !== 'poll') {
      return res.status(400).json({
        success: false,
        message: 'This incident is not a poll'
      });
    }
    
    // Check if poll has ended
    if (isPollEnded(incident)) {
      return res.status(400).json({
        success: false,
        message: 'This poll has ended'
      });
    }
    
    // Check if option index is valid
    if (optionIndex < 0 || optionIndex >= incident.options.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid option index'
      });
    }
    
    // Check if user has already voted
    if (incident.voters && incident.voters.some(voter => {
      if (typeof voter === 'object' && voter.user) {
        return voter.user.toString() === req.user._id.toString();
      }
      return voter.toString() === req.user._id.toString();
    })) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted on this poll'
      });
    }
    
    // Store only the user ID in voters array to match schema expectations
    incident.voters.push(req.user._id);
    
    // Increment vote count for the selected option while preserving the option structure
    if (incident.options[optionIndex]) {
      // Make sure we preserve all existing properties of the option
      incident.options[optionIndex] = {
        ...incident.options[optionIndex].toObject(), // Convert to plain object to avoid Mongoose issues
        votes: (incident.options[optionIndex].votes || 0) + 1
      };
    }
    
    await incident.save();
    
    return res.json({
      success: true,
      data: {
        options: incident.options,
        hasVoted: true,
        userVotedOption: optionIndex
      }
    });
  } catch (err) {
    console.error('Error voting on poll:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get comments for an incident
exports.getComments = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('comments.user', 'name email')
      .populate('comments.replies.user', 'name email');
    
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }
    
    return res.json({
      success: true,
      data: incident.comments || []
    });
  } catch (err) {
    console.error('Error fetching comments:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getUserIncidents = async (req, res) => {
  try {
    // Use the 'user' field instead of 'userId' to match incidents with the user
    const incidents = await Incident.find({ user: req.params.userId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    // Add hasVoted flag for the current user, similar to getAll method
    const enhancedIncidents = incidents.map(incident => {
      const incidentObj = incident.toObject();
      
      // Check if current user has voted on this incident
      if (req.user && incident.voters) {
        incidentObj.hasVoted = incident.voters.some(voter => 
          voter.toString() === req.user._id.toString() ||
          (voter.user && voter.user.toString() === req.user._id.toString())
        );
      }
      
      // For polls, check if ended
      if (incident.type === 'poll') {
        incidentObj.isEnded = isPollEnded(incident);
      }
      
      return incidentObj;
    });
    
    return res.json({
      success: true,
      data: enhancedIncidents
    });
  } catch (err) {
    console.error('Error fetching user incidents:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Add a comment to an incident
exports.addComment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const { text } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }
    
    const incident = await Incident.findById(req.params.id);
    
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }
    
    const comment = {
      text,
      user: req.user._id,
      createdAt: new Date()
    };
    
    incident.comments = incident.comments || [];
    incident.comments.push(comment);
    await incident.save();
    
    // Get the newly added comment with populated user
    const updatedIncident = await Incident.findById(req.params.id)
      .populate('comments.user', 'name email');
    
    const newComment = updatedIncident.comments[updatedIncident.comments.length - 1];
    
    return res.status(201).json({
      success: true,
      data: newComment
    });
  } catch (err) {
    console.error('Error adding comment:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Add a reply to a comment
exports.addReply = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const { text } = req.body;
    const { id, commentId } = req.params;
    
    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Reply text is required'
      });
    }
    
    const incident = await Incident.findById(id);
    
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }
    
    // Find the comment to reply to
    const comment = incident.comments.id(commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    const reply = {
      text,
      user: req.user._id,
      createdAt: new Date()
    };
    
    comment.replies = comment.replies || [];
    comment.replies.push(reply);
    await incident.save();
    
    // Get the newly added reply with populated user
    const updatedIncident = await Incident.findById(id)
      .populate('comments.replies.user', 'name email');
    
    const updatedComment = updatedIncident.comments.id(commentId);
    const newReply = updatedComment.replies[updatedComment.replies.length - 1];
    
    return res.status(201).json({
      success: true,
      data: newReply
    });
  } catch (err) {
    console.error('Error adding reply:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};