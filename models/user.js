const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User {
  constructor(id, name, email, password, points, numberOfVouchers, dailyCalories, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.points = points;
    this.numberOfVouchers = numberOfVouchers;
    this.dailyCalories = dailyCalories;
    this.role = role;
  }

  static async getAllUsers() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Users`; // Replace with your actual table name

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new User(row.id, row.name, row.email, row.password, row.points, row.numberOfVouchers, row.dailyCalories, row.role)
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
              result.recordset[0].numberOfVouchers,
              result.recordset[0].dailyCalories,
              result.recordset[0].role
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

  static async getUserByName(name) {
    let connection;
    try{
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Users WHERE name = @name`; // Parameterized query

        const request = connection.request();
        request.input("name", name);
        
        const result = await request.query(sqlQuery);

        return result.recordset[0]
          ? new User(
              result.recordset[0].id,
              result.recordset[0].name,
              result.recordset[0].email,
              result.recordset[0].password,
              result.recordset[0].points,
              result.recordset[0].numberOfVouchers,
              result.recordset[0].dailyCalories,
              result.recordset[0].role
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

  static async getUserByEmail(email) {
    let connection;
    try{
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Users WHERE email = @email`; // Parameterized query

        const request = connection.request();
        request.input("email", email);
        
        const result = await request.query(sqlQuery);

        return result.recordset[0]
          ? new User(
              result.recordset[0].id,
              result.recordset[0].name,
              result.recordset[0].email,
              result.recordset[0].password,
              result.recordset[0].points,
              result.recordset[0].numberOfVouchers,
              result.recordset[0].dailyCalories,
              result.recordset[0].role
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

  static async getUserByEmailAndPassword(email, password) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);

        const sqlQuery = `
            SELECT * FROM Users 
            WHERE email = @Email 
            AND password = @Password
        `;
        
        const request = connection.request();
        request.input('Email', email);
        request.input('Password', password);
        
        const result = await request.query(sqlQuery);

        return result.recordset[0];
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

          const sqlQuery = `INSERT INTO Users (name, email, password, points, numberOfVouchers, dailyCalories, role) VALUES (@name, @email, @password, @points, @numberOfVouchers, @dailyCalories, @role); SELECT SCOPE_IDENTITY() AS id;`; // Retrieve ID of inserted record

          const request = connection.request();
          request.input("name", newUserData.name);
          request.input("email", newUserData.email);
          request.input("password", newUserData.password)
          request.input("points", newUserData.points || 0)
          request.input("numberOfVouchers", newUserData.numberOfVouchers || 0)
          request.input("dailyCalories", newUserData.dailyCalories || 0)
          request.input("role", newUserData.role)

          const result = await request.query(sqlQuery);

          const newUserId = result.recordset[0].id;
          
          // Retrieve the newly created user using its ID
          const userId = await this.getUserById(newUserId);
          return userId;

    } catch (error) {
      console.error('SQL error', error);
      throw error;
    } finally {
      if (connection) {
          await connection.close();
      }
    }
  }

  static async updateUserPointsAndVouchers(id, points, numberOfVouchers) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE Users SET points = @points, numberOfVouchers = @numberOfVouchers WHERE id = @id`;
        
        const request = connection.request();
        request.input("id", id);
        request.input("points", points || null);
        request.input("numberOfVouchers", numberOfVouchers || 0);

        await request.query(sqlQuery);

        // Optionally, retrieve updated user data
        const updatedUser = await this.getUserById(id);
        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error; // Re-throw the error to be caught by the caller
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error('Error closing connection:', error);
            }
        }
    }
  }

  static async updateUserCalories(id, dailyCalories) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE Users SET dailyCalories = @dailyCalories WHERE id = @id`;
        
        const request = connection.request();
        request.input("id", id);
        request.input("dailyCalories", dailyCalories || 0);

        await request.query(sqlQuery);

        // Optionally, retrieve updated user data
        const updatedUser = await this.getUserById(id);
        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error; // Re-throw the error to be caught by the caller
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error('Error closing connection:', error);
            }
        }
    }
  }

  static async resetUserCalories(id) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE Users SET dailyCalories = 0 WHERE id = @id`;
        
        const request = connection.request();
        request.input("id", id);

        await request.query(sqlQuery);

        // Optionally, retrieve updated user data
        const updatedUser = await this.getUserById(id);
        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error; // Re-throw the error to be caught by the caller
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error('Error closing connection:', error);
            }
        }
    }
  }

  static async getUsersWithVouchers() {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const query = `
            SELECT u.id AS user_id, u.name, u.email, u.password, 
                   u.points, u.numberOfVouchers, u.dailyCalories, u.role,
                   v.id AS voucher_id, v.redemptionDate
            FROM Users u
            LEFT JOIN VoucherUsers vu ON vu.user_id = u.id
            LEFT JOIN Vouchers v ON vu.voucher_id = v.id
            ORDER BY u.id;
        `;

        const result = await connection.request().query(query);

        // Group vouchers and their users
        const usersWithVouchers = {};
        for (const row of result.recordset) {
            const userId = row.user_id;
            if (!usersWithVouchers[userId]) {
                usersWithVouchers[userId] = {
                    id: userId,
                    name: row.name,
                    email: row.email,
                    password: row.password,
                    points: row.points,
                    numberOfVouchers: row.numberOfVouchers,
                    dailyCalories: row.dailyCalories,
                    role: row.role,
                    vouchers: [],
                };
            }
            if (row.voucher_id) {
                usersWithVouchers[userId].vouchers.push({
                    id: row.voucher_id,
                    redemptionDate: row.redemptionDate,
                });
            }
        }

        return Object.values(usersWithVouchers);
    } catch (error) {
        console.error('Error fetching users with vouchers:', error);
        throw new Error("Error fetching users with vouchers");
    } finally {
        if (connection) {
            await connection.close();
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

  static async getUserWithVouchersById(userId) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const query = `
            SELECT u.id AS user_id, u.name, u.email, u.password, 
                   u.points, u.numberOfVouchers, u.dailyCalories, u.role,
                   v.id AS voucher_id, v.redemptionDate
            FROM Users u
            LEFT JOIN VoucherUsers vu ON vu.user_id = u.id
            LEFT JOIN Vouchers v ON vu.voucher_id = v.id
            WHERE u.id = @userId
            ORDER BY v.redemptionDate;
        `;

        const request = connection.request();
        request.input('userId', sql.Int, userId);
        const result = await request.query(query);

        // Group vouchers and their users
        if (result.recordset.length === 0) {
            return null; // User not found
        }

        const userWithVouchers = {
            id: result.recordset[0].user_id,
            name: result.recordset[0].name,
            email: result.recordset[0].email,
            password: result.recordset[0].password,
            points: result.recordset[0].points,
            numberOfVouchers: result.recordset[0].numberOfVouchers,
            dailyCalories: result.recordset[0].dailyCalories,
            role: result.recordset[0].role,
            vouchers: result.recordset.filter(row => row.voucher_id).map(row => ({
                id: row.voucher_id,
                redemptionDate: row.redemptionDate,
            })),
        };

            return userWithVouchers;
        } catch (error) {
            console.error('Error fetching user with vouchers:', error);
            throw new Error("Error fetching user with vouchers");
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }
}

module.exports = User;