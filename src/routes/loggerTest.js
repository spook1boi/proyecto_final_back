import express from 'express';
import logger from '../loggers.js';

const router = express.Router();

router.get('/loggerTest', (req, res) => {
  try {
    logger.silly('Silly message', { timestamp: new Date() });
    logger.verbose('Verbose message', { timestamp: new Date() });
    logger.debug('Debug message', { timestamp: new Date() });
    logger.info('Info message', { timestamp: new Date() });
    logger.http('HTTP message', { timestamp: new Date() });
    logger.warn('Warning message', { timestamp: new Date() });
    logger.error('Error message', { timestamp: new Date() });

    res.send('Logs sent to console and file!');
  } catch (error) {
    logger.error('Error in loggerTest:', { error });
    res.status(500).send('Error in loggerTest');
  }
});

export default router;