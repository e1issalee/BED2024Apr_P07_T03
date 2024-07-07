// models/foodItemModel.js

const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Food {
  constructor(id, tabName, name, calories, servingSize, carbs, protein, fat) {
    this.id = id;
    this.tabName = tabName;
    this.name = name;
    this.calories = calories;
    this.servingSize = servingSize;
    this.carbs = carbs;
    this.protein = protein;
    this.fat = fat;
    }
  
    static async getAllFoodItems() {
      const connection = await sql.connect(dbConfig);
    
      const sqlQuery = `SELECT * FROM FoodItems`; // Replace with your actual table name
    
      const request = connection.request();
      const result = await request.query(sqlQuery);
    
      connection.close();
    
      return result.recordset.map(
        (row) => new Food(
          row.id,
          row.tabName,
          row.name,
          row.calories,
          row.servingSize,
          row.carbs,
          row.protein,
          row.fat
        )
      );
    }
  
    static async getFoodItemById(id) {
      const connection = await sql.connect(dbConfig);
    
      const sqlQuery = `SELECT * FROM FoodItems WHERE id = @id`; // Parameterized query
    
      const request = connection.request();
      request.input("id", id);
      const result = await request.query(sqlQuery);
    
      connection.close();
    
      return result.recordset[0]
        ? new Food(
            result.recordset[0].id,
            result.recordset[0].tabName,
            result.recordset[0].name,
            result.recordset[0].calories,
            result.recordset[0].servingSize,
            result.recordset[0].carbs,
            result.recordset[0].protein,
            result.recordset[0].fat
          )
        : null;
    }
    
    static async createFoodItem(newFoodItem) {
      const connection = await sql.connect(dbConfig);
    
      const sqlQuery = `
        INSERT INTO FoodItems (tabname, name, calories, servingSize, carbs, protein, fat, quantity)
        VALUES (@tabname, @name, @calories, @servingSize, @carbs, @protein, @fat, @quantity);
        SELECT SCOPE_IDENTITY() AS id`;
    
      const request = connection.request();
      request.input("tabName", newFoodItem.tabName);
      request.input("name", newFoodItem.name);
      request.input("calories", newFoodItem.calories);
      request.input("servingSize", newFoodItem.servingSize || null);
      request.input("carbs", newFoodItem.carbs || null);
      request.input("protein", newFoodItem.protein || null);
      request.input("fat", newFoodItem.fat || null);
      request.input("quantity", newFoodItem.quantity || 1);
    
      const result = await request.query(sqlQuery);
    
      connection.close();
    
      return result.recordset[0].id;
    }
    
    static async updateFoodItemQuantity(id, quantity, calories, carbs, protein, fat, servingSize) {
      const connection = await sql.connect(dbConfig);
      const query = `
        UPDATE FoodItems
        SET 
          quantity = @quantity,
          calories = @calories,
          carbs = @carbs,
          protein = @protein,
          fat = @fat,
          servingSize = @servingSize
        WHERE id = @id
      `;
    
      const request = connection.request();
      request.input('quantity', sql.Int, quantity);
      request.input('calories', sql.Float, calories);
      request.input('carbs', sql.Float, carbs);
      request.input('protein', sql.Float, protein);
      request.input('fat', sql.Float, fat);
      request.input('servingSize', sql.VarChar, servingSize);
      request.input('id', sql.Int, id);
  
      const result = await request.query(query);
  
      return result.rowsAffected[0] > 0; // Return true if rows were updated
    }

    static async fetchFoodItems() {
      try {
        const connection = await sql.connect(dbConfig);
        
        const sqlQuery = 'SELECT * FROM FoodItems'; // SQL query to fetch all records from FoodItems table
        
        const result = await connection.query(sqlQuery);
        connection.close();
    
        return result.recordset; // Return the fetched records as an array of objects
      } catch (error) {
        console.error('Error fetching food items:', error);
        throw new Error('Failed to fetch food items');
      }
    }
    
    static async deleteFoodItem(id) {
      const connection = await sql.connect(dbConfig);
    
      const sqlQuery = `DELETE FROM FoodItems WHERE id = @id`;
    
      const request = connection.request();
      request.input("id", sql.Int, id);
      
      const result = await request.query(sqlQuery);
      connection.close();
    
      return result.rowsAffected > 0;
    }
  }
  
module.exports = Food;
  