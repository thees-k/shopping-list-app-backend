import { createApp } from "./server";
import { execSync } from "child_process";

const app = createApp();
const port = process.env.PORT;
const hostname = execSync('hostname').toString().trim();

app.listen(port, () => {
  console.log(`[server]: Server is running at http://${hostname}:${port}`);
});
