const router = require('express').Router();
const postController = require('../controllers/postController');

//read post
router.get('/:id',postController.readPost);
//create post
router.post('/',postController.createPost);
//update post
router.put('/:id',postController.updatePost);
//delete post
router.delete('/:id',postController.deletePost);
// like post
router.patch('/like-post/:id',postController.likePost);
// unlike post
router.patch('/unlike-post/:id',postController.unlikePost);

//comments
router.patch('/comment-post/:id',postController.commentPost);
router.patch('/edit-comment-post/:id',postController.editCommentPost);
router.delete('/delete-comment-post/:id',postController.deleteCommentPost);
module.exports = router;