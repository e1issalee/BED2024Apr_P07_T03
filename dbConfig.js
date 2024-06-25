module.exports = {
    user: "NutriCooked", // Replace with your SQL Server login username
    password: "NutriCooked12345", // Replace with your SQL Server login password
    server: "localhost",
    database: "NutriCooked_DB", // Replace with our db name
    trustServerCertificate: true,
    options: {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000, // Connection timeout in milliseconds
    },
};