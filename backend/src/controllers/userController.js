import User from '../models/User.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, avatar }, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses.push(req.body);
    await user.save();
    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.addressId);
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSavedItems = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedItems');
    res.json(user.savedItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveItem = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.savedItems.includes(req.params.productId)) {
      user.savedItems.push(req.params.productId);
      await user.save();
    }
    res.json(user.savedItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeSavedItem = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedItems = user.savedItems.filter(id => id.toString() !== req.params.productId);
    await user.save();
    res.json(user.savedItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};