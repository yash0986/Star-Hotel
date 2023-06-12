const mongoose = require("mongoose");
const Hotel = require("../models/hotel");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
mongoose.set("strictQuery", true);
const dburl = process.env.DB_URL;
mongoose
  .connect(dburl)
  .then(() => {
    console.log("DATABASE CONNECTED!!!");
  })
  .catch((err) => {
    console.log("OH NO ERROR!!!!");
    console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
  await Hotel.deleteMany({});
  
    const random1000 = Math.floor(Math.random() * 1000) + 1;
    const camp = new Hotel({
      author: "63ff2be22f52f7080f3c1ae9",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `Taj Suites`,
      description:
        "A curation of authentic living palaces, landmark hotels, resorts and safaris, Taj is the hallmark of iconic hospitality across the globe. The brand is recognised for its warm and intuitive service and is the undisputed leader in hospitality!",
      price: 10,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dfpfysd65/image/upload/v1686489666/YelpCamp/hotel1_xzove2.jpg",
          filename: "YelpCamp/hotel1_xzove2",
        },
      ],
    });

    await camp.save();
    const random1001 = Math.floor(Math.random() * 1000) + 1;
    const camp2 = new Hotel({
      author: "63ff2be22f52f7080f3c1ae9",
      location: `${cities[random1001].city}, ${cities[random1001].state}`,
      title: `Safron Hollow`,
      description:
        "Safron Hollow offers you a privileged experience combining comfort and conviviality. Whether you are a backpacker, a solo traveler or with your family, our hotel with top-of-the-range service will meet all your expectations. More than just a hotel, Safron Hollow offers you a place to live and meet people!",
      price: 10,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1001].longitude,
          cities[random1001].latitude,
        ],
      },
      images: [
        
        {
          url: "https://res.cloudinary.com/dfpfysd65/image/upload/v1686489690/YelpCamp/hotel2_takzrp.jpg",
          filename: "YelpCamp/hotel2_takzrp",
        },
      ],
    });

    await camp2.save();
  
};

seedDB();
