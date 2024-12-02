const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { userDataBass } = require("../data/databass");
const { ObjectId } = require("mongodb");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback", // Ensure this matches Google Console
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = await userDataBass(); // Get connected database
        const usersCollection = db.collection("contacts"); // Replace "users" with your collection name

        // Find the user in the database
        let user = await usersCollection.findOne({ googleId: profile.id });

        if (!user) {
          // Create a new user if not found
          const newUser = {
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
            createdAt: new Date(),
          };

          const result = await usersCollection.insertOne(newUser);
          user = await usersCollection.findOne({ _id: result.insertedId }); // Fetch the created user
        }

        return done(null, user); // Pass user to serializeUser
      } catch (err) {
        console.error("Error in Google Strategy:", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id); // Use the user ID or any unique identifier
});

passport.deserializeUser(async (id, done) => {
  try {
    const db = await userDataBass();
    const user = await db.collection("contacts").findOne({ _id: new ObjectId(String(id)) });

    if (!user) {
      return done(new Error("User not found"), null);
    }

    done(null, user);
  } catch (err) {
    console.error("Error in deserializeUser:", err);
    done(err, null);
  }
});


module.exports = passport;