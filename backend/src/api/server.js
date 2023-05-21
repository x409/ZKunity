const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/api/verify', async (req, res) => {
    const input = req.body.input;
  
    if (!input) {
      res.status(400).json({ error: "You didn't send a valid input" });
    } else if (input.length === 12) {
      // Generate and verify the zkproof
      const scenarioIndex = 0; // Select the desired zkproof scenario
      const attributes = zkproofScenarios[scenarioIndex].attributes;
      const proof = await generateZKProof(scenarioIndex, attributes);
      const verification = await verifyZKProof(scenarioIndex, proof, attributes);
  
      if (verification) {
        res.json({ valid: true });
      } else {
        res.json({ valid: false });
      }
    } else {
      res.json({ valid: false });
    }
  });


  app.post('/api/verifyL', (req, res) => {
    const input = req.body.input;
  
    if (!input) {
      res.status(400).json({ error: "You didn't send a valid input" });
    } else if (input.length === 12) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  });
  

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
