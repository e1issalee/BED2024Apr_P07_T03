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

  const updateFoodItemQuantity = async (req, res) => {
    const itemId = parseInt(req.params.id);
    const { quantity, calories, carbs, protein, fat, servingSize } = req.body;
  
    if (isNaN(itemId) || quantity == null) {
      return res.status(400).send("Invalid item ID or quantity");
    }
  
    try {
      const updated = await Food.updateFoodItemQuantity(itemId, quantity, calories, carbs, protein, fat, servingSize);
  
      if (updated) {
        res.status(200).send("Quantity updated successfully");
      } else {
        res.status(404).send("Food item not found");
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      res.status(500).send("Error updating quantity");
    }
  };

  const fetchFoodItems = async (req, res) => {
    const tab = req.query.tab; // Extract the 'tab' query parameter from the URL
    try {
      const result = await Food.fetchFoodItems('SELECT * FROM food_items WHERE tabName = $1', [tab]); // Use the tab value to filter results
      res.json(result.rows); // Send the results back to the client
    } catch (error) {
      console.error('Error fetching food items:', error);
      res.status(500).send('Internal Server Error');
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
  fetchFoodItems,
  getAllFoodItems,
  getFoodItemById,
  createFoodItem,
  updateFoodItemQuantity,
  deleteFoodItem,
  getNutritionData
};