# Contact API Documentation

**Version:** 1.0.0  
**Last Updated:** 2025-12-17  
**Status:** Active

## Overview

The Contact API handles public contact form submissions and admin management of contact submissions. All endpoints support rate limiting and validation.

## Endpoints

### POST `/api/v1/contact`

Submit a new contact form submission (public endpoint).

**Rate Limit:** 5 requests per 15 minutes per IP address

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",  // Optional
  "subject": "Project inquiry",  // Optional
  "message": "I'm interested in working with you..."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "subject": "Project inquiry",
    "message": "I'm interested in working with you...",
    "status": "new",
    "createdAt": "2025-12-17T10:00:00.000Z",
    "updatedAt": "2025-12-17T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request body or validation errors
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### GET `/api/v1/contact`

List contact submissions (admin only, requires authentication).

**Query Parameters:**
- `status` (optional): Filter by status (`new`, `in_progress`, `resolved`, `archived`)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "clx1234567890",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "subject": "Project inquiry",
        "message": "I'm interested in working with you...",
        "status": "new",
        "createdAt": "2025-12-17T10:00:00.000Z",
        "updatedAt": "2025-12-17T10:00:00.000Z"
      }
    ]
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `400 Bad Request`: Invalid status filter
- `500 Internal Server Error`: Server error

### PATCH `/api/v1/contact/[id]`

Update a contact submission status (admin only, requires authentication).

**Request Body:**
```json
{
  "status": "in_progress"  // One of: "new", "in_progress", "resolved", "archived"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "clx1234567890",
      "status": "in_progress",
      // ... other fields
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Submission not found
- `400 Bad Request`: Invalid status value
- `500 Internal Server Error`: Server error

### DELETE `/api/v1/contact/[id]`

Delete a contact submission (admin only, requires authentication).

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "success": true
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Submission not found
- `500 Internal Server Error`: Server error

## Status Values

- `new`: Newly submitted, not yet reviewed
- `in_progress`: Being actively handled
- `resolved`: Issue resolved or inquiry handled
- `archived`: Archived for record-keeping

## Rate Limiting

Public submissions are rate-limited to prevent spam:
- **Limit:** 5 requests per 15 minutes
- **Key:** Based on IP address (uses `x-forwarded-for`, `x-real-ip`, `cf-connecting-ip`, or `x-client-ip` headers)
- **Response:** `429 Too Many Requests` when limit exceeded

## Validation

All submissions are validated using Zod schemas:
- `name`: Required, string, min 1 character
- `email`: Required, valid email format
- `phone`: Optional, string
- `subject`: Optional, string
- `message`: Required, string, min 10 characters

## Analytics

Contact form submissions are tracked via analytics events:
- Event name: `contact_form_submission`
- Properties: `{ name, email, subject }` (privacy-conscious, excludes message content)

