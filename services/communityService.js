const db = require('../db/config/database');

/**
 * Get all communities
 */
const getAllCommunities = async () => {
  const query = `
    SELECT 
      c.*,
      u.first_name as creator_first_name,
      u.last_name as creator_last_name,
      (SELECT COUNT(*) FROM community_members cm WHERE cm.community_id = c.id AND cm.is_active = true) as current_members
    FROM communities c
    JOIN users u ON c.creator_user_id = u.id
    WHERE c.is_active = true
    ORDER BY c.created_at DESC
  `;
  const result = await db.query(query);
  return result.rows;
};

/**
 * Get a specific community by ID
 */
const getCommunityById = async (id) => {
  const query = `
    SELECT 
      c.*,
      u.first_name as creator_first_name,
      u.last_name as creator_last_name,
      (SELECT COUNT(*) FROM community_members cm WHERE cm.community_id = c.id AND cm.is_active = true) as current_members
    FROM communities c
    JOIN users u ON c.creator_user_id = u.id
    WHERE c.id = $1 AND c.is_active = true
  `;
  const result = await db.query(query, [id]);
  return result.rows[0] || null;
};

/**
 * Create a new community
 */
const createCommunity = async (communityData) => {
  const {
    name, description, creatorUserId, maxMembers, startDate, endDate
  } = communityData;
  
  const query = `
    INSERT INTO communities 
    (name, description, creator_user_id, max_members, start_date, end_date)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  
  const result = await db.query(query, [
    name, description, creatorUserId, maxMembers, startDate, endDate
  ]);
  
  return result.rows[0];
};

/**
 * Update an existing community
 */
const updateCommunity = async (communityData) => {
  const {
    id, name, description, maxMembers, startDate, endDate, userId
  } = communityData;
  
  const query = `
    UPDATE communities 
    SET name = $1, description = $2, max_members = $3, 
        start_date = $4, end_date = $5
    WHERE id = $6 AND creator_user_id = $7
    RETURNING *
  `;
  
  const result = await db.query(query, [
    name, description, maxMembers, startDate, endDate, id, userId
  ]);
  
  return result.rows[0] || null;
};

/**
 * Delete a community
 */
const deleteCommunity = async (id) => {
  // Using soft delete by setting is_active to false
  const query = 'UPDATE communities SET is_active = false WHERE id = $1 RETURNING id';
  const result = await db.query(query, [id]);
  return result.rows.length > 0;
};

/**
 * Add a member to a community
 */
const addMember = async (communityId, userId, role) => {
  const query = `
    INSERT INTO community_members 
    (community_id, user_id, role)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  
  const result = await db.query(query, [communityId, userId, role]);
  return result.rows[0];
};

/**
 * Remove a member from a community
 */
const removeMember = async (communityId, userId) => {
  const query = `
    UPDATE community_members 
    SET is_active = false 
    WHERE community_id = $1 AND user_id = $2
    RETURNING *
  `;
  
  const result = await db.query(query, [communityId, userId]);
  return result.rows[0];
};

/**
 * Check if user is a member of a community
 */
const isMember = async (communityId, userId) => {
  const query = `
    SELECT id 
    FROM community_members 
    WHERE community_id = $1 AND user_id = $2 AND is_active = true
  `;
  const result = await db.query(query, [communityId, userId]);
  return result.rows.length > 0;
};

/**
 * Check if user is an admin of a community
 */
const isUserAdmin = async (communityId, userId) => {
  const query = `
    SELECT id 
    FROM community_members 
    WHERE community_id = $1 AND user_id = $2 AND role IN ('admin', 'moderator') AND is_active = true
  `;
  const result = await db.query(query, [communityId, userId]);
  return result.rows.length > 0;
};

/**
 * Get admin count for a community
 */
const getAdminCount = async (communityId) => {
  const query = `
    SELECT COUNT(*) as count
    FROM community_members 
    WHERE community_id = $1 AND role = 'admin' AND is_active = true
  `;
  const result = await db.query(query, [communityId]);
  return parseInt(result.rows[0].count);
};

module.exports = {
  getAllCommunities,
  getCommunityById,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  addMember,
  removeMember,
  isMember,
  isUserAdmin,
  getAdminCount
};