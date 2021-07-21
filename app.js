//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const date = require(__dirname+"/date.js")
console.log(date);

const app = express();

var items = ["Buy food","Cook food","Eat food" ];
var workItems = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));

app.post("/",function(req,res){
    let item = req.body.text_info;
    console.log(req.body.list);

    if(req.body.list == "work"){
        workItems.push(item);
        res.redirect("/work");
    }
    else {
        items.push(item);
        res.redirect("/");
    }
    console.log(req.body)
    
})


app.get("/", function (req, res) {

    day = date.getDate();
    // switch (today.getDay()) {
    //     case 0:
    //         day = "Sunday";
    //         break;
    //     case 1:
    //         day = "Monday";
    //         break;
    //     case 2:
    //         day = "Tuesday";
    //         break;
    //     case 3:
    //         day = "Wednesday";
    //         break;
    //     case 4:
    //         day = "Thursday";
    //         break;
    //     case 5:
    //         day = "Friday";
    //         break;
    //     case 6:
    //         day = "Saturday";
    //         break;
    //     default:
    //         console.log("uh!");
    // }



    // if (today.getDay() == 6 || today.getDay() == 0) {
    //     day = "Weekend!";
    //     res.write("Yayy! its a sunday!");
    // } else {
    //     day = "Weekday!"
    //     res.write("uh! i have to work!");
    // }

    res.render("list", {
        listTitle: day,
        textSent : items
    });
})


app.get("/work", function(req, res){
    res.render("list",{listTitle: "work", textSent: workItems});
})

// app.post("/work", function(req, res){
//     let item = req.body.text_info;
//     workItems.push(item);
//     res.redirect("/work")
// })

app.get("/about", function(req, res){
    res.render("about");
})

app.listen(3000, function () {
    console.log("server up and running!")
})