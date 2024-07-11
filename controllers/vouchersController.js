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

const getVouchersWithUsers = async (req, res) => {
  try {
    const vouchers = await Voucher.getVouchersWithUsers();
    res.json(vouchers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching vouchers with users" });
  }
}

const deleteVoucher = async (req, res) => {
  const voucherId = parseInt(req.params.id);

  try {
    const success = await Voucher.deleteVoucher(voucherId);
    if (!success) {
      return res.status(404).send("Voucher not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting voucher");
  }
};

module.exports = {
    getVoucherById,
    createVoucher,
    getVouchersWithUsers,
    deleteVoucher,
};