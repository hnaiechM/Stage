const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';


const jwtSecret = process.env.JWT_SECRET;
/**
 * 
 * check login
 */

const authMiddlware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId; // Corrigé `res.yserId` en `req.userId`
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};


/**
 * GET
 * Admin: login page
 */
router.get('/admin', async (req, res) => {
  const locals = {
    title: "Admin",
    description: "Simple Blog with nodejs, express & MongoDb."
  }
  try {
    /*const data = await Post.find();*/
    res.render('admin/index', { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }

});

/**
 * POST
 * Admin: Check Login
 */

router.post('/admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});
/**
 * get
 * Admin  dashboard
 */

router.get('/dashboard', authMiddlware, async (req, res) => {


  try {
    const locals = {
      title: 'Dashboard',
      description: "Simple Blog with nodejs, express & MongoDb.",
    }
    const data = await Post.find();
    res.render('admin/dashboard',
      {
        locals, data,
        layout: adminLayout
      });
  } catch (error) {
    console.log(error);
  }

});
/**
 *GET
 * Admin Create New Post
 */
router.get('/add-post', authMiddlware, async (req, res) => {


  try {
    const locals = {
      title: 'add-post',
      description: "Simple Blog with nodejs, express & MongoDb.",
    }
    const data = await Post.find();
    res.render('admin/add-post',
      {
        locals,
        layout: adminLayout
      });
  } catch (error) {
    console.log(error);
  }

});




/*
*POST
* Admin Create New Post
*/
router.post('/add-post', authMiddlware, async (req, res) => {
  try {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body
      });
      await Post.create(newPost);
      res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }

});



/**
 *Put
 * Admin Update post
 */
router.put('/edit-post/:id', authMiddlware, async (req, res) => {


  try {

    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updateAt: Date.now()
    });
    res.redirect(`/edit-post/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }

});

/**
 *<Get />
 * Admin Update post
 */
router.get('/edit-post/:id', authMiddlware, async (req, res) => {


  try {
    const locals = {
      title: "Edit Post",
      description: "free NodeJS User management System",
    };
    const data = await Post.findOne({ _id: req.params.id });
    res.render('admin/edit-post', {
      locals,
      data,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});


/**
 *DELETE
 * Admin Delete post
 */

router.delete('/delete-post/:id', authMiddlware, async (req, res) => {

  try {
    await Post.deleteOne({
      _id: req.params.id
    });
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error)
  }

});



/**
 *Get
 * Admin logout/
 */

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  //  res.json({message: 'logout successful...'});
  res.redirect('/');

});









/**
 * POST
 * Admin: Register
 */

//router.post('/register', async (req, res) => {
//  try {
//    const { username, password } = req.body;
//    const hashedPassword = await bcrypt.hash(password, 10);
//    try{
//      const user = await User.create({ username, password: hashedPassword });
//      res.status(201).json({ message: 'User Created', user});
//    }catch(error){
//      if(error.code === 11000 ){
//        res.status(400).json({ message: 'Username already exists' });
//    }
//      res.status(500).json({message: 'Internal server error'});
//    }
//  } catch (error) {
//    console.log(error);
//    res.status(500).send('An error occurred');
//  }
//});

module.exports = router;