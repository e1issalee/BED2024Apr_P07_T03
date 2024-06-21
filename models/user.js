const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User {
  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static async getAllUsers() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Users`; // Replace with your actual table name

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new User(row.id, row.name, row.email, row.password)
    ); // Convert rows to User objects
  }

  static async getUserById(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Users WHERE id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new User(
          result.recordset[0].id,
          result.recordset[0].name,
          result.recordset[0].email,
          result.recordset[0].password
        )
      : null; // Handle user not found
  }

  static async createUser(newUserData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `INSERT INTO Users (name, email, password) VALUES (@name, @email, @password); SELECT SCOPE_IDENTITY() AS id;`; // Retrieve ID of inserted record

    const request = connection.request();
    request.input("name", newUserData.name);
    request.input("email", newUserData.email);
    request.input("password", newUserData.password)

    const result = await request.query(sqlQuery);

    connection.close();

    // Retrieve the newly created user using its ID
    return this.getUserById(result.recordset[0].id);
  }

  static async updateUser(id, newUserData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Users SET name = @name, email = @email, password = @password WHERE id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    request.input("name", newUserData.name || null); // Handle optional fields
    request.input("email", newUserData.email || null);
    request.input("password", newUserData.password || null);

    await request.query(sqlQuery);

    connection.close();

    return this.getUserById(id); // returning the updated user data
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