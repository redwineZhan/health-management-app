const db = require('../../db/config/database');
const communityPostService = require('../../services/communityPostService');
const communityService = require('../../services/communityService');
const Joi = require('joi');

// Validation schema for community posts
const postSchema = Joi.object({
  communityId: Joi.string().required(),
  title: Joi.string().max(300).optional(),
  content: Joi.string().max(5000).required(),
  postType: Joi.string().valid('discussion', 'achievement', 'challenge', 'resource').default('discussion')
});

const getAllPosts = async (req, res) => {
  try {
    const { communityId } = req.query;
    const userId = req.user.id;

    // Check if user is a member of the community
    if (communityId) {
      const isMember = await communityService.isMember(communityId, userId);
      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: 'You must be a member of the community to view posts'
        });
      }
    }

    const posts = await communityPostService.getAllPosts({ communityId });

    res.status(200).json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await communityPostService.getPostById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is a member of the community that contains the post
    const isMember = await communityService.isMember(post.community_id, userId);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You must be a member of the community to view this post'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Get post by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const createPost = async (req, res) => {
  try {
    // Validate input
    const { error, value } = postSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const userId = req.user.id;
    const postData = {
      ...value,
      authorUserId: userId
    };

    // Check if user is a member of the community
    const isMember = await communityService.isMember(value.communityId, userId);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You must be a member of the community to create a post'
      });
    }

    const newPost = await communityPostService.createPost(postData);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: newPost
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const updatePost = async (req, res) => {
  try {
    // Validate input
    const { error, value } = postSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { id } = req.params;
    const userId = req.user.id;
    const postData = {
      ...value,
      id,
      userId
    };

    const post = await communityPostService.getPostById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is the author of the post
    if (post.author_user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the author can update this post'
      });
    }

    const updatedPost = await communityPostService.updatePost(postData);

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await communityPostService.getPostById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is the author of the post or an admin of the community
    const isAuthor = post.author_user_id === userId;
    const isAdmin = await communityService.isUserAdmin(post.community_id, userId);

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only the author or community admins can delete this post'
      });
    }

    const deleted = await communityPostService.deletePost(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};