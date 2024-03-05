const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const Listing = require('./models/listing.js');

const app = express();
const PORT = 8080;

// const MONGO_URL = 'mongodb://127.0.0.1:27017/';
// const DB = 'wanderlust';

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);

const log = console.log;


// ----- mongodb connection -----
async function main() {
    await mongoose.connect(MONGO_URL + DB);
};

main()
    .then(() => {
        log("mongo-db and express connection successful");
    })
    .catch(err => {
        console.log(`Error : ${err.message}`);
    });
// ----- mongodb connection -----

// data
const sampleListing = [
    {
        title: "Apple",
        description:
            "Crisp and juicy apples are a favorite fruit for snacking, baking, or adding to salads. Enjoy the sweet flavor and nutritional benefits.",
        image: "https://images.unsplash.com/photo-1610397962076-02407a169a5b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXBwbGVzfGVufDB8fDB8fHww",

        price: 100,
        location: "Local Market",
        country: "India",
    },
    {
        title: "Mango",
        description:
            "Indulge in the tropical sweetness of mangoes, a beloved fruit in India. Eat them fresh, make smoothies, or use in desserts.",
        image: "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8TUFOR098ZW58MHx8MHx8fDA%3D",

        price: 800,
        location: "Local Market",
        country: "India",
    },
    {
        title: "Bhindi (Okra)",
        description:
            "Bhindi, also known as okra, is a popular vegetable in Indian cuisine. Enjoy its unique texture and flavor when stir-fried or added to curries.",
        image: "https://images.unsplash.com/photo-1632742315671-d77e6feed874?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG9rcmF8ZW58MHx8MHx8fDA%3D",

        price: 40,
        location: "Local Market",
        country: "India",
    },
    {
        title: "Potato",
        description:
            "Versatile and filling, potatoes are a staple in Indian cooking. Use them in curries, stews, or as a side dish.",
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG90YXRvfGVufDB8fDB8fHww",

        price: 30,
        location: "Local Market",
        country: "India",
    },
    {
        title: "Eggplant",
        description:
            "Eggplant, also known as brinjal or baingan, is a versatile vegetable used in various Indian dishes like curries, bhartas, and stews.",
        image: "https://5.imimg.com/data5/LT/JY/MY-10341153/brinjal-1000x1000.jpg",

        price: 60,
        location: "Local Market",
        country: "India",
    },
    {
        title: "Broccoli",
        description:
            "Broccoli is a nutritious vegetable packed with vitamins and minerals. Enjoy it steamed, roasted, or added to stir-fries and salads.",
        image: "https://images.unsplash.com/photo-1614336215203-05a588f74627?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJyb2NvbGl8ZW58MHx8MHx8fDA%3D",

        price: 400,
        location: "Local Market",
        country: "India",
    }
];



app.get("/", (req, res) => {
    res.redirect("/listings");
});

// INDEX Routing
app.get("/listings", async (req, res) => {

    try {
        // const allListings = await Listing.find({});
        console.log("All listings fetched successfully.");

        res.render("listing/index.ejs", { sampleListing });

    } catch (err) {
        console.log(`Err : ${err.message}`);
    }
});

// NEW Route : -> GET -> /listings/new -> FORM (submit) => POST /listings
app.get("/listings/new", async (req, res) => {
    res.render("listing/new.ejs", {sampleListing});
});

// POST /listings : add data entered through form to the DB and show it into the index.ejs
app.post("/listings", async (req, res) => {

    // let { title, description, image, price, location, country } = req.body;

    const newListing = new Listing(req.body.listing);
    console.log(newListing);

    try {
        await newListing.save();
        console.log("An Entry added to the DataBase !!");
    } catch (err) {
        console.log(`Err : ${err.message}`);
    }

    res.redirect("/listings");
});


// UPDATE : /lisitngs/:id/edit -> edit the form -> SUBMIT -> PUT Request to listings/:id 

// EDIT Route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
});

// UPDATE Route 
app.put("/listings/:id", async (req, res) => {

    const { id } = req.params;

    try {
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    } catch (err) {
        log(`Err : ${err.message}`);
    }

    res.redirect(`/listings/${id}`);
});

// DESTROY Route : delete request -> /listings/:id
app.delete("/listings/:id", async (req, res) => {
    try {

    let {id} = req.params;
        await Listing.findByIdAndDelete(id);
        log(`${id} deleted !!`);
        
        res.redirect("/listings");
    } catch (err) {
        log(`Err : ${err.message}`);
    }
})

// SHOW Route : (Read Operation)
app.get("/listings/:id", async (req, res) => {

    try {
        let { id } = req.params;
        let listing = null;

        for(let i=0; i<sampleListing.length; i++){
            if(sampleListing[i]._id == id) {
                listing = sampleListing[i];
                break;
            }
        }
        console.log(`Listing _id:${id} fetched successfully.`);

        res.render("listing/show.ejs", { listing });

    } catch (err) {
        console.log(`Err : ${err.message}`);
    }
});


/*
app.get("/testListing", async (req, res) => {
    let sampleListing = new Listing({
        title: "New Villa",
        description: "near beach",
        price: 1200,
        location: "Calangute, Goa",
        country: "India"
    });

    await sampleListing.save();
    console.log(`Sample was saved!`);
    res.send(`<img src="${sampleListing.image}" alt="Default Listing" height="600"></img>`);
    


});
*/





app.listen(PORT, () => {
    console.log(`Server listening at PORT ${PORT}`);
});