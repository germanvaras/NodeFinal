const cron = require('node-cron');
const {deleteUserIfInactiveService}  = require('../services/user');
const { deleteExpiredTokensService } = require('../services/tokenReset');

const scheduleDeleteInactiveUsers = () => {
    cron.schedule('0 0 * * *', deleteUserIfInactiveService);
};
const scheduleDeleteExpiredTokens = () => {
    cron.schedule('0 * * * *', deleteExpiredTokensService);
};
module.exports = {scheduleDeleteInactiveUsers, scheduleDeleteExpiredTokens };