const destinationService = require("../services/destinationService");

async function getAll(req, res) {
  try {
    const { district, category } = req.query;
    const destinations = await destinationService.getAllDestinations({ district, category });
    res.status(200).json(destinations);
  } catch (error) {
    console.error("Get All Destinations Error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

async function getOne(req, res) {
  try {
    const destination = await destinationService.getDestinationById(req.params.id);
    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }
    res.status(200).json(destination);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Destination not found" });
    }
    console.error("Get One Destination Error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

async function create(req, res) {
  try {
    const { name, district, category, description, imageUrl, entryFeeLKR, recommendedDays, bestSeasonMonths, travelTip, estimatedDailyCostLKR } = req.body;
    if (!name || !district || !category || !description) {
      return res.status(400).json({ error: "Name, district, category, and description are required" });
    }

    // Only pass known fields — never pass raw req.body directly
    const destination = await destinationService.createDestination({
      name, district, category, description,
      imageUrl, entryFeeLKR, recommendedDays,
      bestSeasonMonths, travelTip, estimatedDailyCostLKR
    });
    res.status(201).json(destination);
  } catch (error) {
    console.error("Create Destination Error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

async function update(req, res) {
  try {
    const destination = await destinationService.updateDestination(req.params.id, req.body);
    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }
    res.status(200).json(destination);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Destination not found" });
    }
    console.error("Update Destination Error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

async function remove(req, res) {
  try {
    const destination = await destinationService.deleteDestination(req.params.id);
    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }
    res.status(200).json({ message: "Destination deleted" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Destination not found" });
    }
    console.error("Delete Destination Error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove
};
