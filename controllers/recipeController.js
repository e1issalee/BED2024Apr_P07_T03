// controllers/recipeController.js
const Recipe = require('../models/recipe');

const saveRecipe = async (req, res) => {
    const { userId, recipeId } = req.body;

    if (!userId || !recipeId) {
        return res.status(400).send('User ID and Recipe ID are required');
    }

    try {
        const result = await Recipe.saveRecipe(userId, recipeId);
        if (result) {
            res.status(201).send('Recipe saved successfully');
        } else {
            res.status(500).send('Failed to save recipe');
        }
    } catch (error) {
        console.error('Error saving recipe:', error);
        res.status(500).send('Internal Server Error');
    }
};

const deleteRecipe = async (req, res) => {
    const { userId, recipeId } = req.body;

    if (!userId || !recipeId) {
        return res.status(400).send('User ID and Recipe ID are required');
    }

    try {
        const result = await Recipe.deleteRecipe(userId, recipeId);
        if (result) {
            res.status(200).send('Recipe deleted successfully');
        } else {
            res.status(500).send('Failed to delete recipe');
        }
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).send('Internal Server Error');
    }
};

const getSavedRecipes = async (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).send('User ID is required');
    }

    try {
        const recipes = await Recipe.getSavedRecipes(userId);
        res.status(200).json({ recipes });
    } catch (error) {
        console.error('Error fetching saved recipes:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    saveRecipe,
    deleteRecipe,
    getSavedRecipes,
};
