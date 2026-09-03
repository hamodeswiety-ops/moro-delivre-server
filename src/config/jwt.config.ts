export const getJwtConfig = () => ({
  secret: process.env.JWT_SECRET || 'change-me-in-production',
  signOptions: {
    expiresIn: parseInt(process.env.JWT_EXPIRATION) || 86400,
  },
});
