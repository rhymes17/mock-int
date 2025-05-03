import dotenv from "dotenv";
import app from "./app";
import connectDb from "./utils/connectDb";

dotenv.config();
const PORT = process.env.PORT || 8000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Could not connect to the database ${err.message}`);
    process.exit(1);
  });
