const Contact = require('../models/Contact');

// Get all contacts
exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get single contact
exports.getContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            data: contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Create new contact
exports.createContact = async (req, res) => {
    try {
        const contact = await Contact.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Contact created successfully',
            data: contact
        });
    } catch (error) {
        if (error.code === 11000) { // MongoDB duplicate key error
            res.status(400).json({
                success: false,
                message: 'Contact with this email already exists'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Error creating contact',
                error: error.message
            });
        }
    }
};

// Update contact
exports.updateContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            message: 'Contact updated successfully',
            data: contact
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                message: 'Another contact with this email already exists'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Error updating contact',
                error: error.message
            });
        }
    }
};

// Delete contact
exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            message: 'Contact deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Search contacts
exports.searchContacts = async (req, res) => {
    try {
        const keyword = req.params.keyword;

        const contacts = await Contact.find({
            $or: [
                { firstName: { $regex: keyword, $options: 'i' } },
                { lastName: { $regex: keyword, $options: 'i' } },
                { email: { $regex: keyword, $options: 'i' } },
                { phone: { $regex: keyword, $options: 'i' } },
                { company: { $regex: keyword, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
}