import "dotenv/config";

const config = {
  port: process.env.PORT || 3000,

  corsOrigin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",

  dbUri: process.env.MONGODB_URI?.trim(),

  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
  },

  mail: {
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    user: process.env.MAILTRAP_SMTP_USER,
    pass: process.env.MAILTRAP_SMTP_PASS,
  },

  frontend:{
    forgotPasswordUrl: process.env.FORGOT_PASSWORD_REDIRECT_URL,
  }

};

export default config;
