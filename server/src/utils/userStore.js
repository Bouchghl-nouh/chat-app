class UserStore {
    constructor(){
        this.store = new Map();
    }
    async set(userId){
        this.store.set(userId,"online");
    }
    async isOnline(userId){
       return this.store.has(userId) || null;
    }
    async delete(userId){
        return this.store.delete(userId);
    }
    async getAll(){
        return Array.from(this.store.keys());
    }
}


module.exports = new UserStore();