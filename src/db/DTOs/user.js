class UserDto {
    constructor(_id, name, lastname, username, email,  password, rol, cartId, documents, last_connection) {
        this._id = _id
        this.name = name;
        this.lastname = lastname;
        this.username =  username
        this.email = email;
        this.rol = rol;
        this.password = password
        this.cartId = cartId;
        this.documents = documents;
        this.last_connection = last_connection;
    }
}
module.exports = UserDto;