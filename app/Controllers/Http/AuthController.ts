import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {

  public async login({ request, auth }: HttpContextContract) {
    const email = request.input('email');
    const password = request.input('password');
    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '10 days',
    });
    return token.toJSON();
  }

  public async register({ request, auth }: HttpContextContract) {
    const nickname = request.input('nickname');
    const name = request.input('name');
    const email = request.input('email');
    const password = request.input('password');
    const newUser = new User();
    newUser.nickname = nickname;
    newUser.name = name;
    newUser.email = email;
    newUser.password = password;    
    await newUser.save();
    const token = await auth.use('api').login(newUser, {
      expiresIn: '10 days',
    });
    return token.toJSON();
  }
  
}
