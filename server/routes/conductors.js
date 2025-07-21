const express = require('express');
const router = express.Router();
const Conductor = require('../models/Conductor');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { propietarioId, nombre, apellido, placa, cedula } = req.body;
  try {
    const newConductor = await Conductor.create({
      propietario: propietarioId,
      nombre,
      apellido,
      placa,
      cedula
    });
    await User.findByIdAndUpdate(propietarioId, { $push: { conductors: newConductor._id } });
    res.status(201).json(newConductor);
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar conductor' });
  }
});

router.get('/by-propietario/:id', async (req, res) => {
  const { id } = req.params;
  const conductores = await Conductor.find({ propietario: id });
  res.json(conductores);
});

module.exports = router;
