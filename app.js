//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const _ = require("lodash");


const date = require(__dirname + "/date.js")
console.log(date);

const app = express();

mongoose.connect("mongodb+srv://admin:admin@cluster0.bibps.mongodb.net/todolistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const itemsSchema = new mongoose.Schema({
    name : String
})

const Item = mongoose.model("Item", itemsSchema);


const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);




app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static("public"));

app.post("/", function (req, res) {
    let itemName = req.body.text_info;
    let listTitle = req.body.list

    console.log("------------------------------"+itemName, listTitle);

    const item_new = new Item({
        name : itemName
    }) 


    if(listTitle === "Today"){
        item_new.save();
        res.redirect("/");
    }
    else{
        List.findOne({name: listTitle}, function(err,  found_list){
            found_list.items.push(item_new);
            found_list.save();
            res.redirect("/"+listTitle)

        })

        
    }

})


app.post("/delete", function(req, res){
    const delete_id = req.body.checkbox;
    const listTitle = req.body.listTitle;
    console.log("................................................................"+delete_id,listTitle);



    if(listTitle == "Today"){
        Item.findByIdAndRemove(delete_id, function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("deleted--------------------------------");
            }
        });
    
        res.redirect("/");
    }

    else{
        List.findOneAndUpdate({name: listTitle}, {$pull: {items:{_id: delete_id}}}, function(err, item_found){
            if(!err){
                console.log("successfully deleted");
                res.redirect("/"+listTitle);
            }
        })
    }
    
})


const item1 = new Item({
    name : "buy food"
})

const item2 = new Item({
    name : "go for a walk"
})

const item3 = new Item({
    name : "have breakfast"
})

const defaultItems = [ item1, item2, item3];

app.get("/", function (req, res) {

    // day = date.getDate();

    console.log("ye!");

    Item.find(function(err, itemsFound){
        if(err){
            console.log(err);
        }
        else{
            console.log(itemsFound);

            if(itemsFound.length === 0){

                Item.insertMany(
                    defaultItems,
                    function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("inserted");
                        }
                    }
                )

                res.redirect("/");

            }

            else{

                res.render("list", {
                    listTitle: "Today",
                    textSent: itemsFound
                    
                })
            }
        }
    })    
})



app.get("/:temp_list", function (req, res) {
    const customListName = _.capitalize(req.params.temp_list);

    List.findOne({name : customListName},function(err, found_list){
        if(err){
            console.log(ere);
        }
        else{
            if(!found_list){
                console.log("doesnt exist");

                const list = new List({
                    name : customListName,
                    items : defaultItems
                })

                list.save(); 
                res.redirect("/"+customListName);

            }
            else{
                console.log("exists");
                console.log(found_list);

                res.render("list", {
                    listTitle: found_list.name,
                    textSent: found_list.items
                });
            }
        }
    })

    
})

// app.post("/work", function(req, res){
//     let item = req.body.text_info;
//     workItems.push(item);
//     res.redirect("/work")
// })

app.get("/about", function (req, res) {
    res.render("about");
})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}


app.listen(port, function () {
    console.log("server started!")
})