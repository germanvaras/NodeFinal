const TokenReset = require('../model/tokenReset')
const TokenDTO = require('../DTOs/tokenReset')
function convertToDTO(tokenReset) {
    const {_id, token, userId, expiresAt } = tokenReset;
    return new TokenDTO(_id, token, userId, expiresAt);
}
class TokenDao {
    async findAllTokens() {
        try {
            const tokens = await TokenReset.find();
            return tokens.map(convertToDTO);
        } catch (error) {
            return { error: error.message };
        }
    }
    async findTokenByUserId(userId) {
        try {
            const tokenReset = await TokenReset.findOne({userId});
            if (!tokenReset) {
                throw new Error('Token de restablecimiento no encontrado');
            }
            return convertToDTO(tokenReset);
        } catch (error) {
            return { error: error.message };
        }
    }
    
    async deleteTokenById(tokenId) {
        try {
            const deletedToken = await TokenReset.findByIdAndDelete(tokenId);
            if (!deletedToken) {
                throw new Error('Token de restablecimiento no encontrado');
            }
        } catch (error) {
            return { error: error.message };
        }
    }
    async updateToken(tokenReset) {
        try {
            const updatedToken = await TokenReset.findByIdAndUpdate(
                tokenReset._id,
                { token: tokenReset.token, expirationDate: tokenReset.expirationDate },
                { new: true }
            );
            if (!updatedToken) {
                throw new Error('Token de restablecimiento no encontrado');
            }
            return convertToDTO(updatedToken);
        } catch (error) {
            return { error: error.message };
        }
    }

    async createToken(token, userId, expiresAt) {
        try {
            const tokenReset = new TokenReset({ token, userId, expiresAt });
            await tokenReset.save();
            convertToDTO(tokenReset);
        } catch (error) {
            return { error: error.message };
        }
    }
}
module.exports = TokenDao
