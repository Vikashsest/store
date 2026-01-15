import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(
      // "mongodb://anurag:anurag123@localhost:27017/storageApp"
      "mongodb+srv://ePanchayat:fL7T3AL5ICSV4679@cluster0.5pa4vna.mongodb.net/Epanchyat"
    );

    console.log("Database connected");
  } catch (err) {
    console.log(err);
    console.log("Could Not Connect to the Database");
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await mongoose.disconnect();
  console.log("Database Disconnected!");
  process.exit(0);
});
