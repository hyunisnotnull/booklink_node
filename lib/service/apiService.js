const axios = require('axios');
const bcrypt = require('bcrypt');

const apiService = {
    name: (req, res) => {
        console.log('name', req.params.name)
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
            console.log(data);
            return res.json(data)
            })
        .catch(error => console.error(error));
    },
    region: (req, res) => {
        console.log('region', req.params.region)
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
            console.log(data);
            return res.json(data)
            })
        .catch(error => console.error(error));
    },
};

module.exports = apiService;
