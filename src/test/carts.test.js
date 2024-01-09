import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app'; 

chai.use(chaiHttp);
const expect = chai.expect;

describe('Cart API Tests', () => {
  let createdCartId; 

  // Test para obtener todos los carritos
  it('Should get all carts', async () => {
    const res = await chai.request(app).get('/api/carts');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });

  // Test para agregar un nuevo carrito
  it('Should add a new cart', async () => {
    const newCart = {
      userId: 'exampleUserId',
      products: [
        { productId: 'exampleProductId1', quantity: 2 },
        { productId: 'exampleProductId2', quantity: 1 },
      ],
    };

    const res = await chai.request(app).post('/api/carts').send(newCart);
    expect(res).to.have.status(201);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.equal('Cart added successfully');
    
    createdCartId = res.body.message;
  });

  // Test para obtener un carrito por ID
  it('Should get a cart by ID', async () => {
    if (!createdCartId) {
      this.skip(); 
    }

    const res = await chai.request(app).get(`/api/carts/${createdCartId}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
  });

  it('Should add a product to the cart', async () => {
    if (!createdCartId) {
      this.skip(); 
    }

    const prodId = 'exampleProductId3'; 
    const productToAdd = { productId: prodId, quantity: 3 };

    const res = await chai.request(app).post(`/api/carts/${createdCartId}/products/${prodId}`).send(productToAdd);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.equal('Product added to cart successfully');
  });

  // Test para actualizar un carrito
  it('Should update a cart', async () => {
    if (!createdCartId) {
      this.skip(); 
    }

    const updatedCart = {
      products: [
        { productId: 'updatedProductId1', quantity: 3 },
        { productId: 'updatedProductId2', quantity: 2 },
      ],
    };

    const res = await chai.request(app).put(`/api/carts/${createdCartId}`).send(updatedCart);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.status).to.equal('success');
    expect(res.body.message).to.be.a('string');
  });

  // Test para eliminar un carrito
  it('Should delete a cart', async () => {
    if (!createdCartId) {
      this.skip(); 
    }

    const res = await chai.request(app).delete(`/api/carts/${createdCartId}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.status).to.equal('success');
    expect(res.body.message).to.be.a('string');
  });

});