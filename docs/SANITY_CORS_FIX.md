# Fix Sanity Studio CORS Error on Deployed Site

## The Problem
When you deploy your blog to Vercel (or any hosting platform), Sanity Studio at `/studio` shows this error:
```
GET https://5k8eylbg.api.sanity.io/v2021-06-07/users/me?tag=sanity.studio.users.get-current net::ERR_FAILED
CorsOriginError: CorsOriginError
```

This happens because Sanity needs to whitelist your deployed domain to allow API requests from the browser.

## The Solution

### Step 1: Get Your Deployed URL
Find your deployed website URL from Vercel. It should look like:
- `https://cyth-blog.vercel.app`
- OR your custom domain if you've set one up

### Step 2: Add CORS Origin in Sanity Management

1. **Go to Sanity Manage**
   - Visit: https://www.sanity.io/manage
   - Or go to: https://www.sanity.io/manage/personal/project/5k8eylbg

2. **Navigate to API Settings**
   - Click on your project: **cyth-blog** (Project ID: `5k8eylbg`)
   - Go to **API** tab in the left sidebar
   - Scroll down to **CORS Origins**

3. **Add Your Deployed Domain**
   - Click **+ Add CORS origin**
   - Enter your deployed URL (e.g., `https://cyth-blog.vercel.app`)
   - ✅ Check "Allow credentials"
   - Click **Add**

4. **Add Localhost (for development)**
   If not already added:
   - Add `http://localhost:3000`
   - ✅ Check "Allow credentials"

### Step 3: Wait & Test
- Wait 1-2 minutes for changes to propagate
- Clear your browser cache
- Visit your deployed site at: `https://your-domain.vercel.app/studio`
- You should now be able to log in to Sanity Studio!

## Wildcard Option (Not Recommended for Production)

If you want to allow **all** domains (only for testing):
- Add `https://*.vercel.app` as a CORS origin
- This allows all Vercel preview deployments

**⚠️ Warning:** This is less secure. Better to add specific domains.

## What We Fixed in Code

✅ **Fixed deprecated `locate` option**
- Changed from: `presentationTool({ locate, ... })`
- Changed to: `presentationTool({ resolve: { locations }, ... })`
- This removes the warning: "Presentation's `locate` option is deprecated"

## Verification Checklist

After adding CORS origins, verify:
- [ ] Can access `/studio` on deployed site
- [ ] Can log in with your Sanity account
- [ ] Can edit and publish content
- [ ] No CORS errors in browser console
- [ ] No "deprecated locate" warning in terminal

## Troubleshooting

### Still getting CORS errors?
1. Double-check the URL matches exactly (no trailing slash)
2. Make sure "Allow credentials" is checked
3. Clear browser cache completely
4. Try incognito/private browsing mode
5. Check browser console for exact error message

### Can't find your project?
- Project ID: `5k8eylbg`
- Direct link: https://www.sanity.io/manage/personal/project/5k8eylbg/api

### Need to add multiple domains?
Add each one separately:
- `https://cyth-blog.vercel.app` (production)
- `https://cyth-blog-git-main-mohneesh.vercel.app` (preview)
- `http://localhost:3000` (local development)
- Your custom domain (if any)

## Complete CORS Origins List

Your CORS origins should include:

```
✅ http://localhost:3000 (Allow credentials: ✓)
✅ https://cyth-blog.vercel.app (Allow credentials: ✓)
✅ https://your-custom-domain.com (if applicable)
```

## Next Steps

After fixing CORS:
1. Deploy the code changes (we updated `sanity.config.ts` and `plugins/locate.ts`)
2. Verify the deprecation warning is gone
3. Test editing content from production `/studio`
4. Celebrate! 🎉

---

**Last Updated:** December 11, 2025  
**Project:** CythBlog  
**Sanity Project ID:** 5k8eylbg
