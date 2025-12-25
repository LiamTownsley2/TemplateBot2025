import * as Sentry from "@sentry/node"

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    sendDefaultPii: true,
    tracesSampleRate: 1.0,
    integrations: [
        Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
        Sentry.httpIntegration({
            trackIncomingRequestsAsSessions: false,
        }),
    ],
    enableLogs: true,
});