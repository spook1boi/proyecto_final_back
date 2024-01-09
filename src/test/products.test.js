import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app'; 

chai.use(chaiHttp);
const expect = chai.expect;

describe('Product API Tests', () => {
  let createdProductId;

  // Test para obtener todos los productos
  it('Should get all products', async () => {
    const res = await chai.request(app).get('/api/products');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });

  // Test para agregar un nuevo producto
  it('Should add a new product', async () => {
    const newProduct = {
      name: 'Example Product',
      price: 19.99,
      category: 'Electronics',
    };

    const res = await chai.request(app).post('/api/products').send(newProduct);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.status).to.equal('success');
    expect(res.body.message).to.be.a('string');

    createdProductId = res.body.message;
  });

  // Test para obtener un producto por ID
  it('Should get a product by ID', async () => {
    if (!createdProductId) {
      this.skip(); 
    }

    const res = await chai.request(app).get(`/api/products/${createdProductId}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
  });

  // Test para actualizar un producto
  it('Should update a product', async () => {
    if (!createdProductId) {
      this.skip();
    }

    const updatedProduct = {
      name: 'Updated Product',
      price: 29.99,
    };

    const res = await chai.request(app).put(`/api/products/${createdProductId}`).send(updatedProduct);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.status).to.equal('success');
    expect(res.body.message).to.be.a('string');
  });

  // Test para eliminar un producto
  it('Should delete a product', async () => {
    if (!createdProductId) {
      this.skip();
    }

    const res = await chai.request(app).delete(`/api/products/${createdProductId}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.status).to.equal('success');
    expect(res.body.message).to.be.a('string');
  });

});