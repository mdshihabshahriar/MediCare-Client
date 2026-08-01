import { betterAuth } from "better-auth";
import { MongoClient, ObjectId } from "mongodb";
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
        input: true, 
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
      verificationStatus: {
        type: "string",
        required: false,
        defaultValue: "pending",
        input: false,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "active",
        input: false, 
      },
    },
  },

  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const user = await db.collection("user").findOne(
            { _id: new ObjectId(session.userId) },
            { projection: { status: 1 } }
          );

          if (user?.status === "suspended") {
            throw new APIError("FORBIDDEN", {
              message: "Your account has been suspended. Please contact support.",
            });
          }

          return { data: session };
        },
      },
    },
  },
});