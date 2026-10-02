import config from "../config/config.js";
import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

if (!config.dbUri) {
  console.log("DB connnection falied! DB URI is not working.");
  process.exit(1);
}

console.log(
  `Connecting with MongoDB:${config.dbUri.startsWith("mongodb+srv://") ? "[atlas]" : config.dbUri}`
);

const connectDB = async function () {
  try {
    await mongoose.connect(config.dbUri);
    console.log("✅ DB Connection successful!");
  } catch (error) {
    console.log("❌ DB Connection Failed!", error);
    process.exit(1);
  }
};

export default connectDB;
