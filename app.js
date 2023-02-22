//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', true);     // Disable DeprecationWarning
mongoose.connect('mongodb+srv://filipu:filip123@cluster0.hnfrjsa.mongodb.net/dailyjurnalDB');

const itemsSchema = new mongoose.Schema ({
  title: String,
  content: String
});

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({ title: 'Day 1', content: 'In aliquam nulla in mi varius ornare. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada ex ac arcu vestibulum, a sodales metus ultrices. Suspendisse leo lorem, accumsan ut elit ac, vehicula aliquet nisl. Phasellus tristique lectus nec dolor dapibus, vel auctor quam laoreet. Pellentesque tempus elit id dignissim tincidunt. Curabitur maximus lobortis risus nec convallis. Integer pellentesque, orci non rutrum rhoncus, turpis elit vulputate purus, eu mollis dui nisi nec diam. Cras tempus dictum magna, sagittis imperdiet metus pulvinar sed. Phasellus maximus vel velit ut aliquet. Nulla vitae nulla lacus.' })
const item2 = new Item({ title: 'Day 2', content: 'Nunc id posuere libero, non luctus arcu. Donec ultrices, nulla non feugiat tempus, leo urna interdum quam, at egestas augue enim sed urna. Curabitur aliquam leo nunc, vel vestibulum ipsum tempus eget. Proin semper, est a molestie ullamcorper, est augue vehicula elit, non tincidunt ante enim quis libero. Praesent neque massa, pellentesque eget rutrum eu, volutpat sed neque. Pellentesque ultricies eget lectus at aliquam. Pellentesque feugiat arcu quis dolor cursus laoreet. Donec vulputate felis in mi posuere, ut molestie lorem dignissim. Nam aliquet efficitur leo quis commodo. Nunc a nunc nisi. In ex tellus, sagittis et mi et, lacinia commodo lorem. Duis non aliquam sapien, vitae tempor ipsum. Maecenas sit amet sem commodo, malesuada ante ac, varius massa. Curabitur sed magna eget velit blandit scelerisque.' })
const item3 = new Item({ title: 'Day 3', content: 'Aliquam id consequat nisl, sed laoreet eros. Cras eu tincidunt dui, ut viverra mi. Aliquam porta nulla vel sem lobortis, ac rhoncus nisi scelerisque. Mauris ac tincidunt ex. Integer a consequat odio. Sed justo elit, bibendum nec risus et, fringilla vulputate elit. Donec imperdiet, nibh vitae mattis congue, sem libero tincidunt augue, in facilisis ex mi eget ante. Nunc nec euismod nunc. Nullam vitae lacus tristique, malesuada turpis vel, elementum lorem. Vestibulum eu lectus nec elit aliquam hendrerit. Ut ornare urna sed lorem facilisis iaculis. Aenean fringilla volutpat orci suscipit finibus. Proin et leo eget tortor accumsan sodales.' })

const defaultItems = [item1, item2, item3];

app.get('/', function(req, res) {
  Item.find({}, function(err, foundItems){
    if(foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if(err) { 
          console.log(err); 
        } else { 
          console.log("Successfully saved default items to database."); 
          res.redirect('/');
        }
      });
    } else {
      res.render('home', {
        homeText: homeStartingContent,
        list: foundItems
      });
    }
  });
});

app.get('/about', function(req, res) {
  res.render('about', {
    aboutText: aboutContent
  });
});

app.get('/contact', function(req, res) {
  res.render('contact', {
    contactText: contactContent
  });
});

app.get('/compose', function(req, res) {
  res.render('compose');
});

app.post('/compose', function(req, res){
  const postItem = new Item({
    title: req.body.title,
    content: req.body.post
  });

  postItem.save();
  res.redirect('/');
});

app.get('/posts/:title', function(req, res) {
  const requestedTitle = req.params.title;
  Item.findOne({title: requestedTitle}, function(err, foundItem){
    res.render('post', {
        title: foundItem.title,
        content: foundItem.content
    });
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Server is running.');
});
