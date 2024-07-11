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

module.exports = {
    saveRecipe,
};
