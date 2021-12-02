const router = require("express").Router();
const Marker = require("../models/Marker");

//create a pin
router.post("/", async (req, res) => {
  const newMarker = new Marker(req.body);
  try {
    const savedMarker = await newMarker.save();
    res.status(200).json(savedMarker);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all pins
router.get("/", async (req, res) => {
  try {
    const marker = await Marker.find();
    res.status(200).json(marker);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;