const Post = require('../models/post');

exports.createPost = (req,res,next) => {
    const url = req.protocol + '://' + req.get('host');
     const post = new Post({
         title: req.body.title,
         content: req.body.content,
         imagePath: url + "/images/" + req.file.filename,
         creator: req.userData.userId
     });
  
     post.save().then((result) => {
         res.status(201).json({
             message: 'Post added Successfully',
             post:{
                 ...result,
                 id: result._id
             }
         });
     })
     .catch(err => {
         res.status(500).json({error:err.message, message:'You are not authorized!'})
     });
     
 }

 exports.getPosts = (req,res,next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    if(pageSize && currentPage){
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
   postQuery.find().then(document => {
       console.log(document);
       res.status(200).json({
        message:'Post fetched successfully',
        posts: document
     })
   })
   .catch(err => status(500).json({error:err.message, message:'Post fetch failed!'}));
}

exports.getPost = (req,res,next) => {
    Post.findById(req.params.id).then(post => {
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message:'post not found!'});
        }
    })
    .catch(err => status(500).json({error:err.message, message:'Post fetch Failed!'}));
}

exports.updatePost = (req,res,next) => {
    let imagePath = req.body.imagePath;
    if(req.file){
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    })
    console.log(post)
    Post.updateOne({_id:req.params.id, creator: req.userData.userId},post).then(result => {
        if(result.nModified > 0)
        {
            res.status(200).json({message:'update success!'});
        }else{
            res.status(401).json({message: 'Unauthorized user!'})
        }

        
    })
    .catch(err => {
        res.status(500).json({error:err.message, message:'Unknown Error Occured!'})
    })
}

exports.deletePost = (req,res) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then((result)=>{
        if(result.n > 0){
            res.status(200).json({message: 'post deleted successfully!'});
        }else{
            res.status(401).json({message:'Unauthorized user!'})
        }
        
    })
    .catch(err => {
        res.status(500).json({error:err.message, message:'Unknown Error Occured!'})
    })
    
}