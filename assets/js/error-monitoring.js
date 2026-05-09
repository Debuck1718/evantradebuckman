// Basic Error Monitoring
window.addEventListener('error', function(e) {
  // Log errors to console in development
  console.error('JavaScript Error:', {
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
    colno: e.colno,
    error: e.error
  });

  // In production, send to error monitoring service
  // Example: Sentry, Rollbar, or similar
  // if (typeof Sentry !== 'undefined') {
  //   Sentry.captureException(e.error);
  // }
});

window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled Promise Rejection:', e.reason);

  // Send to error monitoring service
  // if (typeof Sentry !== 'undefined') {
  //   Sentry.captureException(e.reason);
  // }
});