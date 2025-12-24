import * as Sentry from "@sentry/node"

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    sendDefaultPii: true,
    integrations: [
        Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
        Sentry.httpIntegration({
            trackIncomingRequestsAsSessions: false, // default: true
        }),
    ],
    enableLogs: true,
});