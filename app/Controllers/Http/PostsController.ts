import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'

export default class PostsController {
  
  public async index({ auth }: HttpContextContract) {
    await auth.authenticate();
    const posts = await Post.query().preload("user")
    return posts;
  }

  public async show({ auth, params }: HttpContextContract) {
    await auth.authenticate();
    try {
      const post = await Post.find(params.id);
      if (post) {
        await post.load("user");
        return post;
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async update({ auth, request, params }: HttpContextContract) {
    await auth.authenticate();
    const post = await Post.find(params.id);

    if (post) {
      post.content = request.input("content");
      if (await post.save()) {
        await post.load("user");
        return post;
      }
      return; // 422
    }

    return; // 401
  }

  public async store({ auth, request }: HttpContextContract) {
    const user = await auth.authenticate();
    const post = new Post();
    post.content = request.input("content");
    await user.related("posts").save(post);
    await post.load("user");
    return post;
  }

  public async destroy({
    auth,
    params,
  }: HttpContextContract) {
    const user = await auth.authenticate();
    await Post.query()
      .where("user_id", user.id)
      .where("id", params.id)
      .delete();
    return;
  }
  
}
