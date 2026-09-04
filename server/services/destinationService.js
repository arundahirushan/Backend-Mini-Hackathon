const Destination = require("../models/Destination");

async function getAllDestinations(filters = {}) {
  const query = {};
  if (filters.district) {
    query.district = { $regex: new RegExp(filters.district, "i") };
  }
  if (filters.category) {
    query.category = { $regex: new RegExp(filters.category, "i") };
  }
  return await Destination.find(query);
}

async function getDestinationById(id) {
  return await Destination.findById(id);
}

async function createDestination(data) {
  const destination = new Destination(data);
  return await destination.save();
}

async function updateDestination(id, data) {
  return await Destination.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

async function deleteDestination(id) {
  return await Destination.findByIdAndDelete(id);
}

module.exports = {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
};
