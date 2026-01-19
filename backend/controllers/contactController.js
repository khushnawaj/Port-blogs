const Contact = require("../models/Contact");
const asyncHandler = require("../middleware/async");

// Get contact
exports.getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOne({ userId: req.user.id });
  res.status(200).json({ success: true, data: contact });
});

// Create / Update contact
exports.upsertContact = asyncHandler(async (req, res) => {
  let contact = await Contact.findOne({ userId: req.user.id });

  if (contact) {
    contact = await Contact.findOneAndUpdate({ userId: req.user.id }, req.body, { new: true, runValidators: true });
  } else {
    req.body.userId = req.user.id;
    contact = await Contact.create(req.body);
  }

  res.status(200).json({ success: true, data: contact });
});
