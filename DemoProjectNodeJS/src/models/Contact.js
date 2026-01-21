const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    adress: { type: String },}, { timestamps: true });

contactSchema.pre('save', async function() {
    if(this.isModified('email')) {
        const existingContact = await mongoose.models.Contact.findOne({ email: this.email });
    }
    if(existingContact && existingContact._id.toString() !== this._id.toString()) {
        throw new Error('Email already in use');
    }
}
);

module.exports = mongoose.model('Contact', contactSchema);