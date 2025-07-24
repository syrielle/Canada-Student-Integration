import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  },
});
