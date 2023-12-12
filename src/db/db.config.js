import mongoose from "mongoose";
import winston from 'winston';
import config from '../config/config.js';
import logger from '../../src/loggers.js'; 

mongoose.connect(config.mongoURI)
    .then(() => {
        logger.info("Connected to Mongo");
    })
    .catch(error => {
        logger.error("Error connecting to Mongo", { error });
    });