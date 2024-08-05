import { deleteImageFromS3, uploadFileToS3 } from "../middlewares/bucket.js";
import Package from "../models/packageModel.js";
import Destination from "../models/destinationmodel.js";
import TripType from "../models/tripTypeModel.js";
import Offer from "../models/offerModel.js";

// ============================== PACKAGE ROUTES =================================

export const addPackage = async (req, res) => {
  try {
    const {
      title,
      destination,
      tripType,
      description,
      nights,
      days,
      flightTrain,
      cabs,
      hotels,
      itineraries,
      costOptions,
      fixedDeparture,
      dates,
      includes,
      excludes,
      travelEssentials,
      faqs,
      termsAndConditions,
      paymentTerms,
      status,
      hotDeals,
      partialPayment,
    } = req.body;

    switch (true) {
      case !title:
        return res.status(400).json({ message: "Title is required" });

      case !destination:
        return res.status(400).json({ message: "Destination is required" });

      case !tripType:
        return res.status(400).json({ message: "Trip type is required" });

      case !description:
        return res.status(400).json({ message: "Description is required" });

      case !nights:
        return res.status(400).json({ message: "Nights is required" });

      case !days:
        return res.status(400).json({ message: "Days is required" });

      case !costOptions:
        return res.status(400).json({ message: "Cost options is required" });

      case !fixedDeparture:
        return res.status(400).json({ message: "Fixed departure is required" });

      case !travelEssentials:
        return res
          .status(400)
          .json({ message: "Travel essentials is required" });

      case !faqs:
        return res.status(400).json({ message: "FAQs is required" });

      case !partialPayment:
        return res.status(400).json({ message: "Partial payment is required" });

      case !termsAndConditions:
        return res
          .status(400)
          .json({ message: "Terms and conditions is required" });

      case !paymentTerms:
        return res.status(400).json({ message: "Payment terms is required" });

      case status && status !== "active" && status !== "inactive":
        return res
          .status(400)
          .json({ message: "Status should be either active or inactive" });

      case hotDeals && typeof hotDeals !== "boolean":
        return res
          .status(400)
          .json({ message: "Hot deals should be a boolean" });

    }

    // validation for images array (upload.array("galleryImages", 5))

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Gallery images are required" });
    }

    const images = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const result = await uploadFileToS3(file);
      if (result) {
        images.push(result.Location);
      } else {
        return res.status(500).json({
          success: false,
          message: "Something went wrong please try again",
        });
      }
    }

    const newPackage = new Package({
      title,
      destination,
      tripType,
      galleryImages: images,
      description,
      nights,
      days,
      flightTrain,
      cabs,
      hotels,
      itineraries,
      costOptions,
      fixedDeparture,
      dates,
      includes,
      excludes,
      travelEssentials,
      faqs,
      termsAndConditions,
      paymentTerms,
      partialPayment,
      status,
    });

    // check if destination and tripType is array or not

    if (destination.length > 0) {
      destination.forEach(async (dest, index) => {
        const destinationExist = await Destination.findById(dest);
        if (!destinationExist) {
          return res
            .status(400)
            .json({ success: false, message: "Destination not found" });
        }

        destinationExist.packages.push(newPackage._id);

        await destinationExist.save();
      });
    }

    if (tripType.length > 0) {
      tripType.forEach(async (type, index) => {
        const tripTypeExist = await TripType.findById(type);
        if (!tripTypeExist) {
          return res

            .status(400)
            .json({ success: false, message: "Trip type not found" });
        }

        tripTypeExist.packages.push(newPackage._id);

        await tripTypeExist.save();
      });
    }

    await newPackage.save();

    if (!newPackage) {
      return res
        .status(400)
        .json({ success: false, message: "Package could not be added" });
    } else {
      return res
        .status(201)
        .json({ success: true, message: "Package added successfully" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const getPackages = async (req, res) => {
  try {
    const packages = await Package.find()
      .populate("destination")
      .populate("tripType")
      .populate("offer");

    if (!packages) {
      return res
        .status(400)
        .json({ success: false, message: "No packages found" });
    } else {
      return res.status(200).json({ success: true, packages });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const {
      title,
      destination,
      tripType,
      description,
      nights,
      days,
      flightTrain,
      cabs,
      hotels,
      itineraries,
      costOptions,
      fixedDeparture,
      includes,
      excludes,
      travelEssentials,
      faqs,
      termsAndConditions,
      paymentTerms,
      status,
      hotDeals,
      partialPayment,
    } = req.body;

    const packageToUpdate = await Package.findById(req.params.id);

    if (!packageToUpdate) {
      return res
        .status(400)
        .json({ success: false, message: "Package not found" });
    }

    // update whatever image which user want to update from the array

    if (req.files && req.files.length > 0) {
      await packageToUpdate.galleryImages.forEach(async (image) => {
        await deleteImageFromS3(image);
      });

      const images = [];
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const result = await uploadFileToS3(file);
        if (result) {
          images.push(result.Location);
        } else {
          return res.status(500).json({
            success: false,
            message: "Something went wrong please try again",
          });
        }
      }
      packageToUpdate.galleryImages = images;
    }

    // Update only if the field is provided in the request body

    if (title !== undefined) packageToUpdate.title = title;
    if (destination !== undefined) {
      if (destination.length > 0) {
        destination.forEach((dest, index) => {
          packageToUpdate.destination[index] = dest;
        });
      }
    }
    if (tripType !== undefined) {
      if (tripType.length > 0) {
        tripType.forEach((type, index) => {
          packageToUpdate.tripType[index] = type;
        });
      }
    }
    if (description !== undefined) packageToUpdate.description = description;
    if (partialPayment !== undefined) packageToUpdate.partialPayment = partialPayment;
    if (nights !== undefined) packageToUpdate.nights = nights;
    if (days !== undefined) packageToUpdate.days = days;
    if (flightTrain !== undefined) packageToUpdate.flightTrain = flightTrain;
    if (cabs !== undefined) packageToUpdate.cabs = cabs;
    if (hotels !== undefined) {
      if (hotels.length > 0) {
        hotels.forEach((hotel, index) => {
          for (let key in hotel) {
            packageToUpdate.hotels[index][key] = hotel[key];
          }
        });
      }
    }
    if (itineraries !== undefined) {
      if (itineraries.length > 0) {
        itineraries.forEach((itinerary, index) => {
          for (let key in itinerary) {
            packageToUpdate.itineraries[index][key] = itinerary[key];
          }
        });
      }
    }
    if (costOptions !== undefined) {
      for (let key in costOptions) {
        packageToUpdate.costOptions[key] = costOptions[key];
      }
    }
    if (fixedDeparture !== undefined) {
      for (let key in fixedDeparture) {
        // check fixedDeparture[key] is an object or not
        if (typeof fixedDeparture[key] === "object") {
          for (let k in fixedDeparture[key]) {
            packageToUpdate.fixedDeparture[key][k] = fixedDeparture[key][k];
          }
        } else if (typeof fixedDeparture[key] === "array") {
          fixedDeparture[key].forEach((item, index) => {
            packageToUpdate.fixedDeparture[key][index] = item;
          });
        } else {
          packageToUpdate.fixedDeparture[key] = fixedDeparture[key];
        }
      }
    }
    if (includes !== undefined) {
      if (includes.length > 0) {
        includes.forEach((include, index) => {
          packageToUpdate.includes[index] = include;
        });
      }
    }
    if (excludes !== undefined) {
      if (excludes.length > 0) {
        excludes.forEach((exclude, index) => {
          packageToUpdate.excludes[index] = exclude;
        });
      }
    }
    if (travelEssentials !== undefined)
      packageToUpdate.travelEssentials = travelEssentials;
    if (faqs !== undefined) packageToUpdate.faqs = faqs;
    if (termsAndConditions !== undefined)
      packageToUpdate.termsAndConditions = termsAndConditions;
    if (paymentTerms !== undefined) packageToUpdate.paymentTerms = paymentTerms;
    if (status !== undefined) packageToUpdate.status = status;
    if (hotDeals !== undefined) packageToUpdate.hotDeals = hotDeals;

    await packageToUpdate.save();

    if (!packageToUpdate) {
      return res
        .status(400)
        .json({ success: false, message: "Package could not be updated" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Package updated successfully" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const getPackageById = async (req, res) => {
  try {
    const packageExist = await Package.findById(req.params.id)
      .populate("destination")
      .populate("tripType")
      .populate("offer");

    if (!packageExist) {
      return res
        .status(400)
        .json({ success: false, message: "Package not found" });
    } else {
      return res.status(200).json({ success: true, packageExist });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const deletePackage = async (req, res) => {
  try {
    const packageExist = await Package.findById(req.params.id);

    if (!packageExist) {
      return res
        .status(400)
        .json({ success: false, message: "Package not found" });
    }

    packageExist.destination.forEach(async (dest, index) => {
      const destinationExist = await Destination.findById(dest);

      destinationExist.packages = destinationExist.packages.filter(
        (pkg) => pkg.toString() !== req.params.id
      );

      await destinationExist.save();
    });

    packageExist.tripType.forEach(async (type, index) => {
      const tripTypeExist = await TripType.findById(type);

      tripTypeExist.packages = tripTypeExist.packages.filter(
        (pkg) => pkg.toString() !== req.params.id
      );

      await tripTypeExist.save();
    });

    await Package.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Package deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const getPakagesAccordingToOffer = async (req, res) => {
  const isOffered = req.query.isOffered;
  try {
    const packages = await Package.find({ offer: { $exists: isOffered } })
      .populate("destination")
      .populate("tripType")
      .populate("offer");

    if (!packages) {
      return res
        .status(400)
        .json({ success: false, message: "No packages found" });
    }

    return res.status(200).json({ success: true, packages });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};
// ============================== ApllY OFFER TO PACKAGE =================================

export const applyOfferToPackages = async (req, res) => {
  try {
    const { type, value, packageIds } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Type is required" });
    }

    if (!value) {
      return res.status(400).json({ message: "Value is required" });
    }

    if (type !== "percentage" && type !== "price") {
      return res
        .status(400)
        .json({ message: "Type should be either percentage or price" });
    }

    if (!Array.isArray(packageIds) || packageIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Package IDs should be a non-empty array" });
    }

    const packages = await Package.find({ _id: { $in: packageIds } });
    if (packages.length !== packageIds.length) {
      return res
        .status(400)
        .json({ success: false, message: "One or more packages not found" });
    }

    const packagesWithOffer = packages.filter(pkg => pkg.offer);

    if (packagesWithOffer.length > 0) {
      return res.status(400).json({
        success: false,
        message: "One or more packages already have an offer applied",
        packagesWithOffer: packagesWithOffer.map(pkg => pkg._id),
      });
    }

    const offer = new Offer({ type, value });

    await offer.save();

    const updateResults = await Package.updateMany(
      { _id: { $in: packageIds } },
      { offer: offer._id }
    );

    return res.status(200).json({
      success: true,
      message: "Offer applied successfully to multiple packages",
      updateResults,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
      error,
    });
  }
};


// ============================== REMOVE OFFER FROM PACKAGE =================================

export const removeOfferFromPackages = async (req, res) => {
  try {
    const { packageIds } = req.body;

    if (!Array.isArray(packageIds) || packageIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Package IDs should be a non-empty array" });
    }

    const packages = await Package.find({ _id: { $in: packageIds } });

    if (packages.length !== packageIds.length) {
      return res
        .status(400)
        .json({ success: false, message: "One or more packages not found" });
    }

    const packagesWithoutOffer = packages.filter(pkg => !pkg.offer);

    if (packagesWithoutOffer.length > 0) {
      return res.status(400).json({
        success: false,
        message: "One or more packages have no offer applied",
        packagesWithoutOffer: packagesWithoutOffer.map(pkg => pkg._id),
      });
    }

    const offerIds = [...new Set(packages.map(pkg => pkg.offer))];

    await Package.updateMany(
      { _id: { $in: packageIds } },
      { $unset: { offer: 1 } }
    );

    // Check if any offers are still associated with other packages
    const remainingOffers = await Package.find({ offer: { $in: offerIds } });

    const offerIdsToDelete = offerIds.filter(
      offerId => !remainingOffers.some(pkg => pkg.offer.equals(offerId))
    );

    if (offerIdsToDelete.length > 0) {
      await Offer.deleteMany({ _id: { $in: offerIdsToDelete } });
    }

    return res.status(200).json({
      success: true,
      message: "Offers removed successfully from multiple packages",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
      error,
    });
  }
};


// ============================== ACTIVE INACTIVE PACKAGES =================================

export const updatePackageStatus = async (req, res) => {
  try {
    const { packageId, status } = req.body;

    if (!packageId) {
      return res.status(400).json({ message: "Package ID is required" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    if (status !== "active" && status !== "inactive") {
      return res
        .status(400)
        .json({ message: "Status should be either active or inactive" });
    }

    const packageToUpdate = await Package.findById(packageId);

    if (!packageToUpdate) {
      return res
        .status(400)
        .json({ success: false, message: "Package not found" });
    }

    packageToUpdate.status = status;

    await packageToUpdate.save();

    return res.status(200).json({
      success: true,
      message: "Package status updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
      error,
    });
  }
}

// ============================== Featured Packages =================================

export const updateFeaturedPackages = async (req, res) => {
  try {
    const { packageId, status } = req.body;

    if (!packageId) {
      return res.status(400).json({ message: "Package ID is required" });
    }

    if (status !== true && status !== false) {
      return res.status(400).json({ message: "Status should be either true or false" });
    }

    const packageToUpdate = await Package.findById(packageId)

    if (!packageToUpdate) {
      return res.status(400).json({ success: false, message: "Package not found" });
    }

    packageToUpdate.isFeatured = status;

    await packageToUpdate.save();

    return res.status(200).json({
      success: true,
      message: "Package featured status updated successfully",
    });

  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
      error,
    });
  }
}

export const getFeaturedPackages = async (req, res) => {
  try {
    const packages = await Package.find({ isFeatured: true })
      .populate("destination")
      .populate("tripType")
      .populate("offer");

    if (!packages) {
      return res
        .status(400)
        .json({ success: false, message: "No featured packages found" });
    }

    return res.status(200).json({ success: true, packages });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
}

export const updateRajasthaniPackages = async (req, res) => {
  try {
    const { packageId, status } = req.body;

    if (!packageId) {
      return res.status(400).json({ message: "Package ID is required" });
    }

    if (status !== true && status !== false) {
      return res.status(400).json({ message: "Status should be either true or false" });
    }

    const packageToUpdate = await Package.findById(packageId)

    if (!packageToUpdate) {
      return res.status(400).json({ success: false, message: "Package not found" });
    }

    packageToUpdate.isRajasthani = status;

    await packageToUpdate.save();

    return res.status(200).json({
      success: true,
      message: "Package Rajasthani status updated successfully",
    });

  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
      error,
    });
  }
}

export const getRajasthaniPackages = async (req, res) => {
  try {
    const packages = await Package.find({ isRajasthani: true })
      .populate("destination")
      .populate("tripType")
      .populate("offer");

    if (!packages) {
      return res
        .status(400)
        .json({ success: false, message: "No Rajasthani packages found" });
    }

    return res.status(200).json({ success: true, packages });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
}

export const FilterPackages = async (req, res) => {
  try {
    const { destination, tripType, hotDeals, price ,searchQuery} = req.body;

    let query = {};

    if (destination) {
      query.destination = destination;
    }

    if (tripType) {
      query.tripType = tripType;
    }

    if (hotDeals) {
      query.hotDeals = true;
    }

    let sort = {};
    if (price === "lowToHigh") {
      sort = { "costOptions.totalPrice": 1 };
    }
    if (price === "highToLow") {
      sort = { "costOptions.totalPrice": -1 };
    }
    if(searchQuery){
      query.title = new RegExp(searchQuery, "i");
    }


    const packages = await Package.find(query)
      .populate("destination")
      .populate("tripType")
      .populate("offer")
      .sort(sort);


    return res.status(200).json({ success: true, packages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

// ============================== END OF PACKAGE ROUTES ===========================