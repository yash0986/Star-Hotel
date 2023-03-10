const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities= require('./cities');
const {places,descriptors}= require ('./seedHelpers');
mongoose.set('strictQuery', true);

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp ')
    .then(() => {
        console.log("DATABASE CONNECTED!!!")
    })
    .catch(err => {
        console.log("OH NO ERROR!!!!")
        console.log(err)
    })

const sample = array => array[Math.floor(Math.random()*array.length)]
const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0;i<300;i++){
        const random1000= Math.floor(Math.random()*1000)+ 1;
        const camp=new Campground({
            author: '63ff2be22f52f7080f3c1ae9',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price : 10,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dfpfysd65/image/upload/v1677773501/YelpCamp/uckoushx4e02hfi1njyy.png',
                    filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
                },
                {
                    url: 'https://res.cloudinary.com/dfpfysd65/image/upload/v1677762261/samples/landscapes/nature-mountains.jpg',
                    filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
                }
            ]
        })

        await camp.save()
    }
    
}

seedDB();



