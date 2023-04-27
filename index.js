const express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let utils = require('./utils.js');
let ejs = require('ejs');
let cookieParser = require("cookie-parser");
const sessions = require('express-session');

let dataPost;
let app = express();
let dataAccount;
let oneDay = 1000 * 60 * 60 * 24;
let session;

app.set('view engine', 'ejs');
app.use('/', express.static(__dirname + "/views"));
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessions({
  secret: "$g78jR!eS3_J5?",
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}));
app.use(cookieParser());

app.get("/", function(req, res) {
  session = req.session;
  dataPost = utils.readJSON("views/data/PostData.json");
  if (session.userid) {
    res.render("pages/index", { titolo: "Home", data: dataPost, isDarkMode: utils.isDarkMode(session.userid, "views/data/Account.json") })
  } else {
    res.redirect("/login");
  }
})

app.get("/post", function(req, res) {
  session = req.session;

  if (session.userid) {
    res.render("pages/postForm", { titolo: "Creazione post", isDarkMode: utils.isDarkMode(session.userid, "views/data/Account.json") });
  }
  else {
    res.redirect("/login")
  }
})

app.get("/login", function(req, res) {
  session = req.session;
  console.log(session);

  if (session.userid) {
    res.redirect("/");
  } else {
    res.render("pages/login", { titolo: "Login", isDarkMode: false })
  }
})

app.get("/register", function(req, res) {
  session = req.session;
  if (session.userid) {
    res.redirect("/");
  } else {
    res.render("pages/register", { titolo: "Registrazione", isDarkMode: false })
  }
})

app.get("/logout", function(req, res) {
  session = req.session;

  if (session.userid) {
    req.session.destroy();
  }
  res.redirect("/login");
})


//Giababris:
//Williaem: :D
//Rafasdsae:
// 🗿
//Sopra questo commento solo GET, sotto questo commento solo POST 

app.post("/inputLogin", function(req, res) {
  let trov = false;
  let i = 0;
  dataAccount = utils.readJSON("views/data/Account.json");
  console.log(dataAccount);
  let credenziali = {
    utente: req.body.utente,
    password: req.body.password
  }

  do {
    if (credenziali.utente == dataAccount[i].utente && credenziali.password == dataAccount[i].password) {
      trov = true;
      session = req.session;
      session.userid = credenziali.utente;
      console.log("loggato");
    }
    i++;
  } while (!trov && i < dataAccount.length);

  if (trov) {
    res.redirect("/");

    console.log(session)
  } else {
    res.redirect("/login")
    console.log(session)
  }
})

app.post("/inputRegister", function(req, res) {
  let trov = false;
  dataAccount = utils.readJSON("views/data/Account.json");
  let i = 0;
  let credenziali = {
    utente: req.body.utente,
    password: req.body.password,
    impostazioni: {
      darkMode: false
    }
  }

  do {
    if (credenziali.utente == dataAccount[i].utente && credenziali.password == dataAccount[i].password) {
      trov = true;
    }
    i++;
  } while (!trov && i < dataAccount.length);

  dataAccount.push(credenziali);

  if (!trov) {
    utils.writeJSON("views/data/Account.json", dataAccount);
  }

  res.redirect("/login");
})

app.post("/inputPost", function(req, res) {
  session = req.session;
  let dato = {
    utente: session.userid,
    data: utils.dataString(),
    testo: req.body.testo,
    caratteri: utils.countCharacters(req.body.testo)
  }
  dataPost = utils.readJSON("views/data/PostData.json");
  dataPost.unshift(dato);
  utils.writeJSON("views/data/PostData.json", dataPost);
  res.redirect("/");
})

app.post("/colorMode", function(req, res) {
  session = req.session;
  utils.changeColorMode(session.userid, "views/data/Account.json")
  res.redirect(req.get('referer'));
})

app.listen(8080);
