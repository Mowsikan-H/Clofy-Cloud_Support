const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const { protect, authorize } = require('../middleware/auth'); // Import authorize

// Get all incidents
router.get('/', incidentController.getAll);

// Get a single incident
router.get('/:id', incidentController.getById);

// Create a new incident
router.post('/', protect, incidentController.create);

// Upvote an incident
router.post('/:id/upvote', protect, incidentController.upvote);

// Vote on a poll
router.post('/:id/vote', protect, incidentController.vote);

router.delete('/:id/vote', protect, incidentController.removeVote);

// Get comments for an incident
router.get('/:id/comments', incidentController.getComments);

// Add a comment to an incident
router.post('/:id/comments', protect, incidentController.addComment);

// Add a reply to a comment
router.post('/:id/comments/:commentId/replies', protect, incidentController.addReply);

router.get('/user/:userId', incidentController.getUserIncidents);

// Add a new route to get the total incident count
router.get('/count', incidentController.getIncidentCount);

// Add DELETE routes for admin
// Admin can delete any incident
// router.delete('/:id', protect, authorize('admin'), incidentController.deleteIncident); // Original line
router.delete('/:id', protect, incidentController.deleteIncident);
router.delete('/:id', protect, authorize('admin'), incidentController.deleteIncident);
// Allow incident owner OR admin to delete
router.delete('/:id', protect, incidentController.deleteIncident);

// Admin can delete any comment
// Allow comment owner or admin to delete comment
router.delete('/:incidentId/comments/:commentId', protect, incidentController.deleteComment);

// Allow reply owner or admin to delete reply
router.delete('/:incidentId/comments/:commentId/replies/:replyId', protect, incidentController.deleteReply);

module.exports = router;