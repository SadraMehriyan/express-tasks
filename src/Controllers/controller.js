const bcrypt = require("bcrypt");
const db = require("../Database/Config/database");
const PasswordHash = require("../Utils/hasher");

class Controller {
  registerUser(req, res) {
    const data = req.info;

    PasswordHash.hashPassword(data.password).then(function (hash) {
      db.query("INSERT INTO customer SET ?", { name: data.name, email: data.email, password: hash }, (err, result) => {
            if (err) {
              return res.status(400).send(err);
            } else {
              return res.status(200).send(result);
            }
          }
        );
      }).catch((error) => {
        return res.status(400).send(error);
      });
  }

  loginUser(req, res) {
    db.query("SELECT * FROM customer WHERE email = ?", [req.info.email], (err, user) => {
        if (err) {
          return res.status(400).send(err);
        }
        if (user.length) {
          bcrypt.compare(req.info.password, user[0].password).then(function (result) {
              if (result) {
                return res.status(200).send("Logged in");
              } else {
                return res.status(400).send("email or password doesn`t mach!");
              }
            }).catch(function (error) {
              return res.status(400).send(error);
            });
        } else {
          return res.status(400).send("email or password doesn`t mach!");
        }
      }
    );
  }

  deleteUser(req, res) {
    const delid = req.params.id;

    db.query("DELETE FROM customer WHERE id = ?", delid, (err, result) => {
      if (err) {
        return res.status(400).send(err);
      } else {
        if (result.affectedRows == 0) {
          return res.status(400).send("id not exist").end();
        } else {
          return res.status(200).send("deleted").end();
        }
      }
    });
  }
}

module.exports = new Controller();