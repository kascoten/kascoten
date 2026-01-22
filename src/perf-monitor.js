// ============================
// Performance Monitoring & Logging
// ============================

// Log page load performance
window.addEventListener('load', () => {
  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  const connectTime = perfData.responseEnd - perfData.requestStart;
  const renderTime = perfData.domComplete - perfData.domLoading;
  
  console.log('=== PAGE PERFORMANCE ===');
  console.log(`Page Load Time: ${pageLoadTime}ms`);
  console.log(`Connect Time: ${connectTime}ms`);
  console.log(`Render Time: ${renderTime}ms`);
  console.log(`========================`);
});

// Measure Firebase operations
const measureFirebaseOp = (name) => {
  const start = performance.now();
  return () => {
    const end = performance.now();
    console.log(`⏱️  ${name}: ${Math.round(end - start)}ms`);
  };
};

// Global access for use in other scripts
window.measureFirebaseOp = measureFirebaseOp;

// Monitor First Contentful Paint
if ('PerformanceObserver' in window) {
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          console.log(`📊 FCP: ${Math.round(entry.startTime)}ms`);
        }
      }
    });
    observer.observe({ entryTypes: ['paint'] });
  } catch (e) {
    console.log('PerformanceObserver not fully supported');
  }
}

// Log when critical content renders
const logContentReady = (section) => {
  const time = performance.now();
  console.log(`✓ ${section} ready at ${Math.round(time)}ms`);
};

window.logContentReady = logContentReady;
