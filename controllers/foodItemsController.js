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

const saveTabContent = async (req, res) => {
  try {
    const { tabName, tabContent } = req.body; // Assuming you're sending tabName and tabContent in the request body
    await foodItemsModel.saveTabContent(tabName, tabContent); // Call the model function to save the tab content

    res.status(200).json({ message: 'Tab content saved successfully' });
  } catch (error) {
    console.error('Error saving tab content:', error);
    res.status(500).json({ error: 'Failed to save tab content' });
  }
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

const fetchFoodItems = async (req, res) => {
  try {
    const tab = req.query.tab; // Extract the 'tab' query parameter from the URL
    const result = await db.query('SELECT * FROM food_items WHERE tabName = $1', [tab]); // Use the tab value to filter results
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
  saveTabContent,
  fetchFoodItems,
  getAllFoodItems,
  getFoodItemById,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
  getNutritionData
};