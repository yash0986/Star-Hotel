const Hotel = require("../models/hotel");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const hotels = await Hotel.find({});
  res.render("hotels/index", { hotels });
};

module.exports.renderNewForm = (req, res) => {
  res.render("hotels/new");
};

module.exports.createHotel = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.hotel.location,
      limit: 1,
    })
    .send();
  const hotel = new Hotel(req.body.hotel);
  hotel.geometry = geoData.body.features[0].geometry;
  hotel.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  hotel.author = req.user._id;
  await hotel.save();
  console.log(hotel);
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/hotels/${hotel._id}`);
};

module.exports.showHotel = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!hotel) {
    req.flash("error", "Cannot find that hotel!");
    return res.redirect("/hotels");
  }
  res.render("hotels/show", { hotel });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const hotel = await Hotel.findById(id);
  if (!hotel) {
    req.flash("error", "Cannot find that hotel!");
    return res.redirect("/hotels");
  }
  res.render("hotels/edit", { hotel });
};

module.exports.updateHotel = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const hotel = await Hotel.findByIdAndUpdate(id, {
    ...req.body.hotel,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  hotel.images.push(...imgs);
  await hotel.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await hotel.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated hotel!");
  res.redirect(`/hotels/${hotel._id}`);
};

module.exports.deleteHotel = async (req, res) => {
  const { id } = req.params;
  await Hotel.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted hotel");
  res.redirect("/hotels");
};

// const Campground = require('../models/campground');
// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const mapBoxToken = process.env.MAPBOX_TOKEN;
// const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
// const { cloudinary } = require("../cloudinary");

// module.exports.index = async (req, res) => {
//     const campgrounds = await Campground.find({});

//     res.render('campgrounds/index', { campgrounds })
// }

// module.exports.renderNewForm = (req, res) => {
//     res.render('campgrounds/new');
// }

// module.exports.createCampground = async (req, res, next) => {
//     const geoData = await geocoder.forwardGeocode({
//         query: req.body.campground.location,
//         limit: 1
//     }).send()
//     const campground = new Campground(req.body.campground);
//     campground.geometry= geoData.body.features[0].geometry;
//     campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
//     campground.author = req.user._id;
//     await campground.save();
//     console.log(campground);
//     req.flash('success', 'Successfully made a new campground!');
//     res.redirect(`/campgrounds/${campground._id}`)
// }

// module.exports.showCampground = async (req, res,) => {
//     const campground = await Campground.findById(req.params.id).populate({
//         path: 'reviews',
//         populate: {
//             path: 'author'
//         }
//     }).populate('author');
//     if (!campground) {
//         req.flash('error', 'Cannot find that campground!');
//         return res.redirect('/campgrounds');
//     }
//     res.render('campgrounds/show', { campground });
// }

// module.exports.renderEditForm = async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id)
//     if (!campground) {
//         req.flash('error', 'Cannot find that campground!');
//         return res.redirect('/campgrounds');
//     }
//     res.render('campgrounds/edit', { campground });
// }

// module.exports.updateCampground = async (req, res) => {
//     const { id } = req.params;
//     console.log(req.body);
//     const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
//     const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
//     campground.images.push(...imgs);
//     await campground.save();
//     if (req.body.deleteImages) {
//         for (let filename of req.body.deleteImages) {
//             await cloudinary.uploader.destroy(filename);
//         }
//         await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
//     }
//     req.flash('success', 'Successfully updated campground!');
//     res.redirect(`/campgrounds/${campground._id}`)
// }

// module.exports.deleteCampground = async (req, res) => {
//     const { id } = req.params;
//     await Campground.findByIdAndDelete(id);
//     req.flash('success', 'Successfully deleted campground')
//     res.redirect('/campgrounds');
// }
