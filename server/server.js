const express = require("express");
const app = express();
const cors = require("cors");
const port = 500;

app.use(cors());
app.use(express());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});