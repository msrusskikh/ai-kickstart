# Admin Reviews System

This document describes the review system functionality added to the AI Kickstart application.

## Features

### User-Facing Features
- **Integrated Review Form**: Seamlessly appears within the completion popup when users click "Оставить отзыв"
- **Star Rating System**: 1-5 star rating with visual feedback
- **Required Fields**: Rating and review text are required
- **Anonymous Reviews**: No personal information collected (authentication will be added later)

### Admin Features
- **Reviews Dashboard**: Accessible at `/admin/reviews`
- **Statistics Overview**: Shows total reviews, average rating, and positive reviews count
- **Review Management**: View all submitted reviews with full details
- **Real-time Updates**: Reviews are stored in JSON file and updated in real-time





## Technical Implementation

### Components
- `ReviewDialog.tsx` - Modal dialog for review submission
- `CourseCompletionPopup.tsx` - Updated to integrate review functionality
- `/admin/reviews/page.tsx` - Admin dashboard for viewing reviews

### API
- `POST /api/reviews` - Submit new review
- `GET /api/reviews` - Fetch all reviews (admin only)

### Data Storage
- Reviews are stored in `data/reviews.json`
- Each review includes: id, rating, review, timestamp

## Access

- **User Reviews**: Click "Оставить отзыв" in completion popup
- **Admin Dashboard**: Click the message icon in the top navigation bar

## Data Structure

```typescript
interface ReviewData {
  id: string
  rating: number
  review: string
  timestamp: string
}
```

## Security Notes

- No authentication required for review submission (public feedback)
- Admin dashboard is accessible to anyone with the URL
- Consider adding authentication for production use
