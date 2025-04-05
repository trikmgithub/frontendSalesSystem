// src/services/quizAxios.js
import * as axiosConfig from '~/utils/axiosConfig';

/**
 * Get all quiz questions
 * @returns {Promise} API response with all quiz questions
 */
const getQuestionsAxios = async () => {
  try {
    const response = await axiosConfig.get('skin-quiz/questions');
    return response;
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return {
      error: true,
      message: error.response?.data?.message || error.message || 'Failed to fetch quiz questions',
      status: error.response?.status
    };
  }
};

/**
 * Create a new quiz question
 * @param {Object} questionData - Question data including questionId, questionText, options, and isActive
 * @returns {Promise} API response
 */
const createQuestionAxios = async (questionData) => {
  try {
    // Format the data to match API expectations
    const formattedData = {
      questionId: questionData.questionId,
      questionText: questionData.questionText,
      options: questionData.options.map(opt => ({
        text: opt.text,
        points: opt.points || 1,
        skinType: opt.skinType
      })),
      // Include isActive field
      isActive: questionData.isActive !== undefined ? questionData.isActive : true,
      // Add order as a custom property if needed
      ...(questionData.order ? { order: questionData.order } : {}),
    };

    const response = await axiosConfig.post('skin-quiz/questions', formattedData);
    return response;
  } catch (error) {
    console.error('Error creating quiz question:', error);
    return {
      error: true,
      message: error.response?.data?.message || error.message || 'Failed to create quiz question',
      status: error.response?.status
    };
  }
};

/**
 * Update an existing quiz question
 * @param {string} questionId - ID of the question to update
 * @param {Object} questionData - Updated question data including isActive status
 * @returns {Promise} API response
 */
const updateQuestionAxios = async (questionId, questionData) => {
  try {
    // Format the data to match API expectations for PUT
    const formattedData = {
      questionId: questionData.questionId,  // Include questionId in the body
      questionText: questionData.questionText,
      options: questionData.options.map(opt => ({
        text: opt.text,
        points: parseInt(opt.points) || 1,
        skinType: opt.skinType
      })),
      // Include isActive field
      isActive: questionData.isActive !== undefined ? questionData.isActive : true,
      // Add order as a custom property if needed
      ...(questionData.order ? { order: questionData.order } : {}),
    };

    // Change to PUT method
    const response = await axiosConfig.put(`skin-quiz/questions/${questionId}`, formattedData);
    return response;
  } catch (error) {
    console.error('Error updating quiz question:', error);
    return {
      error: true,
      message: error.response?.data?.message || error.message || 'Failed to update quiz question',
      status: error.response?.status
    };
  }
};

/**
 * Delete a quiz question
 * @param {string} questionId - ID of the question to delete
 * @returns {Promise} API response
 */
const deleteQuestionAxios = async (questionId) => {
  try {
    const response = await axiosConfig.del(`skin-quiz/questions/${questionId}`);
    return response;
  } catch (error) {
    console.error('Error deleting quiz question:', error);
    return {
      error: true,
      message: error.response?.data?.message || error.message || 'Failed to delete quiz question',
      status: error.response?.status
    };
  }
};

/**
 * Get all skin types
 * @returns {Promise} API response with all skin types
 */
const getSkinTypesAxios = async () => {
  try {
    const response = await axiosConfig.get('skin-quiz/skin-types');
    return response;
  } catch (error) {
    console.error('Error fetching skin types:', error);
    return {
      error: true,
      message: error.response?.data?.message || error.message || 'Failed to fetch skin types',
      status: error.response?.status
    };
  }
};

/**
 * Get a specific skin type
 * @param {string} type - Skin type code
 * @returns {Promise} API response with skin type details
 */
const getSkinTypeDetailsAxios = async (type) => {
  try {
    const response = await axiosConfig.get(`skin-quiz/skin-types/${type}`);
    return response;
  } catch (error) {
    console.error(`Error fetching skin type details for ${type}:`, error);
    return {
      error: true,
      message: error.response?.data?.message || error.message || 'Failed to fetch skin type details',
      status: error.response?.status
    };
  }
};

/**
 * Create a new skin type
 * @param {Object} skinTypeData - Skin type data with skinType, description and recommendations
 * @returns {Promise} API response
 */
const createSkinTypeAxios = async (skinTypeData) => {
  try {
    const formattedData = {
      skinType: skinTypeData.skinType,
      description: skinTypeData.description,
      recommendations: skinTypeData.recommendations || []
    };

    const response = await axiosConfig.post('skin-quiz/skin-types', formattedData);
    return response;
  } catch (error) {
    console.error('Error creating skin type:', error);
    return {
      error: true,
      message: error.response?.data?.message || error.message || 'Failed to create skin type',
      status: error.response?.status
    };
  }
};

/**
 * Update an existing skin type
 * @param {string} skinTypeCode - Skin type code to update
 * @param {Object} skinTypeData - Updated skin type data
 * @returns {Promise} API response
 */
const updateSkinTypeAxios = async (skinTypeCode, skinTypeData) => {
  try {
    const formattedData = {
      description: skinTypeData.description,
      recommendations: skinTypeData.recommendations || []
    };

    const response = await axiosConfig.patch(`skin-quiz/skin-types/${skinTypeCode}`, formattedData);
    return response;
  } catch (error) {
    console.error('Error updating skin type:', error);
    return {
      error: true,
      message: error.response?.data?.message || error.message || 'Failed to update skin type',
      status: error.response?.status
    };
  }
};

/**
 * Get quiz history for a user
 * @param {string} userId - User ID
 * @returns {Promise} API response with user's quiz history
 */
const getQuizHistoryAxios = async (userId) => {
  try {
    const response = await axiosConfig.get(`skin-quiz/history/${userId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching quiz history for user ${userId}:`, error);
    return {
      error: true,
      message: error.response?.data?.message || error.message || 'Failed to fetch quiz history',
      status: error.response?.status
    };
  }
};

/**
 * Submit quiz answers
 * @param {Object} quizData - Quiz submission data with userId and answers
 * @returns {Promise} API response
 */
const submitQuizAxios = async (quizData) => {
  try {
    const response = await axiosConfig.post('skin-quiz/submit', quizData);
    return response;
  } catch (error) {
    console.error('Error submitting quiz answers:', error);
    return {
      error: true,
      message: error.response?.data?.message || error.message || 'Failed to submit quiz answers',
      status: error.response?.status
    };
  }
};

export {
  getQuestionsAxios,
  createQuestionAxios,
  updateQuestionAxios,
  deleteQuestionAxios,
  getSkinTypesAxios,
  getSkinTypeDetailsAxios,
  createSkinTypeAxios,
  updateSkinTypeAxios,
  getQuizHistoryAxios,
  submitQuizAxios
};