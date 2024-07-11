const sql = require("mssql");
const dbConfig = require("../dbConfig");

class VoucherUsers {
    constructor(id, voucher_id, user_id) {
        this.id = id;
        this.voucher_id = voucher_id;
        this.user_id = user_id;
    }

    static async getVoucherUserById(id) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);

            const sqlQuery = `SELECT * FROM VoucherUsers WHERE id = @id`; // Parameterized query

            const request = connection.request();
            request.input("id", id);

            const result = await request.query(sqlQuery);

            return result.recordset[0]
                ? new VoucherUsers(
                    result.recordset[0].id,
                    result.recordset[0].voucher_id,
                    result.recordset[0].user_id,
                )
                : null; // Handle voucherUser not found
        } catch (error) {
            console.error('SQL error', error);
            throw error;
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    
    }

    static async createVoucherUsers(voucher_id, user_id) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            const sqlQuery = `INSERT INTO VoucherUsers (voucher_id, user_id) VALUES (@voucher_id, @user_id); SELECT SCOPE_IDENTITY() AS id;`; // Retrieve ID of inserted record;
    
            const request = connection.request();
            request.input('voucher_id', sql.Int, voucher_id);
            request.input('user_id', sql.Int, user_id);
    
            const result = await request.query(sqlQuery);

            const newVoucherUserId = result.recordset[0].id;
          
            // Retrieve the newly created voucher using its ID
            const voucherUserId = await this.getVoucherUserById(newVoucherUserId);
            return voucherUserId;
        } catch (error) {
            console.error('SQL error', error);
            throw error;
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }
}

module.exports = VoucherUsers;