// models/recipe.js
const sql = require('mssql');
const dbConfig = require('../dbConfig');

const saveRecipe = async (userId, recipeId) => {
    try {
        let pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .input('recipeId', sql.Int, recipeId)
            .query('INSERT INTO UserRecipes (userId, recipeId) VALUES (@userId, @recipeId)');
        return result.rowsAffected[0];
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
};

const deleteRecipe = async (userId, recipeId) => {
    try {
        let pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .input('recipeId', sql.Int, recipeId)
            .query('DELETE FROM UserRecipes WHERE userId = @userId AND recipeId = @recipeId');
        return result.rowsAffected[0];
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
};

const getSavedRecipes = async (userId) => {
    try {
        let pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT r.recipeId, m.strMeal, m.strMealThumb FROM UserRecipes r JOIN Meals m ON r.recipeId = m.idMeal WHERE r.userId = @userId');
        return result.recordset;
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
};


module.exports = {
    saveRecipe,
    deleteRecipe,
    getSavedRecipes,
};
