const db = require("./conn.js"),
  bcrypt = require("bcryptjs");

class User {
  constructor(id, first_name, last_name, email, password) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
  }

  checkPassword(hashedPassword) {
    return bcrypt.compareSync(this.password, hashedPassword);
  }

  async addUser() {
    try {
      const response = await db.one(
        `INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id;`,
        [this.first_name, this.last_name, this.email, this.password]
      );
      return response;
    } catch (error) {
      console.error("ERROR: ", error);
      return error;
    }
  }
  async loginUser() {
    console.log("logging in user");
    try {
      const response = await db.one(
        `SELECT id, first_name, last_name, password FROM users WHERE email = $1;`,
        [this.email]
      );
      const isValid = this.checkPassword(response.password);
      if (!!isValid) {
        const { id, first_name, last_name } = response;
        return { isValid, user_id: id, first_name, last_name };
      } else {
        return { isValid };
      }
      return isValid;
    } catch (error) {
      console.error("Error: ", error);
      return error;
    }
  }
}

module.exports = User;
