-- SQL schema for storing user profile data
CREATE TABLE IF NOT EXISTS profiles (
    uid VARCHAR(128) PRIMARY KEY,
    firstName VARCHAR(128) NOT NULL,
    lastName VARCHAR(128) NOT NULL,
    email VARCHAR(256) NOT NULL,
    phone VARCHAR(32),
    location VARCHAR(128),
    dateOfBirth DATE,
    bio TEXT,
    title VARCHAR(128),
    organization VARCHAR(128),
    specialization VARCHAR(128),
    experience VARCHAR(64),
    education VARCHAR(256),
    certifications TEXT,
    profileImage TEXT,
    socialLinks TEXT,
    showEmail BOOLEAN DEFAULT TRUE,
    showPhone BOOLEAN DEFAULT TRUE,
    showLocation BOOLEAN DEFAULT TRUE
);

-- Example insert
-- INSERT INTO profiles (uid, firstName, lastName, email, ...) VALUES (...);
