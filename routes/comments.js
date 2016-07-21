var express = require('express');
var router = express.Router({
  mergeParams: true
});

var Campground = require('../models/campground'),
  Comment = require('../models/comment'),
  middleware = require('../middleware');

// Campground Comment NEW

router.get('/new', middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.campground_id, function(err, foundCampground) {
    if (err) {
      req.flash('error', 'Campground was not found');
      res.redirect('back');
    } else {
      res.render('comments/new', {
        campground: foundCampground
      });
    }
  });
});

// Campground Comment CREATE

router.post('/', middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.campground_id, function(err, campground) {
    if (err) {
      req.flash('error', 'Campground was not found');
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          req.flash('error', 'Comment could not be created');
          res.redirect('/campgrounds');
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash('success', 'Comment was added');
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

// Campground Comment EDIT

router.get('/:comment_id/edit', middleware.checkCommentOwnership,
  function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        req.flash('error', 'Comment was not found');
        res.redirect('back');
      } else {
        res.render('comments/edit', {
          comment: foundComment,
          campground_id: req.params.campground_id
        });
      }
    });
  }
);

// Campground Comment UPDATE

router.put('/:comment_id', middleware.checkCommentOwnership,
  function(req, res) {
    Comment.findByIdAndUpdate(
      req.params.comment_id, req.body.comment,
      function(err) {
        if (err) {
          req.flash('error', 'Comment was not found');
          res.redirect('back');
        } else {
          req.flash('success', 'Comment was updated');
          res.redirect('/campgrounds/' + req.params.campground_id);
        }
      }
    );
  }
);

// Campground Comment DESTROY

router.delete('/:comment_id', middleware.checkCommentOwnership,
  function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
      if (err) {
        req.flash('error', 'Comment was not found');
        res.redirect('back');
      } else {
        req.flash('success', 'Comment was deleted');
        res.redirect('/campgrounds/' + req.params.campground_id);
      }
    });
  }
);

// Module Export

module.exports = router;
