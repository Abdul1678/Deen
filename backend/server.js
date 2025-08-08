import express from "express";
import cors from "cors";

import todoRouter from "./routes/todo.js";
 import vfyToken from "./middleware/vfyToken.js";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());


app.use('/api/todos', vfyToken, todoRouter);



app.get('/api', (req, res) => {
    console.log("API is running");
    res.status(200).json({ success: true, message: "API is running" });
});

app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));

