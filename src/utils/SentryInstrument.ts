import * as Sentry from "@sentry/node"

const SentryClient = Sentry.init({
    dsn: "https://80e77c7e5ac4022e1c37d0aea95ecaa6@o4510587220262912.ingest.de.sentry.io/4510587223146576",
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
});