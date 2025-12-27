/**
 * Route Constants
 * 
 * Single source of truth for all application routes.
 * Import these constants instead of hardcoding paths.
 */

export const ROUTES = {
  HOME: '/home',
  PORTFOLIO: '/portfolio',
  SERVICES: '/services',
  BLOGS: '/blogs',
  ROOT: '/',
} as const;

export const API_ROUTES = {
  V1: {
    BASE: '/api/v1',
    // Add API routes here as they are created
    // USERS: '/api/v1/users',
    // CONTACT: '/api/v1/contact',
  },
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];
