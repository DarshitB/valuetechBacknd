# Local File Upload System Setup

## Overview
This system stores media files locally in the `uploads/` folder with a clean, organized folder structure. No external dependencies required.

## Folder Structure
```
uploads/
└── 2025/
    └── Aug/
        └── ORD12345678/
            ├── images/
            │   ├── ORD12345678_image_0001.jpg
            │   └── ORD12345678_image_0002.png
            └── videos/
                └── ORD12345678_video_0001.mp4
```

## How It Works

### 1. File Upload Process
- Files are uploaded via multipart form data or base64
- System automatically creates folder hierarchy if it doesn't exist
- Files are copied to appropriate folders (images/videos)
- Database stores only the `media_url` for direct file access

### 2. File Access
- Files are served statically via `/uploads/` endpoint
- Direct access: `http://yourdomain.com/uploads/2025/Aug/ORD12345678/images/filename.jpg`
- Files are cached for 1 hour for performance

### 3. Database Structure
- **`media_url`**: Local file URL (e.g., `/uploads/2025/Aug/ORD12345678/images/filename.jpg`)
- **`media_type`**: File type ('image' or 'video')
- **`status`**: File status (0=pending, 1=approved, 2=rejected)

## API Endpoints

### Upload Multipart Files
```
POST /api/mobile/media/upload
Content-Type: multipart/form-data

Body:
- files: Array of files
- order_number: "ORD12345678"
```

### Upload Base64 Files
```
POST /api/mobile/media/upload-base64
Content-Type: application/json

Body:
{
  "order_number": "ORD12345678",
  "files": [
    {
      "data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
    }
  ]
}
```

## Configuration

### File Size Limits
- JSON payload: 50MB
- Multipart files: 10MB per file (configurable in multer)

## Security Features
- File type validation (images and videos only)
- Unique filename generation to prevent conflicts
- Proper MIME type headers for media files
- Cache control headers for performance

## Frontend Integration

### Display Images
```javascript
// Using the media_url from database
const imageUrl = `http://yourbackend.com${mediaRecord.media_url}`;
<img src={imageUrl} alt="Order Image" />
```

### Display Videos
```javascript
// Using the media_url from database
const videoUrl = `http://yourbackend.com${mediaRecord.media_url}`;
<video controls>
  <source src={videoUrl} type="video/mp4" />
  Your browser does not support the video tag.
</video>
```

### Fetch Media for an Order
```javascript
// Get all media for an order
const fetchOrderMedia = async (orderId) => {
  const response = await fetch(`/api/order-media/${orderId}`);
  const mediaFiles = await response.json();
  
  // Transform to include full URLs
  return mediaFiles.map(file => ({
    ...file,
    fullUrl: `http://yourbackend.com${file.media_url}`
  }));
};
```

## Migration Notes
- **Removed**: `media_path` field (no longer needed)
- **Removed**: Google Drive dependencies and service account
- **Simplified**: Database structure with only essential fields
- **Clean**: No external API dependencies

## Troubleshooting

### Common Issues
1. **Uploads folder not created**: Check if the backend has write permissions
2. **Files not accessible**: Ensure static file serving is enabled in app.js
3. **Large file uploads fail**: Check file size limits in multer configuration

### File Permissions
Ensure the `uploads/` folder has proper read/write permissions:
```bash
chmod 755 uploads/
chmod 644 uploads/**/*
```

## Performance Considerations
- Files are cached for 1 hour
- Folder structure is cached to avoid repeated file system checks
- Parallel file processing for multiple uploads
- Automatic cleanup of temporary files

## Clean Installation
After migration, your system will have:
- ✅ Local file storage only
- ✅ No Google Drive dependencies
- ✅ Simplified database structure
- ✅ Direct file access via URLs
- ✅ Clean, organized folder structure
