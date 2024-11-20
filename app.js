const express = require("express");
const mustacheExpress = require("mustache-express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  session({
    secret: "minha_chave_secreta",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.get("/random", (req, res) => {
  const cookieName = "randomNumber";

  if (req.cookies[cookieName]) {
    const numberExists = req.cookies[cookieName];
    res.send(`Número já gerado e armazenado no cookie: ${numberExists}`);
  } else {
    const randomNumber = Math.floor(Math.random() * 100) + 1;

    res.cookie(cookieName, randomNumber, { maxAge: 24 * 60 * 60 * 1000 });

    res.send(`Número gerado e armazenado no cookie: ${randomNumber}`);
  }
});

app.post("/salvauser", (req, res) => {
  const userName = req.body.name;

  req.session.userName = userName;

  res.redirect("/");
});

app.get("/", (req, res) => {
  res.render("index", {
    title: "Bem-vindo!",
    placeholder: "Seu nome",
    buttonText: "Enviar",
    userName: req.session.userName,
  });
});
