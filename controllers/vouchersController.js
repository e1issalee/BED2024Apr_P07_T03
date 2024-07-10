const Voucher = require("../models/voucher");

const getVoucherById = async (req, res) => {
    const voucherId = parseInt(req.params.id);
    try {
      const voucher = await Voucher.getVoucherById(voucherId);
      if (!voucher) {
        return res.status(404).send("Voucher not found");
      }
      res.json(voucher);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving voucher");
    }
};

const createVoucher = async (req, res) => {
    const { redemptionDate } = req.body;
    try {
      const createdVoucher = await Voucher.createVoucher(redemptionDate);
      res.status(201).json(createdVoucher);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating voucher");
    }
};

module.exports = {
    getVoucherById,
    createVoucher,
};