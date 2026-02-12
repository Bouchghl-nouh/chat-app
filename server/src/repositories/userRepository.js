const User = require("../models/userSchema");
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
  async update(id,data){
    return await User.findByIdAndUpdate(
    id, 
    { $set: data }, 
    { new: true}
  );
  }
  async findUsers(query,{page,limit}){
    const skip = (page-1)*limit ;
    const [users,total] = await Promise.all([
      User.find(query).skip(skip).limit(limit).lean(),
      User.countDocuments(query),
    ]);
    return {
      users,
      total,
      page,
      pages:Math.ceil(total/limit)
    }
  }
}

module.exports = new UserRepository();