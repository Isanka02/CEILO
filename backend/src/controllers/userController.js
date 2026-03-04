import User from '../models/User.js';
import { deleteCloudinaryImage } from '../config/cloudinary.js';
import { body, validationResult } from 'express-validator';

// ─── Validation Rules ────────────────────────────────────────────────────────

export const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
];

export const addAddressValidation = [
  body('street').trim().notEmpty().withMessage('Street is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('zip').trim().notEmpty().withMessage('Zip code is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
];

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return true;
  }
  return false;
};

// ─── Controllers ─────────────────────────────────────────────────────────────

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
    if (handleValidationErrors(req, res)) return;

    const { name } = req.body;
    const updates  = {};
    if (name) updates.name = name;

    // Handle avatar upload via Cloudinary multer
    if (req.file) {
      const existing = await User.findById(req.user.id).select('avatar');
      if (existing.avatar) await deleteCloudinaryImage(existing.avatar);
      updates.avatar = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    if (handleValidationErrors(req, res)) return;
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
    const before = user.addresses.length;
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.addressId);
    if (user.addresses.length === before) return res.status(404).json({ message: 'Address not found' });
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