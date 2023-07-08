class ProductDto {
    constructor(_id, title, description, code, price, stock, category, thumbnail, owner) {
        this._id = _id
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.thumbnail = thumbnail;
        this.owner = owner;
    }
}
module.exports = ProductDto;
