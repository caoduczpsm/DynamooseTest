const express = require('express');
const app = express();
const route = require('./routes/index');
app.use(express.json())

// Route init
route(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});