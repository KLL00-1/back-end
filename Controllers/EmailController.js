import MessageModal from "../models/Message.js";

export const createEmail = async (req, res) => {
  try {
    const email = await MessageModal.findOne({ email: req.body.email });

    if (email) {
      return res.status(500).json({
        message: "such mail already exists",
      });
    }

    const doc = new MessageModal({
      email: req.body.email,
    });
    const message = await doc.save();
    res.status(200).json({ info: "new message created!", message });
  } catch (err) {
    console.log(err);
  }
};

export const getEmails = async (req, res) => {
  try {
    const email = await MessageModal.find();
    res.status(200).json(email);
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "emails не найдены",
    });
  }
};
