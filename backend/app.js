// Сервер mongo запускают командой mongod или
// brew services start mongodb-community@4.4 до запуска Node.js:

// подключение express
const express = require("express");
// подключение mongoose
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { errors } = require("celebrate");
// подключение router
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");
const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");
const handleError = require("./middlewares/handleError");
const {
  validationLogin,
  validationCreateUser,
} = require("./middlewares/validation");
const NotFound = require("./errors/NotFound");
const { requestLogger, errorLogger } = require("./middlewares/logger");
//  Настройка порта, который слушает приложение. По умолчанию 3000. Взяли из переменной окружения
const { PORT = 3000 } = process.env;
// или 2 вариант: const PORT = process.env.PORT || 3000
// создание приложения методом express
const app = express();
// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mestodb");

const options = {
  origin: [
    "http://leontevsky.nomoredomains.work",
    "https://leontevsky.nomoredomains.work",
    "http://leontevskyback.nomoredomains.work",
    "https://leontevskyback.nomoredomains.work",
    "http://localhost:3000",
    "https://localhost:3000",
  ],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "origin", "Authorization", "Accept"],
  credentials: true,
};

app.use("*", cors(options));
app.use(helmet());

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});

app.post("/signin", validationLogin, login);
app.post("/signup", validationCreateUser, createUser);

app.use("/", auth, userRouter);
app.use("/", auth, cardRouter);
app.use("*", auth, () => {
  throw new NotFound("Роутер не найден");
});
app.use(errorLogger);
app.use(errors());
app.use(handleError);

// Прослушиваем подключение на порту 3000
app.listen(PORT, () => {
   console.log('Ссылка на сервер');
  // console.log(BASE_PATH);
  // console.log(`Приложение App слушает порт: ${PORT}`);
});
