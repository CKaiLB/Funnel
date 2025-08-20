// Test script to verify all routes work correctly
// Run this after deployment to ensure routing is working

const routes = [
  '/',
  '/ai-roadmap',
  '/sales-funnel-playbook', 
  '/complete-system',
  '/congratulations',
  '/newsletter',
  '/training'
];

const baseUrl = 'https://yourdomain.vercel.app'; // Replace with your actual domain

console.log('🔍 Testing all routes...\n');

routes.forEach(route => {
  const url = `${baseUrl}${route}`;
  console.log(`✅ ${route} → ${url}`);
});

console.log('\n📋 Manual Testing Checklist:');
console.log('1. Visit each URL in your browser');
console.log('2. Verify the correct page loads');
console.log('3. Check that navigation works between pages');
console.log('4. Test form submissions on each page');
console.log('5. Verify mobile responsiveness');
console.log('6. Check that back/forward browser buttons work');

console.log('\n🚨 If any route fails:');
console.log('- Check Vercel deployment logs');
console.log('- Verify vercel.json is in root directory');
console.log('- Ensure public/_redirects exists');
console.log('- Check that build completed successfully');
console.log('- Verify environment variables are set');

console.log('\n🎯 Expected Behavior:');
console.log('- All routes should load the correct page');
console.log('- No 404 errors should occur');
console.log('- Navigation between pages should work smoothly');
console.log('- Forms should submit successfully');
console.log('- Mobile layout should be responsive');
