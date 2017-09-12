const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const shortid = require("shortid");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    shortId: {
      type: String,
      default: shortid.generate
    },
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    children: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  {
    timestamps: true
  }
);

UserSchema.plugin(uniqueValidator);

// Class Methods
UserSchema.statics.registerNewUser = async function(
  username,
  password,
  elderId
) {
  try {
    let createOps = [
      this.create({ username, password }),
      this.findOne({ shortId: elderId })
    ];
    let [user, elder] = await Promise.all(createOps);
    if (elder) {
      elder.children.push(user);
      await elder.save();
    }
    return user;
  } catch (e) {
    console.error(e);
  }
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
