const User = require("../entities/userSchema");

class UserRepository {
  async create(username,email, password) {
    return await User.create({ username,email,password });
  }
  async findByUserName(username){
    return await User.findOne({username});
  } 
  async findByEmail(email){
    return await User.findOne({email});
  }
  async findById(id){
    return await User.findById(id);
  }
}

module.exports = new UserRepository();