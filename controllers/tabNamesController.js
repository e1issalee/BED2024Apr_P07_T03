const saveTabName = (req, res) => {
    const { tabName } = req.body;
    
    console.log('Received tabName:', tabName);
  
    // Respond with success or error
    res.status(200).json({ message: 'Tab name saved successfully' });
  };
  
  module.exports = {
    saveTabName,
  };
  