CREATE TABLE FoodItems (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tabName NVARCHAR(100) NOT NULL,
    name NVARCHAR(100) NOT NULL,
    calories DECIMAL(10, 2) NULL,
    servingSize NVARCHAR(50) NULL,
    carbs NVARCHAR(50) NULL,
    protein NVARCHAR(50) NULL,
    fat NVARCHAR(50) NULL,
	  quantity INT DEFAULT 1,
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
  password VARCHAR(50) NOT NULL,
  points int NOT NULL,
  numberOfVouchers int NOT NULL,
  dailyCalories int NOT NULL
);


-- dummy data

INSERT INTO Users
VALUES
  ('Jack Hardy', 'jackhardy123@gmail.com', 'password', 0, 0, 0);

CREATE TABLE Vouchers (
  id INT IDENTITY(1,1) PRIMARY KEY,
  redemptionDate Date NOT NULL
);

CREATE TABLE VoucherUsers (
  id INT PRIMARY KEY IDENTITY,
  voucher_id INT FOREIGN KEY REFERENCES Vouchers(id),
  user_id INT FOREIGN KEY REFERENCES Users(id)
);

INSERT INTO userDetails (userAge, 
    userHeight, 
    userWeight, 
    userGender, 
    userActivityLevel, 
    userBMI, 
    userDailyCaloricIntake, 
    userBodyFatPercentage, 
    userBMIRange, 
    userBFPRange
) VALUES (
    18,         -- userAge
    1.79,       -- userHeight
    56.00,      -- userWeight
    'F',        -- userGender
    'low',      -- userActivityLevel
    17.48,      -- userBMI
    1966.53,    -- userDailyCaloricIntake
    19.71,      -- userBodyFatPercentage
    'Underweight',                    -- userBMIRange
    'Very low body fat, common in athletes.' -- userBFPRange
);
