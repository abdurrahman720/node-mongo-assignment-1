import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;
const dataFilePath = 'user-data.json';

app.use(bodyParser.json());


app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//helper function to read data from file

const readDataFromFile = () => {
    const rawData = fs.readFileSync(dataFilePath);
    return JSON.parse(rawData);
}

const writeDataToFile = (data) => {
    fs.writeFileSync(dataFilePath,JSON.stringify(data,null,2));
}


// Endpoint to get a random user
app.get('/user/random', (req, res) => {
    const userData = readDataFromFile();
    const randomUser = userData[Math.floor(Math.random() * userData.length)];
    res.json(randomUser);
  });
  
  // Endpoint to get all users
  app.get('/user/all', (req, res) => {
    const userData = readDataFromFile();
    const limit = req.query.limit || userData.length;
    res.json(userData.slice(0, limit));
  });
  
  // Endpoint to save a random user
  app.post('/user/save', (req, res) => {
    const userData = readDataFromFile();
    const newUser = req.body;
  
    // BONUS: Validate the body
    if (!newUser.id || !newUser.gender || !newUser.name || !newUser.contact || !newUser.address || !newUser.photoUrl) {
      return res.status(400).json({ error: 'All required properties must be present in the body.' });
    }
  
    userData.push(newUser);
    writeDataToFile(userData);
    res.json(newUser);
  });
  
  // Endpoint to update a random user by id
  app.patch('/user/update/:id', (req, res) => {
    const userId = req.params.id;
    const userData = readDataFromFile();
  
    // BONUS: Validate the user id
    const userIndex = userData.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }
  
    // Update user information
    userData[userIndex] = { ...userData[userIndex], ...req.body };
    writeDataToFile(userData);
    res.json(userData[userIndex]);
  });
  
  // Endpoint to bulk update multiple users
  app.patch('/user/bulk-update', (req, res) => {
    const userIds = req.body;
    const userData = readDataFromFile();
  
    // BONUS: Validate the body
    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ error: 'Invalid request body. Provide an array of user ids.' });
    }
  
    // Update multiple users
    userIds.forEach((userId) => {
      const userIndex = userData.findIndex((user) => user.id === userId);
      if (userIndex !== -1) {
        userData[userIndex] = { ...userData[userIndex], ...req.body };
      }
    });
  
    writeDataToFile(userData);
    res.json({ success: true });
  });
  
  // Endpoint to delete a user by id
  app.delete('/user/delete/:id', (req, res) => {
    const userId = req.params.id;
    const userData = readDataFromFile();
  
    // BONUS: Validate the user id
    const userIndex = userData.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }
  
    // Delete user
    const deletedUser = userData.splice(userIndex, 1)[0];
    writeDataToFile(userData);
    res.json(deletedUser);
  });
  
  
  