export default class ProductDTO {
    constructor(product) {
      this.description = product.description;
      this.image = product.image;
      this.price = product.price;
      this.stock = product.stock;
      this.category = product.category;
    }
  
    toJSON() {
      return {
        description: this.description,
        image: this.image,
        price: this.price,
        stock: this.stock,
        category: this.category,
      };
    }
  }