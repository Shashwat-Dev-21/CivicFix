const Issue = require('../models/Issue');

const createIssue = async (req, res) => {
  try {
    const { title, description, category, location, imageUrl } = req.body;

    const issue = await Issue.create({
      title,
      description,
      category,
      location,
      imageUrl,
      reportedBy: req.user._id,
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const isOwner = issue.reportedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this issue' });
    }

    const { title, description, category, location, imageUrl, status } = req.body;

    if (title) issue.title = title;
    if (description) issue.description = description;
    if (category) issue.category = category;
    if (location) issue.location = location;
    if (imageUrl !== undefined) issue.imageUrl = imageUrl;

    if (status && isAdmin) {
      issue.status = status;
    }

    const updatedIssue = await issue.save();
    res.status(200).json(updatedIssue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const isOwner = issue.reportedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this issue' });
    }

    await issue.deleteOne();
    res.status(200).json({ message: 'Issue removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name email')
      .populate('comments.postedBy', 'name');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.status(200).json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const comment = {
      text,
      postedBy: req.user._id,
    };

    issue.comments.push(comment);
    await issue.save();

    res.status(201).json(issue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const toggleUpvote = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const userId = req.user._id.toString();
    const alreadyUpvoted = issue.upvotes.some(
      (id) => id.toString() === userId
    );

    if (alreadyUpvoted) {
      issue.upvotes = issue.upvotes.filter((id) => id.toString() !== userId);
    } else {
      issue.upvotes.push(req.user._id);
    }

    await issue.save();

    res.status(200).json({
      upvoteCount: issue.upvotes.length,
      upvoted: !alreadyUpvoted,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createIssue, getIssues, getIssueById, updateIssue, deleteIssue, addComment, toggleUpvote };