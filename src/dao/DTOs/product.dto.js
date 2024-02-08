export default class ProductDTO {
    constructor(product) {
      this.title = product.title;
      this.image = product.image;
      this.price = product.price;
      this.stock = product.stock;
      this.category = product.category;
    }
  
    toJSON() {
      return {
        title: this.title,
        image: this.image,
        price: this.price,
        stock: this.stock,
        category: this.category,
      };
    }
  }