const db = require('../db/config/database');

/**
 * Get all community posts
 */
const getAllPosts = async (options = {}) => {
  const { communityId } = options;
  
  let query = `
    SELECT 
      cp.*,
      u.first_name as author_first_name,
      u.last_name as author_last_name,
      c.name as community_name
    FROM community_posts cp
    JOIN users u ON cp.author_user_id = u.id
    JOIN communities c ON cp.community_id = c.id
    WHERE 1=1
  `;
  let queryParams = [];
  let paramIndex = 1;
  
  if (communityId) {
    query += ` AND cp.community_id = $${paramIndex}`;
    queryParams.push(communityId);
    paramIndex++;
  }
  
  query += ` ORDER BY cp.created_at DESC`;
  
  const result = await db.query(query, queryParams);
  return result.rows;
};

/**
 * Get a specific community post by ID
 */
const getPostById = async (id) => {
  const query = `
    SELECT 
      cp.*,
      u.first_name as author_first_name,
      u.last_name as author_last_name,
      c.name as community_name
    FROM community_posts cp
    JOIN users u ON cp.author_user_id = u.id
    JOIN communities c ON cp.community_id = c.id
    WHERE cp.id = $1
  `;
  const result = await db.query(query, [id]);
  return result.rows[0] || null;
};

/**
 * Create a new community post
 */
const createPost = async (postData) => {
  const {
    communityId, title, content, postType, authorUserId
  } = postData;
  
  const query = `
    INSERT INTO community_posts 
    (community_id, author_user_id, title, content, post_type)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  
  const result = await db.query(query, [
    communityId, authorUserId, title, content, postType
  ]);
  
  return result.rows[0];
};

/**
 * Update an existing community post
 */
const updatePost = async (postData) => {
  const {
    id, title, content, postType, userId
  } = postData;
  
  const query = `
    UPDATE community_posts 
    SET title = $1, content = $2, post_type = $3
    WHERE id = $4 AND author_user_id = $5
    RETURNING *
  `;
  
  const result = await db.query(query, [title, content, postType, id, userId]);
  
  return result.rows[0] || null;
};

/**
 * Delete a community post
 */
const deletePost = async (id) => {
  const query = 'DELETE FROM community_posts WHERE id = $1 RETURNING id';
  const result = await db.query(query, [id]);
  return result.rows.length > 0;
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};