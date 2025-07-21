const mongoose = require('mongoose');

const conductorSchema = new mongoose.Schema({
  propietario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  nombre: String,
  apellido: String,
  placa: String,
  cedula: String,
  fotoConductor: String,
  fotoVehiculo: String,
  pdfCedula: String,
  pagos: [{ fecha: Date, estado: String }]
});

module.exports = mongoose.model('Conductor', conductorSchema);
