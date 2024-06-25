// models/foodItemModel.js

const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Food {
    constructor(id, name, calories, servingSize, carbs, protein, fat) {
      this.id = id;
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
        INSERT INTO FoodItems (tabname, name, calories, servingSize, carbs, protein, fat)
        VALUES (@tabname, @name, @calories, @servingSize, @carbs, @protein, @fat);
        SELECT SCOPE_IDENTITY() AS id`;
    
      const request = connection.request();
      request.input("tabName", newFoodItem.tabName);
      request.input("name", newFoodItem.name);
      request.input("calories", newFoodItem.calories);
      request.input("servingSize", newFoodItem.servingSize || null);
      request.input("carbs", newFoodItem.carbs || null);
      request.input("protein", newFoodItem.protein || null);
      request.input("fat", newFoodItem.fat || null);
    
      const result = await request.query(sqlQuery);
    
      connection.close();
    
      return result.recordset[0].id;
    }
    
    static async updateFoodItem(id, updatedFoodItem) {
      const connection = await sql.connect(dbConfig);
    
      const sqlQuery = `
        UPDATE FoodItems
        SET name = @name,
            calories = @calories,
            servingSize = @servingSize,
            carbs = @carbs,
            protein = @protein,
            fat = @fat
        WHERE id = @id`;
    
      const request = connection.request();
      request.input("id", id);
      request.input("name", updatedFoodItem.name || null);
      request.input("calories", updatedFoodItem.calories || null);
      request.input("servingSize", updatedFoodItem.servingSize || null);
      request.input("carbs", updatedFoodItem.carbs || null);
      request.input("protein", updatedFoodItem.protein || null);
      request.input("fat", updatedFoodItem.fat || null);
    
      const result = await request.query(sqlQuery);
        const newId = result.recordset[0].id;
        connection.close();

        res.json({ id: newId });
    } catch (error) {
        console.error("Error creating food item:", error);
        res.status(500).send("Error creating food item");
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
  