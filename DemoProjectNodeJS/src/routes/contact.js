const express = require('express');
const router = express.Router();
const {
    getContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact,
    searchContacts
} = require('../controller/contactController');

// Routes
router.route('/')
    .get(getContacts)
    .post(createContact);

router.route('/:id')
    .get(getContact)
    .put(updateContact)
    .delete(deleteContact);

router.route('/search/:keyword')
    .get(searchContacts);

module.exports = router;