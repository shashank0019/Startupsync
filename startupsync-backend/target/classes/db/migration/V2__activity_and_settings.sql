-- Activity feed and user settings tables

CREATE TABLE IF NOT EXISTS activity_events (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    activity_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(36),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_activity_user_id ON activity_events(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON activity_events(created_at);

CREATE TABLE IF NOT EXISTS user_settings (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE REFERENCES users(id),
    email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    application_updates BOOLEAN NOT NULL DEFAULT TRUE,
    message_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    profile_visible BOOLEAN NOT NULL DEFAULT TRUE,
    show_location BOOLEAN NOT NULL DEFAULT TRUE,
    allow_messaging BOOLEAN NOT NULL DEFAULT TRUE,
    theme VARCHAR(20) NOT NULL DEFAULT 'light',
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
