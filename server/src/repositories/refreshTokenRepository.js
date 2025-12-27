const RefreshToken = require("../entities/refreshTokenSchema");

class RefreshTokenRepository {
 async createToken(userId,token,expiresAt){
    return await RefreshToken.create({userId,token,expiresAt});
 }
 async updateToken(tokenId, newToken, expiresAt){
      return await RefreshToken.findByIdAndUpdate(
        tokenId, 
        { token: newToken, expiresAt },
        { new: true, upsert: true }
      );
 }
 async findByToken(token){
    return await RefreshToken.findOne({token});
 }
 async deleteByToken(token){
    return await RefreshToken.deleteOne({token});
 }
 async deleteByUser(userId){
    return await RefreshToken.deleteMany({userId});
 }
}
module.exports = new RefreshTokenRepository();