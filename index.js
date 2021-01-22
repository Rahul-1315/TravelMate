const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const path = require("path");
const https = require("https");
const request = require('request');
// const mongoose = require("mongoose");
// const session = require("express-session");
// const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");
const app = express();
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(
//   session({
//     secret: "ThisisaSecret",
//     resave: false,
//     saveUninitialized: true,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// mongoose.connect("mongodb://localhost:27017/TravelMateDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// mongoose.set("useCreateIndex", true);
// const usersSchema = new mongoose.Schema({
//   userName: String,
//   password: String,
// });
// usersSchema.plugin(passportLocalMongoose);

// const User = new mongoose.model("user", usersSchema);
// passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
  const date = new Date();
  const year = date.getFullYear();
  var month = date.getMonth();
  month = month.toString();
  if (month.length == 1) {
    console.log("calculating Month...")
    month = parseInt(month);
    month = month + 1;
    month = month.toString();
    month = "0"+month;
  }
  var day = date.getDate();
  day = day.toString();
  if (day.length == 1){
    console.log("calculating Day...")
    day = "0"+day;
  }
  const fullDate = year+"-"+month+"-"+day;
  console.log(fullDate);
  res.render("home", {year:year});
});

app.post("/destination", function (req, res) {
  const date = new Date();
  const year = date.getFullYear();
  let tag = "city";
  let count2 = 10;
  let order = "-score";
  let fields = "name,id,snippet,images,score,type";
  let country = req.body.country;
  let imgs2 = [];
  let names2 = [];
  const accountId = "WO3V7HKB";
  const APIToken = "sdcjwp1weuajknth3u2in5a6jswjd8l5";

  url2 =
  "https://www.triposo.com/api/20200803/location.json?part_of=" +
  country +
  "&tag_labels="+
  tag+
  "&count="+count2+
  "&order_by="+order+
  "&fields="+fields+
  "&account=" +
  accountId +
  "&token=" +
  APIToken;
  


  request(url2, { json: true }, (err, resp, body) => {
  if (err) { return console.log(err); }
  const data2 = JSON.stringify(body);
  const data3 = JSON.parse(data2);
  const bgImg = data3.results[0].images[2].source_url;
  for (var i=0; i<10; i++){
      names2.push(data3.results[i].name);
      imgs2.push(data3.results[i].images[1].sizes.medium.url);
  }
  res.render("destination", {bgImg:bgImg, country:country, names:names2, imgs:imgs2,year:year });
});

});
app.get("/register", function (req, res) {
  const date = new Date();
  const year = date.getFullYear();
  var month = date.getMonth();
  month = month.toString();
  if (month.length == 1) {
    month = parseInt(month);
    month = month + 1;
    month = month.toString();
    month = "0"+month;
  }
  var day = date.getDate();
  day = day.toString();
  if (day.length == 1){
    day = "0"+day;
  }
  const fullDate = year+"-"+month+"-"+day;
  res.render("register", {fullDate:fullDate});
});

app.post("/dayPlanner", function (req, res) {
  const date = new Date();
  const year = date.getFullYear();
  let names = [];
  let descs = [];
  let imgs = [];
  let maps = [];
  let count = 0;
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  let cityName = req.body.cityName;
  cityName = cityName.replace(/ /gi, "_");
  const accountId = "WO3V7HKB";
  const APIToken = "sdcjwp1weuajknth3u2in5a6jswjd8l5";
  url =
    "https://www.triposo.com/api/20200803/day_planner.json?location_id=" +
    cityName +
    "&start_date="+
    startDate+
    "&end_date="+endDate+
    "&account=" +
    accountId +
    "&token=" +
    APIToken;
    request(url, {json:true}, (err, resp, body) =>{
      if(err){console.log("Err"+err)}
      else{
        const data = JSON.stringify(body);
        let tripData = JSON.parse(data);
        const bgImg = tripData.results[0].location.images[0].source_url;
        const noOfDays = tripData.results[0].days.length
        for (var i=0; i<noOfDays; i++){
          for(var j=0;j<2;j++){
            descs.push(tripData.results[0].days[i].itinerary_items[j].description);
            names.push(tripData.results[0].days[i].itinerary_items[j].poi.name);
            maps.push(tripData.results[0].days[i].itinerary_items[j].poi.attribution[0].url);
            try{
              imgs.push(tripData.results[0].days[i].itinerary_items[j].poi.images[0].sizes.medium.url);
            }
            catch(err){
              const blur = "https://images.hdqwalls.com/wallpapers/city-blurred-hd.jpg"
              imgs.push(blur);
            }
          }
        }
        res.render("dayPlanner", {bgImg:bgImg,startDate:startDate,endDate:endDate, count:count, cityName:req.body.cityName, year:year,noOfDays:noOfDays,descs:descs, names:names, maps:maps, imgs:imgs });
        }
    })
});

// app.get("/success", function (req, res) {
//   if (req.isAuthenticated()) {
//     res.render("success");
//   } else {
//     res.redirect("/login");
//   }
// });

// app.post("/login", function (req, res) {
//   const user = new User({
//     userName: req.body.email,
//     password: req.body.password,
//   });
//   req.logIn(user, function (err) {
//     if (err) {
//       console.log("Login " + err);
//     } else {
//       passport.authenticate("local")(req, res, function (err) {
//         if (err) {
//           console.log("Auth" + err);
//         } else {
//           console.log("no err");
//           res.redirect("/success");
//         }
//       });
//     }
//   });
// });

// app.post("/register", function (req, res) {
//   User.register({ username: req.body.email }, req.body.password, function (
//     err,
//     user
//   ) {
//     if (err) {
//       console.log(err);
//       res.redirect("/register");
//     } else {
//       passport.authenticate("local")(req, res, function () {
//         res.redirect("/success");
//       });
//     }
//   });
// });
app.listen(3000, () => {
  console.log(`Server started on port https://localhost:3000`);
});
