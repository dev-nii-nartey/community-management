/**
 * API configuration for the application
 * Uses environment variables with fallbacks for development
 */

// Base URL for the backend API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// API endpoints
export const API_ENDPOINTS = {
  members: `${API_BASE_URL}/api/v1/rehic/members`,
  member: `${API_BASE_URL}/api/v1/rehic/member`,
};