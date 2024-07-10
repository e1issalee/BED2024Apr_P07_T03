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
}

module.exports = Voucher;