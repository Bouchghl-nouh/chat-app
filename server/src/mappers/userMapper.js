const flattenObj = require("../utils/flattenObj");
const { getPresignedUrl } = require("../utils/fileService");
class UserMapper {
  toPersistenceUpdate(dto) {
    const obj = {};
    if (dto.username) obj.username = dto.username;
    if (dto.firstName || dto.lastName || dto.avatar || dto.description) {
      obj.profile = {};
      if (dto.firstName) obj.profile.firstName = dto.firstName;
      if (dto.lastName) obj.profile.lastName = dto.lastName;
      if (dto.avatar) obj.profile.avatar = dto.avatar;
      if (dto.description) obj.profile.description = dto.description;
    }
    return flattenObj("", obj);
  }
  getProfileDTO(userDB, avatar) {
    return {
      firstName: userDB?.profile?.firstName || "",
      lastName: userDB?.profile?.lastName || "",
      username: userDB?.username || "",
      avatar: avatar || "",
      description: userDB?.profile?.description || "",
    };
  }
  getMyProfileDTO(userDB, imageUrl) {
    return {
      firstName: userDB?.profile?.firstName || "",
      lastName: userDB?.profile?.lastName || "",
      username: userDB?.username || "",
      email: userDB?.email || "",
      avatar: imageUrl || "",
      description: userDB?.profile?.description || "",
    };
  }
  getUsersDTO(requestsDB) {
    const data = requestsDB.map((element) => {
      return {
        id: element?._id,
        username: element?.username,
        firstName: element?.profile?.firstName || "",
        lastName: element?.profile?.lastName || "",
        avatar: element.avatarUrl || "",
      };
    });
    return data;
  }
  async getUsersWithImages(DBdata) {
    return await Promise.all(
      DBdata.map(async (element) => {
        return await this.getUserWithImage(element);
      }),
    );
  }
  async getUserWithImage(element) {
    const avatarKey = element?.profile?.avatar?.url;
    if (!avatarKey) {
      return {
        ...element,
        avatarUrl: "",
      };
    }
    const resp = await getPresignedUrl(avatarKey);
    return {
      ...element,
      avatarUrl: resp.data.downloadUrl ?? "",
    };
  }
}

module.exports = new UserMapper();
