import * as dotenv from 'dotenv';
import { RecursiveKeyOf } from '../types/utils.type';
dotenv.config();

const appConfig = {
  environment: process.env.NODE_ENV,
  port: +process.env.PORT || 5000,
  // feMerchantBaseUrl: process.env.FE_MERCHANT_BASE_URL,
  // feCustomerBaseUrl: process.env.FE_CUSTOMER_BASE_URL,
  databaseSecretKey: process.env.DATABASE_SECRET_KEY,
  cronSecret: process.env.CRON_SECRET,

  redis: {
    standAlone: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
    sentinels:
      process.env.REDIS_SENTINELS?.split('|')?.map((item) => {
        const [host, port] = item?.split(':') || [];
        return { host, port };
      }) || [],
    password: process.env.REDIS_PASSWORD,
    sentinelPassword: process.env.REDIS_SENTINEL_PASSWORD,
    redisGroupName: 'mymaster',
  },

  auth: {
    accessToken: {
      secret: process.env.AUTH_JWT_ACCESS_TOKEN_KEY,
      algorithm: 'HS256',
      expiresTime: process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRE,
    },

    refreshToken: {
      secret: process.env.AUTH_JWT_REFRESH_TOKEN_KEY,
      algorithm: 'HS256',
      expiresTime: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRE,
    },
  },

  sendgrid: {
    apiKey: process.env.SEND_GRID_KEY,
    sender: process.env.SEND_GRID_SENDER_KEY,
    branchName: process.env.SEND_GRID_BRANCH_NAME,
    templateId: process.env.SEND_GRID_TEMPLATE_ID,
  },

  momo: {
    partnerCode: process.env.MOMO_PARTNER_CODE,
    accessKey: process.env.MOMO_ACCESS_KEY,
    secretKey: process.env.MOMO_SECRET_KEY,
    ipnUrl: process.env.MOMO_IPN_URL,
    api: process.env.MOMO_API,
    redirectUrl: process.env.MOMO_REDIRECT_URL,
    expireTime: process.env.MOMO_EXPIRE_TIME,
  },
};

export default appConfig;
export type AppConfig = Record<RecursiveKeyOf<typeof appConfig>, string>;
