# Firebase Permissions Fix - Setup Guide

## Problem
Multiple components are throwing "Missing or insufficient permissions" errors because:
1. Firestore security rules are not configured
2. Composite indexes are required for certain queries

**Affected Components:**
- ResumeScreener (resume_screenings collection)
- AIInterview (ai_interviews collection)
- Analytics (projects, project_files, project_whiteboard collections)
- Projects API (projects, project_files, project_members collections)

## Solution

### Step 1: Deploy Firestore Security Rules

You have two options:

#### Option A: Using Firebase Console (Recommended for Quick Fix)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **neuralnexus-3df8e**
3. Navigate to **Firestore Database** → **Rules**
4. Replace the existing rules with the content from `firestore.rules`
5. Click **Publish**

#### Option B: Using Firebase CLI

```bash
# Install Firebase CLI if you haven't already
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init firestore

# Deploy the rules
firebase deploy --only firestore:rules
```

### Step 2: Create Composite Indexes

You have three options:

#### Option A: Using Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **neuralnexus-3df8e**
3. Navigate to **Firestore Database** → **Indexes**
4. Create the following indexes:

**Index 1: resume_screenings**
- Collection ID: `resume_screenings`
- Fields:
  - `userId` → Ascending
  - `createdAt` → Descending
- Query scope: Collection

**Index 2: ai_interviews**
- Collection ID: `ai_interviews`
- Fields:
  - `userId` → Ascending
  - `createdAt` → Descending
- Query scope: Collection

#### Option B: Using Firebase CLI

```bash
# Deploy the indexes
firebase deploy --only firestore:indexes
```

#### Option C: Click the Link in Console Error (Easiest!)

When you run the app and trigger the query, Firebase will show an error in the console with a direct link to create the index automatically. You can click that link and it will auto-configure the index for you.

### Step 3: Verify the Fix

1. Restart your development server (if needed)
2. Navigate to different pages in the application
3. The errors should be gone

## What Changed

### 1. firestore.rules
Added comprehensive security rules for all collections:
- **projects**: Authenticated users can read all projects, create their own, and only owners can update/delete
- **project_files**: Authenticated users can read/create/update files for collaboration
- **project_members**: Authenticated users can manage project members
- **project_whiteboard**: Authenticated users can manage whiteboards
- **resume_screenings**: Users can only access their own resume screenings
- **ai_interviews**: Users can only access their own interview simulations
- **users**: Users can only access their own profile

### 2. Component Error Handling
Updated error handling in:
- **ResumeScreener.tsx**: Shows user-friendly toast messages for permission errors
- **AIInterview.tsx**: Shows user-friendly toast messages for permission errors
- **Analytics page**: Gracefully handles errors and shows default data

### 3. firestore.indexes.json
Added composite indexes for:
- `resume_screenings` (userId + createdAt)
- `ai_interviews` (userId + createdAt)

## Security Rules Explanation

### Projects (Collaborative)
```javascript
match /projects/{projectId} {
  // Anyone authenticated can read (for collaboration)
  allow read: if request.auth != null;
  
  // Only authenticated users can create with their own owner_id
  allow create: if request.auth != null && request.auth.uid == request.resource.data.owner_id;
  
  // Only owner can update/delete
  allow update, delete: if request.auth != null && request.auth.uid == resource.data.owner_id;
}
```

### Personal Data (Resume Screenings, AI Interviews)
```javascript
match /resume_screenings/{document} {
  // Users can only read their own data
  allow read: if request.auth != null && request.auth.uid == resource.data.userId;
  
  // Users can only create data with their own userId
  allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
  
  // Users can only update/delete their own data
  allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
}
```

This ensures:
- Only authenticated users can access the application
- Users can collaborate on projects
- Users can only see their own personal data (resumes, interviews)
- Users cannot impersonate others

## Troubleshooting

### Error: "permission-denied"
- Make sure you've deployed the security rules
- Verify you're logged in (check `user` in AuthContext)
- Check that the user's UID matches the data's userId/owner_id

### Error: "failed-precondition" or "index required"
- Create the composite indexes as described in Step 2
- Wait a few minutes for the indexes to build (Firebase will show progress)
- Click the auto-generated link in the console error for quick index creation

### Error: "500 Internal Server Error" on /api/projects
- Deploy the security rules for projects, project_files, and project_members collections
- Ensure you're authenticated before accessing the API

### Still seeing errors?
- Clear browser cache and reload
- Check Firebase Console → Firestore Database → Data to verify collections exist
- Check browser console for the full error message
- Verify indexes are in "Enabled" state (not "Building")
