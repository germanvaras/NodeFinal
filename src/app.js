require("./db/daos/index");
const express = require("express")
const app = express();
const path = require("path");
const handlebars = require('express-handlebars');
const MongoStore = require('connect-mongo');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const initPassport = require("./config/passport");
const passport = require("passport");
const { getMockProducts } = require("../src/utils/mockingProducts")
const {errorHandler} = require("../src/middlewares/errorHandler")
const { addLogger } = require("../src/middlewares/logger")
const swaggerJSDoc = require("swagger-jsdoc")
const swaggerUiExpress = require("swagger-ui-express")
const swaggerOption = require("../src/config/swagger")
const {scheduleDeleteInactiveUsers, scheduleDeleteExpiredTokens} = require('./config/cronTasks')

const specs = swaggerJSDoc(swaggerOption)
const MONGO_URL = process.env.db
const secret = process.env.secret
const routes = require("./routes/index");
const handle404 = require("./middlewares/handle404");
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      mongoOptions: { useUnifiedTopology: true },
    }),
    secret: secret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser("sublimeTienda"));

const hbs = handlebars.create({
  helpers: {
    eq: function (a, b) {
      return a === b;
    },
    multiply: function (a, b) {
      return a * b;
    },
  },
  defaultLayout: 'main', 
});
app.engine('handlebars', hbs.engine)
app.set('views', path.join(__dirname, "/../views"))
app.set('view engine', 'handlebars');

app.use("/apidocs" , swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "/../public")));

initPassport();
app.use(passport.initialize());
app.use(addLogger)
app.use("", routes);
app.get("/", (req, res) => {
  res.redirect("api/products");
})
app.get('/stripe-key',(req, res) =>{
  res.send({ publishableKey: process.env.publicKeyStripe});
});
app.get("/mockingproducts", (req, res) => {
  res.send({ status: "success", payload: getMockProducts() });
});
app.use(errorHandler);
app.use(handle404)
scheduleDeleteInactiveUsers();
scheduleDeleteExpiredTokens(); 
module.exports = app;
