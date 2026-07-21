import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("medicare");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "patient",
        input: true, // REQUIRED — lets the client set this on sign up
      },
      gender: {
        type: "string",
        required: false,
        input: true,
      },
      photoUrl: {
        type: "string",
        required: false,
        input: true,
      },
    },
}
});