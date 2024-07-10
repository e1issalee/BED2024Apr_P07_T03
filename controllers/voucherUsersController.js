const VoucherUsers = require("../models/voucherUser");

const getVoucherUserById = async (req, res) => {
    const voucherUserId = parseInt(req.params.id);
    try {
      const voucherUser = await VoucherUsers.getVoucherUserById(voucherUserId);
      if (!voucherUser) {
        return res.status(404).send("VoucherUser not found");
      }
      res.json(voucherUser);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving voucherUser");
    }
};

const createVoucherUsers = async (req, res) => {
    const { createVuVoucherId, createVuUserId } = req.body;
    try {
      const createdVoucherUser = await VoucherUsers.createVoucherUsers(createVuVoucherId, createVuUserId);
      res.status(201).json(createdVoucherUser);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating voucherUser");
    }
};

module.exports = {
    getVoucherUserById,
    createVoucherUsers,
};