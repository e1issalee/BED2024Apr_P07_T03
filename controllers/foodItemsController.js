// controllers/foodItemsController.js

const Food = require("../models/foodItems");

const https = require('https');

const apiKey = 'ePEMsKNNWSSbdHOumQha5A==hqJvNcEX4hiyXdjS';

const getNutritionData = (req, res) => {
  const query = req.query.query || '';
  const url = `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`;

  const options = {
    headers: {
      'X-Api-Key': apiKey
    }
  };

  https.get(url, options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      if (response.statusCode === 200) {
        res.json(JSON.parse(data));
      } else {
        res.status(response.statusCode).json({ error: data });
      }
    });
  }).on('error', (e) => {
    console.error('Request failed:', e.message);
    res.status(500).json({ error: 'Request failed' });
  });
};

const getAllFoodItems = async (req, res) => {
    try {
      const foods = await Food.getAllFoodItems();
      res.json(foods);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving food");
    }
  };

  const getFoodItemById = async (req, res) => {
    const foodId = parseInt(req.params.id);
    try {
      const food = await Food.getFoodItemById(foodId);
      if (!food) {
        return res.status(404).send("Food not found");
      }
      res.json(food);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving food");
    }
  };

  const createFoodItem = async (req, res) => {
    const newFoodItem = req.body;

    try {
        const itemId = await Food.createFoodItem(newFoodItem);
        res.status(201).json({ id: itemId });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating food item");
    }
  };

  const updateFoodItem = async (req, res) => {
    const foodId = parseInt(req.params.id);
    const newFoodData = req.body;
  
    try {
      const updatedFood = await Food.updateFoodItem(foodId, newFoodData);
      if (!updatedFood) {
        return res.status(404).send("Food not found");
      }
      res.json(updatedFood);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating Food");
    }
  };

  const deleteFoodItem = async (req, res) => {
    const foodId = parseInt(req.params.id);
  
    try {
      const success = await Food.deleteFoodItem(foodId);
      if (!success) {
        return res.status(404).send("Food not found");
      }
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting food");
    }
  };

module.exports = {
    getAllFoodItems,
    getFoodItemById,
    createFoodItem,
    updateFoodItem,
    deleteFoodItem,
    getNutritionData
};