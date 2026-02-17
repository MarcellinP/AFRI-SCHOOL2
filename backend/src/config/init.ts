import logger from '../utils/logger';
import { validateEnvironment, getConfig } from './environment';

export const initializeApp = async () => {
  logger.info('🚀 Starting AFRI-SCHOOL Backend Initialization...');

  try {
    // 1. Validate environment variables
    logger.info('1️⃣  Validating environment variables...');
    validateEnvironment();

    // 2. Log configuration
    logger.info('2️⃣  Loading configuration...');
    const config = getConfig();
    logger.info(`   - Environment: ${config.nodeEnv}`);
    logger.info(`   - Port: ${config.port}`);
    logger.info(`   - MongoDB: Configured`);
    logger.info(`   - Redis: Configured`);
    logger.info(`   - Stripe: Configured`);

    logger.info('✅ Application initialized successfully!');
    return config;
  } catch (error) {
    logger.error('❌ Application initialization failed!', error);
    throw error;
  }
};
