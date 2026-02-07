# Video files

The following videos are not in the repository because they exceed GitHub's 100MB file limit:

- `hero-video.mp4` — hero section background
- `intro-1.mp4` — booking section background
- `experienceebomi/reception.mp4`
- `experienceebomi/temple.mp4`
- `experienceebomi/premuimroom.mp4`
- `experienceebomi/prayercubicle.mp4`

**To get the site working locally:** Place these video files in `public/` and `public/experienceebomi/` respectively.

**For deployment:** Host videos on a CDN (e.g. Cloudflare R2, Supabase Storage, Vercel Blob) and update the paths in `app/page.tsx` and `next.config.js`.
