const express = require("express");
const app = express();
const port = 2001;

app.use(express.json());

app.use("/categories", require("./routes/categoryRoutes"));
app.use("/products", require("./routes/productRoutes"));

app.listen(port, () => {
   console.log("server started on port 3001");
});
