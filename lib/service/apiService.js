const axios = require('axios');
const bcrypt = require('bcrypt');
const logger = require('../config/logger');

const apiService = {
    name: (req, res) => {
        logger.info(`NAME : ${req.params.name}`)
        const name = req.params.name

        fetch(`http://localhost:8090/api/library/name/${name}`,{
            method: "GET",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                credentials: 'include',
            },
            })
        .then(response => response.json())
        .then(data => {
            logger.info(data);
            return res.json(data)
            })
        .catch(error => logger.error(error));
    },
    region: (req, res) => {
        logger.info(`REGION : ${req.params.region}`)
        const region = req.params.region

        fetch(`http://localhost:8090/api/library/region/${region}`,{
            method: "GET",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                credentials: 'include',
            },
            })
        .then(response => response.json())
        .then(data => {
            logger.info(data);
            return res.json(data)
            })
        .catch(error => logger.error(error));
    },
};

module.exports = apiService;
