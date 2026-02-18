const express = require('express');
const app = express();
const port = 3000;


const hits = {
  home: 0,
  page1: 0,
  page2: 0
};

app.use(express.static('public'));

app.get('/hits/:page', (req, res) => {
  const page = req.params.page;
 
    hits[page]++;
    res.json({ page: page, hits: hits[page] });
  
});

app.listen(3000, () => {
  console.log(`Server running at http://localhost:${port}`);
});
