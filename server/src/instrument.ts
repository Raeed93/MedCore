import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'production',
  tracesSampleRate: 0.2,
  sendDefaultPii: false,
  beforeSend(event) {
    if (event.request) {
      delete event.request.data;
      delete event.request.cookies;
      delete event.request.headers;
      delete event.request.query_string;
    }
    return event;
  },
});