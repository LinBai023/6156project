const User = require('../lib/mongo').User

module.exports = {
    // create a user
    create: function create (user) {
        return User.create(user).exec() //set up user as global variable
    },

    getUserByName: function getUserByName(name){
        return User
            .findOne({name : name})
            .addCreatedAt()
            .exec()
    }
}