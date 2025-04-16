const express = require('express');
const { getRecommendations } = require('../controllers/fetch');
const ensureAuthenticated = require('../Middlewares/Auth');
const router = express.Router();

router.get('/music',ensureAuthenticated,getRecommendations); // Directly pass the controller

module.exports = router;