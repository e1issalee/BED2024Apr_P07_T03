CREATE TABLE FoodItems (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tabName NVARCHAR(100) NOT NULL,
    name NVARCHAR(100) NOT NULL,
    calories DECIMAL(10, 2) NULL,
    servingSize NVARCHAR(50) NULL,
    carbs NVARCHAR(50) NULL,
    protein NVARCHAR(50) NULL,
    fat NVARCHAR(50) NULL,
    createdAt DATETIME DEFAULT GETDATE()
);



CREATE TABLE userDetails (
	reportID INT IDENTITY(1,1) PRIMARY KEY,
	userAge INT,
    userHeight DECIMAL(4, 2),
    userWeight DECIMAL(5, 2),
    userGender CHAR(1),
    userActivityLevel VARCHAR(10),
    userBMI DECIMAL(5, 2),
    userDailyCaloricIntake DECIMAL(10, 2),
    userBodyFatPercentage DECIMAL(5, 2),
    userBMIRange VARCHAR(50),
    userBFPRange VARCHAR(50)
);


CREATE TABLE Users (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(50) NOT NULL, 
  email VARCHAR(50) NOT NULL UNIQUE,
  points int NOT NULL,
  numberOfVouchers int NOT NULL
);

INSERT INTO Users
VALUES
  ('Jack Hardy', 'jackhardy123@gmail.com', 0, 0);