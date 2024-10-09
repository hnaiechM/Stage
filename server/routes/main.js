const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
//const contact = require('')
/**
 * get 
 * home
 */


router.get('', async (req, res) => {

  try {
    const locals = {
      title: "nodejs blog",
      description: "Simple blog created with nodejs express & mongodb."
    }

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Post.countDocuments(); // Remplacement de count() par countDocuments()
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });
  } catch (error) {
    console.log(error);
  }
});


/**
 * get 
 * post :id
 */

router.get('/post/:id', async (req, res) => {

  try {

    let slug = req.params.id;
    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple blog created with nodejs express & mongodb.",
      currentRoute: '/post/${slug}'
    }
    res.render('post', { locals, data });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST
 * post :searchTerm
 */
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Simple blog created with nodejs express & mongodb."
    }
    let searchTerm = req.body.searchTerm;
    const searchSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchSpecialChar, 'i') } },
        { body: { $regex: new RegExp(searchSpecialChar, 'i') } },
      ]
    });
    res.render("search", {
      data,
      locals
    });
  } catch (error) {
    console.log(error);
  }
});

router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  }
  );
});

/**
 * GET 
 * Contact
 */
router.get('/contact', (req, res) => {
  const locals = {
    title: 'Contactez-nous', // Définit le titre de la page
    currentRoute: '/contact'
  };

  res.render('contact', locals);
});


function insertPostData() {
  Post.insertMany(

    {
      title: "Onduleur Tunisie",
      body: "Vous recherchez un onduleur Riello et une opération de maintenance? Nous sommes spécialisés dans la distribution des onduleurs tunisie (c’est la solution innovante qui permet de protéger les applications critiques présentes dans les salles informatiques et installation les data centers, les banques, les établissements médicaux, les assurances et les télécommunications). Vous trouverez sur notre site les meilleures sélections de produits, allant du parasurtenseur au parafoudre, du régulateur de tension à l’onduleur.Nos équipes commerciales et techniques de nouvameq les plus motivés et professionnels dans le domaine d’installation data center en tunisie et qui sont à votre entière disposition pour vous conseiller et vous guider dans le choix de votre onduleur."
    })
}


////insertPostData();

module.exports = router;
//router.get('', async(req,res) => {
// const locals ={
// title: "NodeJS blog",
// description: "Simple Blog with nodejs, express & MongoDb."
//}
//
// try {
// const data = await Post.find();
// res.render('index', { locals,data });
//} catch (error){
// console.log(error);
//}

//});
