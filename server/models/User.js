const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ['propietario', 'conductor'], required: true },
  name: String,
  email: { type: String, unique: true },
  password: String,
  conductors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conductor' }]
});

module.exports = mongoose.model('User', userSchema);
