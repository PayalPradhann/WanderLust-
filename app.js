if (process.env.NODE_ENV != "production"){
    require('dotenv').config()
    }
    
    const express = require("express");
    const app = express();
    const mongoose = require("mongoose");
    const Listing = require("./models/listing.js");
    const path = require("path");
    const methodOverride = require("method-override");
    const ejsMate = require("ejs-mate");// aquiring ejs mate (help in documentation and templating)
    const session = require("express-session");
    const MongoStore = require("connect-mongo");
    const flash = require("connect-flash");
    const passport = require("passport");
    const LocalStrategy = require("passport-local");
    const User = require("./models/user.js");
    //conection with Database
    const dbURL = process.env.ATLASDB_URL;
    
    // conecting to error files from util
    const wrapAsync = require("./utils/wrapAsync.js");
    const ExpressError = require("./utils/ExpressError.js");
    
    // joi sai valide schema aquiring
    const { listingSchema  , reviewSchema} = require("./schema.js");
    const Review = require("./models/review.js");
    
    // Routers for 
    const listings = require("./routes/listing.js");
    const reviews = require("./routes/review.js");
    const user = require("./routes/user.js");
    
    main()
      .then(() => {
        console.log("connected to DB");
      })
      .catch((err) => {
        console.log(err);
      });
    
    async function main() {
      await mongoose.connect(dbURL);
    }
    
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "views"));
    app.use(express.urlencoded({ extended: true }));
    app.use(methodOverride("_method"));
    app.engine("ejs",ejsMate);//ejs-mate ka inclusion..
    app.use(express.static(path.join(__dirname,"/public")));
    
    const store = MongoStore.create({
      mongoUrl : dbURL,
      crypto : {
        secret:process.env.SECRET,
      },
      touchAfter:24*3600,
    });
    
    store.on("error",()=>{
      console.log("Error in mongo store ",err);
    })
    
    const sessionOption = {
      store,
      secret : process.env.SECRET,
      resave : false,
      saveUninitialized : true,
      cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
      }
    };
    
    app.use(session(sessionOption));
    app.use(flash());// using flash for message display
    // we require session for also for authentication process
    
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    
    
    app.use((req,res,next) =>{
      res.locals.success = req.flash("success");
      res.locals.error = req.flash("error");
      res.locals.currUser = req.user;
      next();
    });
    
    // to prevent bloting used the router fn of express
    app.use("/listings",listings);
    
    app.use("/listings/:id/reviews",reviews);
    
    app.use("/",user);
    
    // error handling for different paths 
    app.all("*",(req,res,next) => {
      next(new ExpressError(404,"Page Not Found"));
    })
    
    //error handling 
    app.use((err,req,res,next)=>{
      let {statusCode = 500 , message = "Something went wrong!"} = err;
      //res.status(statusCode).send(message);
      res.status(statusCode).render("listings/error.ejs",{message});
    });
    
    app.listen(8080, () => {
      console.log("server is listening to port 8080");
    });