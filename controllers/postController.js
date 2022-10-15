const Post = require('../models/post');

exports.createPost = async (req, res) => {
  // const post = new Post({ ...req.body, creator: req.user._id });
  const { title, markdown } = req.body;
  // const markdown = req.body.markdown;
  const post = new Post({ title, markdown });
  try {
    await post.save();
    // res.render('preview');
    res.redirect('blog');
    // res.status(201).send(post);
  } catch (e) {
    res.status(400).send(e);
  }
};

// exports.getPosts = async (req, res) => {
//   const articles = await Post.find().sort({ createdAt: 'desc' });
//   // res.status(200).send(posts);
//   res.render('blog', { articles: articles });
// };

exports.getPersonalPost = async (req, res) => {
  // const personalPost =
  // try {
  //   await req.user.populate({
  //     path: 'posts',
  //   });
  //   console.log(req.user.posts);
  //   res.send(req.user.posts);
  // } catch (error) {
  //   res.status(500).send;
  // }
  // console.log(req.params.id);
  // const id = req.params.id;

  // try {
  //   const article = await Post.findOne({ id });
  //   if (!article) {
  //     return res.status(404).send();
  //   }
  //   // res.render('preview', { article: article });
  //   res.send(article);
  //   console.log(article);
  // } catch (error) {
  //   res.send(error);
  // }

  const _id = req.params.id;

  try {
    const post = await Post.findOne({ _id });
    if (!post) {
      return res.status(404).send();
    }
    console.log(post);
    // res.redirect('/');
    res.render('preview', { post: post });
    // res.send(post);
  } catch (e) {
    res.status(500).send();
  }
};

exports.write = async (req, res) => {
  res.render('write');
};
exports.updatePost = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'markdown'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  }
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      return res.status(404).send();
    }
    updates.forEach((update) => (post[update] = req.body[update]));
  } catch (error) {
    res.status(400).send(error);
  }
};
