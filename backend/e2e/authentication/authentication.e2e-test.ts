import * as express from 'express';
import * as request from 'supertest';
import {Test} from '@nestjs/testing';

import {AuthModule} from '../../src/auth/auth.module';
import {PASSWORD_CRYPTOGRAPHER_TOKEN} from '../../src/auth/constants';
import {UtilisateurModule} from '../../src/utilisateur/utilisateur.module';
import {UtilisateurService} from '../../src/utilisateur/utilisateur.service';
import {CUtilisateur} from '../../src/utilisateur/utilisateur.entity';
import {UtilisateurRole} from '../../src/utilisateur/utilisateur.role';
import {IUtilisateur} from '@aleaac/shared';

describe('Authentication system', () => {
  const server = express();
  server.use((req, res, next) => {
    if (req.query.mockUtilisateur === 'true') {
      req.user = {id: 1, role: UtilisateurRole.Admin};
    }
    next();
  });

  const utilisateurServiceMock = {
    async create(utilisateur: IUtilisateur, password: string) {
      return {id: 1, role: UtilisateurRole.Admin, email: utilisateur.login};
    },
    async findOneByEmail(email: string) {
       // console.log('findOneByEmail', email);
      return {id: 1, role: UtilisateurRole.Admin, email, password: {hash: 'hash'}};
    }
  };

  const passwordCryptographerMock = {
    doCompare(password: string, hash: string) {
      return hash === 'hash';
    }
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [UtilisateurModule, AuthModule]
    })
      .overrideComponent(UtilisateurService)
      .useValue(utilisateurServiceMock)
      .overrideComponent(PASSWORD_CRYPTOGRAPHER_TOKEN)
      .useValue(passwordCryptographerMock)
      .compile();

    const app = module.createNestApplication(server);
    await app.init();
  });

  it('should successfully register new utilisateur', async () => {
    const response = await request(server)
      .post('/api/v1/utilisateurs')
      .send({
        utilisateur: {
          email: 'test@test.test'
        },
        password: 'qwerty123'
      });
    const data = response.body.data.data;

    expect(response.status).toEqual(201);
    expect(data.id).toEqual(1);
    expect(data.email).toEqual('test@test.test');
  });

  it('should successfully login utilisateur', async () => {
    const response = await request(server)
      .post('/api/v1/auth')
      .send({
        email: 'test@test.test',
        password: 'qwerty123'
      });

    const data = response.body.data;

    expect(response.status).toEqual(201);
    expect(data.token).toBeDefined();
    expect(data.utilisateur.id).toEqual(1);
    expect(data.utilisateur.email).toEqual('test@test.test');
  });

  it('should fail to login when email is invalid', async () => {
    const response = await request(server)
      .post('/api/v1/auth')
      .send({
        email: 'test',
        password: 'qwerty123'
      });

    const data = response.body.data;

    expect(response.status).toEqual(400);
  });
});
