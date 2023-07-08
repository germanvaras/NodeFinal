const generateNumericToken = () => {
    let numericToken = '';
    for (let i = 0; i < 6; i++) {
        const digit = Math.floor(Math.random() * 9) + 1; 
        numericToken += digit;
    }
    return numericToken.toString();
};
module.exports = {generateNumericToken}