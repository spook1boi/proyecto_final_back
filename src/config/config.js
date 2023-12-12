import dotenv from 'dotenv';

dotenv.config();

export default {
    persistence: process.env.PERSISTENCE,
    mongoURI: process.env.MONGO_URI,
    sessionSecret: process.env.SESSION_SECRET,
    githubClientID: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    jwtSecret: process.env.JWT_SECRET,
};