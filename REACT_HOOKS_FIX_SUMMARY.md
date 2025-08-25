# React Hooks Order Fix - Chicago vs SLC Issue Resolution

## Problem Summary
The app was experiencing React Error #310 ("Rendered more hooks than during the previous render") which worked in Chicago but failed in Salt Lake City. This was caused by:
1. Different initial states between locations (timezone, auth state, cache)
2. SSR/hydration mismatches
3. Multiple Supabase GoTrueClient instances

## Fixes Applied

### 1. ✅ Fixed Supabase Singleton Pattern
**File:** `src/ppm-tool/shared/lib/supabase.ts`
- Already using proper singleton pattern with `globalThis.__supabase__`
- Added explicit `storageKey` to prevent conflicts
- Prevents "Multiple GoTrueClient instances" warning

### 2. ✅ Fixed Hook Order Issues
**File:** `src/ppm-tool/components/common/EmbeddedPPMToolFlow.tsx`
- Removed `useEffect` that changed initial step after mount
- Moved logic to initializer function outside of hooks
- Ensures consistent hook order regardless of mobile detection

### 3. ✅ Fixed SSR/Hydration Mismatches
**File:** `src/ppm-tool/shared/contexts/GuidanceContext.tsx`
- Changed from conditional `useState` initializer to `useEffect`
- Prevents different initial states between server and client
- Ensures ProductBumper state is consistent

### 4. ✅ Fixed Mobile Detection Hook
**File:** `src/ppm-tool/shared/hooks/useMobileDetection.ts`
- Added proper SSR-safe initialization
- Returns consistent value during SSR (false)
- Updates immediately on client after mount

### 5. ✅ Added Cache Cleanup Script
**File:** `public/clear-cache.js`
- Unregisters service workers
- Clears all caches
- Cleans localStorage (except auth tokens)
- Ensures both locations get same build

### 6. ✅ Added Debug Utilities
**Files:** 
- `src/ppm-tool/shared/utils/debugHooks.ts` - Hook order debugging
- `src/ppm-tool/components/common/EnvironmentDebug.tsx` - Environment info display

## Immediate Actions Required

### 1. Clear Cache in Both Locations
```javascript
// In browser console (both Chicago and SLC):
// Option A: Manual clear
navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
caches.keys().then(names => names.forEach(name => caches.delete(name)));
localStorage.clear();
location.reload(true);

// Option B: Use the script
// Navigate to: yoursite.com/clear-cache.js?reload=true
```

### 2. Deploy the Fixed Build
```bash
# Build and deploy
npm run build
npm run deploy  # or your deployment command

# After deployment, purge CDN cache if using one
```

### 3. Test in Both Locations
1. Open Incognito/Private window
2. Open DevTools → Network tab
3. Navigate to the app
4. Check Console for errors
5. Verify no React #310 error
6. Check both Chicago and SLC

## Why It Worked in Chicago but Not SLC

The issue was location-dependent because:

1. **Different Cache States**: Chicago might have had older service worker cache
2. **Auth State Differences**: Different login states triggered different code paths
3. **Timezone Logic**: Mountain Time vs Central Time affected initial states
4. **Hydration Mismatches**: SSR rendered differently based on server location

## Prevention Guidelines

### ✅ DO:
- Always call hooks at the top level
- Use hooks in the same order every render
- Initialize state with SSR-safe values
- Use `useEffect` for client-only side effects
- Create singletons for global clients (Supabase, etc.)

### ❌ DON'T:
- Call hooks conditionally (`if (x) useEffect(...)`)
- Call hooks in loops
- Call hooks after early returns
- Use `typeof window` checks in state initializers
- Create multiple instances of auth clients

## Verification Checklist

- [ ] No React Error #310 in console
- [ ] No "Multiple GoTrueClient" warnings
- [ ] App loads correctly on mobile and desktop
- [ ] Auth state persists correctly
- [ ] Same behavior in Chicago and SLC
- [ ] Service workers properly cleared
- [ ] Latest build deployed to all edges

## Debug Commands

```javascript
// Check hook order (development only)
window.__debugHooks?.getOrder()

// Check environment
console.log({
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  viewport: `${window.innerWidth}x${window.innerHeight}`,
  userAgent: navigator.userAgent
});

// Check caches
Promise.all([
  navigator.serviceWorker.getRegistrations(),
  caches.keys()
]).then(([sws, caches]) => console.log({ serviceWorkers: sws.length, caches: caches.length }));
```

## If Issues Persist

1. Enable source maps: `productionBrowserSourceMaps: true` in `next.config.js`
2. Add environment debug component to production temporarily
3. Compare network waterfall between locations
4. Check for CDN edge differences
5. Verify atomic deploys (all files updated together)

## Related Files Modified
- `src/ppm-tool/shared/lib/supabase.ts`
- `src/ppm-tool/components/common/EmbeddedPPMToolFlow.tsx`
- `src/ppm-tool/shared/contexts/GuidanceContext.tsx`
- `src/ppm-tool/shared/hooks/useMobileDetection.ts`
- `public/clear-cache.js`
- `src/ppm-tool/shared/utils/debugHooks.ts`
- `src/ppm-tool/components/common/EnvironmentDebug.tsx`
