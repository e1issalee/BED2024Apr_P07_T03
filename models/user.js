const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User {
  constructor(id, name, email, password, points, numberOfVouchers) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.points = points;
    this.numberOfVouchers = numberOfVouchers;
  }

  static async getAllUsers() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Users`; // Replace with your actual table name

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new User(row.id, row.name, row.email, row.password, row.points, row.numberOfVouchers)
    ); // Convert rows to User objects
  }

  static async getUserById(id) {
    let connection;
    try{
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Users WHERE id = @id`; // Parameterized query

        const request = connection.request();
        request.input("id", id);
        
        const result = await request.query(sqlQuery);

        return result.recordset[0]
          ? new User(
              result.recordset[0].id,
              result.recordset[0].name,
              result.recordset[0].email,
              result.recordset[0].password,
              result.recordset[0].points,
              result.recordset[0].numberOfVouchers
            )
          : null; // Handle user not found
        } catch (error) {
          console.error('SQL error', error);
          throw error;
       } finally {
          if (connection) {
              connection.close();
        }
      }

  }

  static async createUser(newUserData) {
    
    let connection;
    try {
          connection = await sql.connect(dbConfig);

          const sqlQuery = `INSERT INTO Users (name, email, password, points, numberOfVouchers) VALUES (@name, @email, @password, @points, @numberOfVouchers); SELECT SCOPE_IDENTITY() AS id;`; // Retrieve ID of inserted record

          const request = connection.request();
          request.input("name", newUserData.name);
          request.input("email", newUserData.email);
          request.input("password", newUserData.password)
          request.input("points", newUserData.points || 0)
          request.input("numberOfVouchers", newUserData.numberOfVouchers || 0)

          const result = await request.query(sqlQuery);

          const newUserId = result.recordset[0].id;
          
          const userId = this.getUserById(newUserId);

          // Retrieve the newly created user using its ID
          return await userId;

    } catch (error) {
      console.error('SQL error', error);
      throw error;
    } finally {
      if (connection) {
          connection.close();
      }
    }
  }

  static async deleteUser(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM Users WHERE id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0; // Indicate success based on affected rows
  }
}

module.exports = User;