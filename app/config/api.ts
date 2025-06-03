/**
 * API configuration for the application
 * Uses environment variables with fallbacks for development
 */

// Base URL for the backend API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1/rehic/member';

// API endpoints
export const API_ENDPOINTS = {
  getMembers: `${API_BASE_URL}/all`,
  getMember: `${API_BASE_URL}`, 
};