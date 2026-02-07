# Hero Video Setup Instructions

## Video File Requirements

1. **Primary Video (Required)**
   - File: `hero-video.mp4`
   - Format: MP4 (H.264 codec)
   - Resolution: 1920x1080 (Full HD) or 3840x2160 (4K)
   - Frame Rate: 30fps (or 24fps for cinematic)
   - Bitrate: 5-10 Mbps (1080p) or 15-25 Mbps (4K)
   - Duration: 15-60 seconds (looping)
   - Audio: Optional (will be muted anyway)

2. **Optional Fallback Video (Better for Safari/iOS)**
   - File: `hero-video-hevc.mp4`
   - Format: MP4 (HEVC/H.265 codec)
   - Same resolution and settings as above
   - Smaller file size, better quality

## CapCut Export Settings

1. Open your project in CapCut
2. Go to **Export**
3. Settings:
   - **Format**: MP4
   - **Resolution**: 1920x1080 (or higher if available)
   - **Frame Rate**: 30fps
   - **Quality**: High or Custom
   - **Bitrate**: 5-10 Mbps (for 1080p)
   - **Codec**: H.264
4. Export and save as `hero-video.mp4`
5. Place the file in the `/public` folder

## File Size Optimization Tips

- Keep video duration under 30 seconds for faster loading
- Use 1080p for best balance of quality and file size
- Aim for file size under 10MB for good performance
- Consider using a video compression tool if file is too large

## Testing

After adding the video file:
1. Run `npm run dev`
2. Check that video autoplays and loops
3. Test on mobile devices
4. Verify video loads quickly

## Fallback

If video fails to load, the code will automatically fall back to the hero image.
