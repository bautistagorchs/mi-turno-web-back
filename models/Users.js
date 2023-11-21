const S = require("sequelize");
const db = require("../config/index");
const bcrypt = require("bcrypt");
class User extends S.Model {
  hash(password, salt) {
    return bcrypt.hash(password, salt);
  }

  async validatePassword(password) {
    const newHash = await this.hash(password, this.salt);
    return newHash === this.password;
  }
}

User.init(
  {
    nameAndLast_name: {
      type: S.STRING,
      allowNull: false,
    },
    DNI: {
      type: S.INTEGER,
      allowNull: false,
    },
    email: {
      type: S.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    branch: {
      type: S.STRING,
    },
    isAdmin: {
      type: S.BOOLEAN,
      defaultValue: false,
    },
    isOperator: {
      type: S.BOOLEAN,
      defaultValue: false,
    },
    password: {
      type: S.STRING,
      allowNull: false,
    },
    salt: {
      type: S.STRING,
    },
  },
  { sequelize: db, modelName: "users" }
);

User.beforeCreate(async (user) => {
  const saltRounds = 10;
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    user.salt = salt;
    const hash = await user.hash(user.password, salt);
    user.password = hash;
  } catch (error) {
    throw new Error("HASHING ERROR");
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    user.password = bcrypt.hashSync(user.password, 10);
  }
});

module.exports = User;
