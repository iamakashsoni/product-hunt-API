const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
    const { content } = req.body;
    const productId = req.params.id;
    const userId = req.user.id;

    try {
        const comment = await Comment.create({
            productId,
            userId,
            content
        });

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add comment', error });
    }
};

exports.addReply = async (req, res) => {
    const commentId = req.params.commentId;
    const userId = req.user.id;
    const { content } = req.body;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        const reply = {
            userId,
            content,
            createdAt: new Date()
        };

        comment.replies.push(reply);
        await comment.save();

        res.status(201).json({ message: 'Reply added', reply });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add reply', error });
    }
};

exports.getComments = async (req, res) => {
    const productId = req.params.id;

    try {
        const comments = await Comment.find({ productId })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch comments', error });
    }
};
