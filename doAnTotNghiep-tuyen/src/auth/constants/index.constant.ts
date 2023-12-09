export enum StrategyName {
  USER = 'jwt-authen-user',
  MERCHANT = 'jwt-authen-merchant',
  ADMIN = 'jwt-authen-admin',
  CUSTOMER = 'jwt-authen-customer',
  JWT_CASL_ADMIN = 'jwt-casl-admin',
  JWT_CASL_MERCHANT = 'jwt-casl-merchant',
  EXTERNAL = 'EXTERNAL',
}

export const CHECK_PASSWORD_CONFIG = {
  MAX_RETRY_TIME: 5,
  BLOCK_EXP: 3600, //seconds = 1h
};

export const LOGIN_CONFIG = {
  MAX_RETRY_TIME: 5,
  BLOCK_EXP: 3600, //seconds = 1h
};
