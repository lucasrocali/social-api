import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {

  public async index({ auth }: HttpContextContract) {
    await auth.authenticate();
    const users = await User.query();
    return users;
  }

  public async show({  params }: HttpContextContract) {
    try {
      const user = await User.find(params.id);
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  public async posts({ auth, params }: HttpContextContract) {
    await auth.authenticate();
    const user = await User.find(params.id);
    if (user) {
      await user.load("posts");;
      return user.posts;
    }
    return;
  }

}
