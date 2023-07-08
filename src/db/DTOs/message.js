class MessageDto {
    constructor(_id, user, message) {
        this._id = _id;
        this.user = user;
        this.message = message;
    }
}
module.exports = MessageDto;
