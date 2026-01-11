const flattenObj = require('../utils/flattenObj');

class UserMapper {
  toPersistenceUpdate(dto) {
    const obj = {};
    if (dto.username) obj.username = dto.username;
    if (dto.firstName || dto.lastName || dto.avatar) {
      obj.profile = {};
      if (dto.firstName) obj.profile.firstName = dto.firstName;
      if (dto.lastName) obj.profile.lastName = dto.lastName;
      if (dto.avatar) obj.profile.avatar = dto.avatar;
    }
    return flattenObj("", obj);
  }
  getProfileDTO(userDB,imageUrl){
    return {
      firstName:userDB?.profile?.firstName || null,
      lastName:userDB?.profile?.lastName || null,
      username:userDB?.username || null,
      email:userDB?.email || null,
      imageUrl:imageUrl || ""
    }
  }
  getRequests(requestsDB){
    const data = requestsDB.map(element =>{
      return {
        id:element.requester?._id,
        username:element.requester?.username,
        firstName:element.requester?.profile?.firstName || null,
        lastName:element.requester?.profile?.lastName || null,
        imageUrl:element.avatarUrl|| null
      }
    });
    return data ;
  }
}

module.exports = new UserMapper();