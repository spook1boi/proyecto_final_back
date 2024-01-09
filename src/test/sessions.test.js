import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app'; 

chai.use(chaiHttp);
const expect = chai.expect;

describe('User Authentication Tests', () => {

  // Test para registrar un nuevo usuario
  it('Should register a new user', async () => {
    const newUser = {
      first_name: 'Edu',
      last_name: 'Zul',
      email: 'correo@ejemplo.com',
      age: 25,
      password: 'pass123',
    };

    const res = await chai.request(app).post('/api/sessions/register').send(newUser);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.equal('User registered successfully');
  });

  // Test para iniciar sesión
  it('Should login a user', async () => {
    const credentials = {
      email: 'correo@ejemplo.com',
      password: 'pass123',
    };

    const res = await chai.request(app).post('/api/sessions/login').send(credentials);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.token).to.exist;
  });

  // Test para obtener información del usuario actual
  it('Should get current user information', async () => {
    const res = await chai.request(app).get('/api/sessions/current');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
  });

  // Test para cambiar el rol de un usuario
  it('Should change user role', async () => {
    const userId = 'exampleUserId'; 
    const newRole = 'admin'; 

    const res = await chai.request(app).post(`/api/sessions/change-role/${userId}`).send({ newRole });
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.rol).to.equal(newRole);
  });

  describe('User Authentication Tests', () => {

    // Test para iniciar sesión con credenciales incorrectas
    it('Should not login with incorrect credentials', async () => {
      const invalidCredentials = {
        email: 'nonexistent@example.com',
        password: 'invalidpassword',
    };
  
      const res = await chai.request(app).post('/api/sessions/login').send(invalidCredentials);
      expect(res).to.have.status(401);
      expect(res.body).to.be.an('object');
      expect(res.body.error).to.equal('Invalid credentials');
    })});
  
    // Test para cerrar sesión de un usuario autenticado
    it('Should logout a logged-in user', async () => {
      const res = await chai.request(app).get('/api/sessions/logout');
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('User logged out successfully');
    });
  
    // Test para obtener información de un usuario no autenticado
    it('Should not get current user information for unauthenticated user', async () => {
      const res = await chai.request(app).get('/api/sessions/current');
      expect(res).to.have.status(401);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Unauthorized');
    });
  
    // Test para cambiar el rol de un usuario no autenticado
    it('Should not change user role for unauthenticated user', async () => {
      const userId = 'exampleUserId'; 
      const newRole = 'admin';
  
      const res = await chai.request(app).post(`/api/sessions/change-role/${userId}`).send({ newRole });
      expect(res).to.have.status(401);
      expect(res.body).to.be.an('object');
      expect(res.body.error).to.equal('Unauthorized');
    });
});