const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Voucher {
    constructor(id, redemptionDate) {
        this.id = id;
        this.redemptionDate = redemptionDate;
    }

    static async getVoucherById(id) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);

            const sqlQuery = `SELECT * FROM Vouchers WHERE id = @id`; // Parameterized query

            const request = connection.request();
            request.input("id", id);

            const result = await request.query(sqlQuery);

            return result.recordset[0]
                ? new Voucher(
                    result.recordset[0].id,
                    result.recordset[0].redemptionDate
                )
                : null; // Handle voucher not found
        } catch (error) {
            console.error('SQL error', error);
            throw error;
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    
    }
    static async createVoucher(redemptionDate) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            const sqlQuery = `INSERT INTO Vouchers (redemptionDate) VALUES (@redemptionDate); SELECT SCOPE_IDENTITY() AS id;`; // Retrieve ID of inserted record;
    
            const request = connection.request();
            request.input('redemptionDate',sql.Date, redemptionDate);
    
            const result = await request.query(sqlQuery);

            const newVoucherId = result.recordset[0].id;
          
            // Retrieve the newly created voucher using its ID
            const voucherId = await this.getVoucherById(newVoucherId);
            return voucherId;
        } catch (error) {
            console.error('SQL error', error);
            throw error;
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }
    
    static async getVouchersWithUsers() {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            const query = `
                SELECT v.id AS voucher_id, v.redemptionDate, 
                    u.id AS user_id, u.name, u.email, u.password, 
                    u.points, u.numberOfVouchers, u.dailyCalories, u.role
                FROM Vouchers v
                LEFT JOIN VoucherUsers vu ON vu.voucher_id = v.id
                LEFT JOIN Users u ON vu.user_id = u.id
                ORDER BY v.redemptionDate;
            `;

            const result = await connection.request().query(query);

            // Group users and their vouchers
            const vouchersWithUsers = {};
            for (const row of result.recordset) {
                const voucherId = row.voucher_id;
                if (!vouchersWithUsers[voucherId]) {
                    vouchersWithUsers[voucherId] = {
                        id: voucherId,
                        redemptionDate: row.redemptionDate,
                        users: [],
                    };
                }
                if (row.user_id) {
                    vouchersWithUsers[voucherId].users.push({
                        id: row.user_id,
                        name: row.name,
                        email: row.email,
                        password: row.password,
                        points: row.points,
                        numberOfVouchers: row.numberOfVouchers,
                        dailyCalories: row.dailyCalories,
                    });
                }
            }

            return Object.values(vouchersWithUsers);
        } catch (error) {
            console.error('Error fetching vouchers with users:', error);
            throw new Error("Error fetching vouchers with users");
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    static async deleteVoucher(id) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `DELETE FROM Vouchers WHERE id = @id`; // Parameterized query
    
        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.rowsAffected > 0; // Indicate success based on affected rows
    }
}

module.exports = Voucher;