// Cache cleanup script for debugging deployment issues
// This ensures all users get the latest build

(function() {
  'use strict';
  
  // Only run in browser environment
  if (typeof window === 'undefined') return;
  
  console.log('🧹 Starting cache cleanup...');
  
  // 1. Unregister all service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        registration.unregister().then(function(success) {
          if (success) {
            console.log('✅ Service worker unregistered:', registration.scope);
          }
        });
      }
    });
  }
  
  // 2. Clear all caches
  if ('caches' in window) {
    caches.keys().then(function(names) {
      for (let name of names) {
        caches.delete(name).then(function(success) {
          if (success) {
            console.log('✅ Cache cleared:', name);
          }
        });
      }
    });
  }
  
  // 3. Clear localStorage items related to the app
  try {
    const keysToKeep = ['sb-panoramic-solutions-auth-token']; // Keep auth token
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key) && key.startsWith('sb-')) {
        localStorage.removeItem(key);
        console.log('✅ Cleared localStorage:', key);
      }
    });
  } catch (e) {
    console.warn('⚠️ Could not clear localStorage:', e);
  }
  
  // 4. Force reload after cleanup (optional)
  const shouldReload = new URLSearchParams(window.location.search).get('reload') === 'true';
  if (shouldReload) {
    setTimeout(() => {
      console.log('🔄 Reloading page...');
      window.location.reload(true);
    }, 1000);
  }
})();
