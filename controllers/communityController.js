const db = require('../../db/config/database');
const communityService = require('../../services/communityService');
const Joi = require('joi');

// Validation schema for communities
const communitySchema = Joi.object({
  name: Joi.string().max(200).required(),
  description: Joi.string().max(1000).optional(),
  maxMembers: Joi.number().integer().min(5).max(1000).default(50),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional()
});

// Validation schema for community posts
const postSchema = Joi.object({
  title: Joi.string().max(300).optional(),
  content: Joi.string().max(5000).required(),
  postType: Joi.string().valid('discussion', 'achievement', 'challenge', 'resource').default('discussion')
});

const getAllCommunities = async (req, res) => {
  try {
    const communities = await communityService.getAllCommunities();

    res.status(200).json({
      success: true,
      data: communities
    });
  } catch (error) {
    console.error('Get communities error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getCommunityById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const community = await communityService.getCommunityById(id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    res.status(200).json({
      success: true,
      data: community
    });
  } catch (error) {
    console.error('Get community by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const createCommunity = async (req, res) => {
  try {
    // Validate input
    const { error, value } = communitySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const userId = req.user.id;
    const communityData = {
      ...value,
      creatorUserId: userId
    };

    const newCommunity = await communityService.createCommunity(communityData);

    // Add creator as admin member
    await communityService.addMember(newCommunity.id, userId, 'admin');

    res.status(201).json({
      success: true,
      message: 'Community created successfully',
      data: newCommunity
    });
  } catch (error) {
    console.error('Create community error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const updateCommunity = async (req, res) => {
  try {
    // Validate input
    const { error, value } = communitySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { id } = req.params;
    const userId = req.user.id;
    const communityData = {
      ...value,
      id,
      userId
    };

    // Check if user is admin of the community
    const isAdmin = await communityService.isUserAdmin(id, userId);
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update community details'
      });
    }

    const updatedCommunity = await communityService.updateCommunity(communityData);

    if (!updatedCommunity) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Community updated successfully',
      data: updatedCommunity
    });
  } catch (error) {
    console.error('Update community error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const deleteCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user is admin of the community
    const isAdmin = await communityService.isUserAdmin(id, userId);
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete communities'
      });
    }

    const deleted = await communityService.deleteCommunity(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Community deleted successfully'
    });
  } catch (error) {
    console.error('Delete community error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const joinCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if community exists and has space
    const community = await communityService.getCommunityById(id);
    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    if (community.currentMembers >= community.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'Community is full'
      });
    }

    // Check if user is already a member
    const isMember = await communityService.isMember(id, userId);
    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'Already a member of this community'
      });
    }

    const result = await communityService.addMember(id, userId, 'member');

    res.status(200).json({
      success: true,
      message: 'Joined community successfully',
      data: result
    });
  } catch (error) {
    console.error('Join community error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const leaveCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user is a member
    const isMember = await communityService.isMember(id, userId);
    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: 'Not a member of this community'
      });
    }

    // Don't allow admins to leave if they're the only admin
    const isAdmin = await communityService.isUserAdmin(id, userId);
    if (isAdmin) {
      const adminCount = await communityService.getAdminCount(id);
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot leave community as you are the only admin. Transfer admin rights first.'
        });
      }
    }

    const result = await communityService.removeMember(id, userId);

    res.status(200).json({
      success: true,
      message: 'Left community successfully',
      data: result
    });
  } catch (error) {
    console.error('Leave community error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllCommunities,
  getCommunityById,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity
};