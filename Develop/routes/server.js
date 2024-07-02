const express = require ('express');
const { pageRouter } = require('./routes/pages')

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json())
app.use(express.urlencoded({ extended: true}));

app.listen(PORT, () => {
    console.info(`Server started on http://localhost:${PORT}`)
})