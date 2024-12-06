const logger = require('../config/logger');

const homeService = {
    home: (req, res) => {
        logger.info('HOME');
    },
    
};

module.exports = homeService;
