// Create web server
// 1. Create a web server
// 2. Create a route for GET /comments
// 3. Create a route for GET /comments/:id
// 4. Create a route for POST /comments
// 5. Create a route for PUT /comments/:id
// 6. Create a route for DELETE /comments/:id

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { Comment } = require('../models/comment');

// 2. Create a route for GET /comments
router.get('/', async (req, res) => {
    const comments = await Comment.find().sort('-dateCreated');
    res.send(comments);
});

// 3. Create a route for GET /comments/:id
router.get('/:id', async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).send('The comment with the given ID was not found.');
    res.send(comment);
});

// 4. Create a route for POST /comments
router.post('/', async (req, res) => {
    const { error } = validateComment(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let comment = new Comment({
        comment: req.body.comment,
        dateCreated: req.body.dateCreated
    });

    comment = await comment.save();
    res.send(comment);
});

// 5. Create a route for PUT /comments/:id
router.put('/:id', async (req, res) => {
    const { error } = validateComment(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const comment = await Comment.findByIdAndUpdate(req.params.id, {
        comment: req.body.comment,
        dateCreated: req.body.dateCreated
    }, { new: true });

    if (!comment) return res.status(404).send('The comment with the given ID was not found.');

    res.send(comment);
});

// 6. Create a route for DELETE /comments/:id
router.delete('/:id', async (req, res) => {
    const comment = await Comment.findByIdAndRemove(req.params.id);

    if (!comment) return res.status(404).send('The comment with the given ID was not found.');

    res.send(comment);
});

function validate