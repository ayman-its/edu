# Endpoint Testing Guide

## New Endpoints Added

### Articles Endpoints

1. **GET /api/articles/articles** - Get all articles
   - Already existed ✅
   - Returns all articles with category information

2. **GET /api/articles/articles/category/:categoryId** - Get articles by category ID
   - ✅ NEW ENDPOINT
   - Returns articles filtered by category ID
   - Includes category information in response

### Courses Endpoints

1. **GET /api/course/courses** - Get all courses
   - Already existed ✅
   - Returns all courses with group and instructor information

2. **GET /api/course/courses/group/:groupId** - Get courses by group ID
   - ✅ NEW ENDPOINT
   - Returns courses filtered by group ID
   - Includes group and instructor information in response

## Testing Instructions

### Prerequisites
1. Start the server:
   ```bash
   npm run dev
   # or
   node server.js
   ```
   Server runs on port 5000 by default.

### Test with cURL

#### Articles Endpoints

```bash
# 1. Get all articles
curl http://localhost:5000/api/articles/articles

# 2. Get articles by category ID (replace CATEGORY_ID with actual ID)
curl http://localhost:5000/api/articles/articles/category/CATEGORY_ID

# Example with invalid ID (should return 404)
curl http://localhost:5000/api/articles/articles/category/invalid-id-12345
```

#### Courses Endpoints

```bash
# 1. Get all courses
curl http://localhost:5000/api/course/courses

# 2. Get courses by group ID (replace GROUP_ID with actual ID)
curl http://localhost:5000/api/course/courses/group/GROUP_ID

# Example with invalid ID (should return 404)
curl http://localhost:5000/api/course/courses/group/invalid-id-12345
```

### Test with PowerShell

```powershell
# Get all articles
Invoke-RestMethod -Uri "http://localhost:5000/api/articles/articles" -Method GET

# Get articles by category (replace CATEGORY_ID)
Invoke-RestMethod -Uri "http://localhost:5000/api/articles/articles/category/CATEGORY_ID" -Method GET

# Get all courses
Invoke-RestMethod -Uri "http://localhost:5000/api/course/courses" -Method GET

# Get courses by group (replace GROUP_ID)
Invoke-RestMethod -Uri "http://localhost:5000/api/course/courses/group/GROUP_ID" -Method GET
```

### Test with Browser or Postman

1. **Get all articles**: `GET http://localhost:5000/api/articles/articles`
2. **Get articles by category**: `GET http://localhost:5000/api/articles/articles/category/{categoryId}`
3. **Get all courses**: `GET http://localhost:5000/api/course/courses`
4. **Get courses by group**: `GET http://localhost:5000/api/course/courses/group/{groupId}`

## Expected Responses

### Get Articles by Category - Success (200)
```json
{
  "message": "Articles fetched successfully",
  "data": [
    {
      "id": "...",
      "title": "...",
      "content": "...",
      "imageUrl": "...",
      "categoryArticleId": "...",
      "categoryArticle": {
        "id": "...",
        "name": "..."
      }
    }
  ],
  "category": {
    "id": "...",
    "name": "..."
  }
}
```

### Get Articles by Category - Not Found (404)
```json
{
  "message": "Category not found"
}
```

### Get Courses by Group - Success (200)
```json
{
  "message": "Courses fetched successfully",
  "data": [
    {
      "id": "...",
      "title": "...",
      "groupId": "...",
      "instructorId": "...",
      "group": {
        "id": "...",
        "title": "..."
      },
      "instructor": {
        "id": "...",
        "name": "..."
      }
    }
  ],
  "group": {
    "id": "...",
    "title": "...",
    "instructor": {
      "id": "...",
      "name": "..."
    }
  }
}
```

### Get Courses by Group - Not Found (404)
```json
{
  "message": "Course group not found"
}
```

## Getting Test IDs

To get valid category and group IDs for testing:

1. **Get Category IDs**: Call `GET /api/articles/articles` and use `categoryArticleId` from any article
2. **Get Group IDs**: Call `GET /api/course/courses` and use `groupId` from any course

## Summary

✅ **Articles**:
- GET all: `/api/articles/articles` (existing)
- GET by category: `/api/articles/articles/category/:categoryId` (new)

✅ **Courses**:
- GET all: `/api/course/courses` (existing)
- GET by group: `/api/course/courses/group/:groupId` (new)

All endpoints include proper error handling and validation.

