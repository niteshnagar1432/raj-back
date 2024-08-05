import { deleteImageFromS3, uploadFileToS3 } from "../middlewares/bucket.js";
import Car from "../models/carModel.js";
import PaymentTerm from "../models/paymentTermModel.js";
import TermsAndCondition from "../models/termsAndConditionModel.js";
import TravelEssentials from "../models/travelEssentialsModel.js";
import Faq from "../models/faqModel.js";

// ================================= CAR CONTROLLER ================================

export const addCar = async (req, res) => {
  try {
    const { carName, carModel, carPrice, carCapacity, status } = req.body;

    switch (true) {
      case !carName:
        return res.status(400).json({ message: "Car name is required" });

      case !carModel:
        return res.status(400).json({ message: "Car model is required" });

      case !carPrice:
        return res.status(400).json({ message: "Car price is required" });

      case !carCapacity:
        return res.status(400).json({ message: "Car capacity is required" });

      case status && status !== "active" && status !== "inactive":
        return res
          .status(400)
          .json({ message: "Status should be either active or inactive" });
    }

    // validation for images array (upload.array("carImages", 5))

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Car images are required" });
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

    const car = new Car({
      carName,
      carModel,
      carPrice,
      carCapacity,
      carImages: images,
      status,
    });

    await car.save();

    if (!car) {
      return res
        .status(400)
        .json({ success: false, message: "Car could not be added" });
    } else {
      return res
        .status(201)
        .json({ success: true, message: "Car added successfully" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const getCars = async (req, res) => {
  try {
    const cars = await Car.find();

    if (!cars) {
      return res.status(400).json({ success: false, message: "No cars found" });
    } else {
      return res.status(200).json({ success: true, cars });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(400).json({ success: false, message: "Car not found" });
    } else {
      return res.status(200).json({ success: true, car });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(400).json({ success: false, message: "Car not found" });
    }

    await car.carImages.forEach(async (image) => {
      await deleteImageFromS3(image);
    });

    const deletedCar = await car.deleteOne();

    if (!deletedCar) {
      return res
        .status(400)
        .json({ success: false, message: "Car could not be deleted" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Car deleted successfully" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const updateCar = async (req, res) => {
  try {
    const { carName, carModel, carPrice, carCapacity, status } = req.body;

    if (status && status !== "active" && status !== "inactive") {
      return res
        .status(400)
        .json({ message: "Status should be either active or inactive" });
    }

    const carId = req.params.id;
    let car = await Car.findById(carId);

    if (!car) {
      return res.status(400).json({ success: false, message: "Car not found" });
    }

    // update whatever image which user want to update from the array

    if (req.files && req.files.length > 0) {
      await car.carImages.forEach(async (image) => {
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
      car.carImages = images;
    }

    // Update only if the field is provided in the request body

    if (carName !== undefined) car.carName = carName;
    if (carModel !== undefined) car.carModel = carModel;
    if (carPrice !== undefined) car.carPrice = carPrice;
    if (carCapacity !== undefined) car.carCapacity = carCapacity;
    if (status !== undefined) car.status = status;

    const updatedCar = await car.save();

    if (!updatedCar) {
      return res
        .status(400)
        .json({ success: false, message: "Car could not be updated" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Car updated successfully" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

// ================================= PAYMENT-TERM CONTROLLER ===========================

export const addPaymentTerm = async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ message: "HTML is required" });
    }

    const paymentTerms = await PaymentTerm.find();

    if (paymentTerms.length > 0) {
      return res.json({
        success: false,
        message: "Payment Term already exists",
      });
    }

    const paymentTerm = new PaymentTerm({
      html,
    });

    await paymentTerm.save();

    if (!paymentTerm) {
      return res
        .status(400)
        .json({ success: false, message: "Payment Term could not be added" });
    } else {
      return res
        .status(201)
        .json({ success: true, message: "Payment Term added successfully" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const getAllPaymentTerm = async (req, res) => {
  try {
    const paymentTerms = await PaymentTerm.find();

    if (!paymentTerms) {
      return res
        .status(400)
        .json({ success: false, message: "No Payment Terms found" });
    } else {
      return res.status(200).json({ success: true, paymentTerms });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const getPaymentTermById = async (req, res) => {
  try {
    const paymentTerm = await PaymentTerm.findById(req.params.id);

    if (!paymentTerm) {
      return res
        .status(400)
        .json({ success: false, message: "Payment Term not found" });
    }

    return res.status(200).json({ success: true, paymentTerm });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const updatePaymentTerm = async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ message: "HTML is required" });
    }

    const paymentTermId = req.params.id;
    let paymentTerm = await PaymentTerm.findById(paymentTermId);

    if (!paymentTerm) {
      return res
        .status(400)
        .json({ success: false, message: "Payment Term not found" });
    }

    paymentTerm.html = html;

    const updatedPaymentTerm = await paymentTerm.save();

    if (!updatedPaymentTerm) {
      return res
        .status(400)
        .json({ success: false, message: "Payment Term could not be updated" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Payment Term updated successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const deletePaymentTerm = async (req, res) => {
  try {
    const paymentTerm = await PaymentTerm.findById(req.params.id);

    if (!paymentTerm) {
      return res
        .status(400)
        .json({ success: false, message: "Payment Term not found" });
    }

    const deletedPaymentTerm = await paymentTerm.deleteOne();

    if (!deletedPaymentTerm) {
      return res
        .status(400)
        .json({ success: false, message: "Payment Term could not be deleted" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Payment Term deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

// ================================= PAYMENT-TERM CONTROLLER ===========================

export const addTermsAndConditions = async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ message: "HTML is required" });
    }

    const termsAndConditions = await TermsAndCondition.find();

    if (termsAndConditions.length > 0) {
      return res.json({
        success: false,
        message: "Terms and condition already exists",
      });
    }

    const termAndCondition = new TermsAndCondition({
      html,
    });

    await termAndCondition.save();

    if (!termAndCondition) {
      return res.status(400).json({
        success: false,
        message: "Terms and condition could not be added",
      });
    } else {
      return res.status(201).json({
        success: true,
        message: "Terms and condition added successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const getAllTermsAndConditions = async (req, res) => {
  try {
    const termAndConditions = await TermsAndCondition.find();

    if (!termAndConditions) {
      return res
        .status(400)
        .json({ success: false, message: "No Terms & Condition found" });
    } else {
      return res.status(200).json({ success: true, termAndConditions });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const getTermsAndCondition = async (req, res) => {
  try {
    const termAndCondition = await TermsAndCondition.findById(req.params.id);

    if (!termAndCondition) {
      return res
        .status(400)
        .json({ success: false, message: "Terms and condition not found" });
    }

    return res.status(200).json({ success: true, termAndCondition });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const updateTermsAndCondition = async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ message: "HTML is required" });
    }

    const termAndConditionId = req.params.id;
    let termAndCondition = await TermsAndCondition.findById(termAndConditionId);

    if (!termAndCondition) {
      return res
        .status(400)
        .json({ success: false, message: "Terms and condition not found" });
    }

    termAndCondition.html = html;

    const updatedTermAndCondition = await termAndCondition.save();

    if (!updatedTermAndCondition) {
      return res.status(400).json({
        success: false,
        message: "Terms and condition could not be updated",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Terms and condition updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const deleteTermsAndCondition = async (req, res) => {
  try {
    const termAndCondition = await TermsAndCondition.findById(req.params.id);

    if (!termAndCondition) {
      return res
        .status(400)
        .json({ success: false, message: "Terms and condition not found" });
    }

    const deletedTermAndCondition = await termAndCondition.deleteOne();

    if (!deletedTermAndCondition) {
      return res.status(400).json({
        success: false,
        message: "Terms and condition could not be deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Terms and condition deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

// ================================= TRAVEL ESSENTIALS CONTROLLER ===========================

export const addTravelEssentials = async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ message: "HTML is required" });
    }

    const travelEssentials = await TravelEssentials.find();

    if (travelEssentials.length > 0) {
      return res.json({
        success: false,
        message: "Travel Essential already exists",
      });
    }

    const travelEssential = new TravelEssentials({
      html,
    });

    await travelEssential.save();

    if (!travelEssential) {
      return res.status(400).json({
        success: false,
        message: "Travel Essential could not be added",
      });
    } else {
      return res.status(201).json({
        success: true,
        message: "Travel Essential added successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const getAllTravelEssentials = async (req, res) => {
  try {
    const travelEssentials = await TravelEssentials.find();

    if (!travelEssentials) {
      return res
        .status(400)
        .json({ success: false, message: "No Travel Essentials found" });
    } else {
      return res.status(200).json({ success: true, travelEssentials });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const getTravelEssential = async (req, res) => {
  try {
    const travelEssential = await TravelEssentials.findById(req.params.id);

    if (!travelEssential) {
      return res
        .status(400)
        .json({ success: false, message: "Travel Essential not found" });
    }

    return res.status(200).json({ success: true, travelEssential });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const updateTravelEssential = async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ message: "HTML is required" });
    }

    const travelEssentialId = req.params.id;
    let travelEssential = await TravelEssentials.findById(travelEssentialId);

    if (!travelEssential) {
      return res
        .status(400)
        .json({ success: false, message: "Travel Essential not found" });
    }

    travelEssential.html = html;

    const updatedTravelEssential = await travelEssential.save();

    if (!updatedTravelEssential) {
      return res.status(400).json({
        success: false,
        message: "Travel Essential could not be updated",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Travel Essential updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const deleteTravelEssential = async (req, res) => {
  try {
    const travelEssential = await TravelEssentials.findById(req.params.id);

    if (!travelEssential) {
      return res
        .status(400)
        .json({ success: false, message: "Travel Essential not found" });
    }

    const deletedTravelEssential = await travelEssential.deleteOne();

    if (!deletedTravelEssential) {
      return res.status(400).json({
        success: false,
        message: "Travel Essential could not be deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Travel Essential deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

// ================================= FAQ CONTROLLER ===========================

export const addFAQ = async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ message: "HTML is required" });
    }

    const faqs = await Faq.find();

    if (faqs.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "FAQ already exists" });
    }

    const faq = new Faq({
      html,
    });

    await faq.save();

    if (!faq) {
      return res.status(400).json({
        success: false,
        message: "FAQ could not be added",
      });
    } else {
      return res.status(201).json({
        success: true,
        message: "FAQ added successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const getAllFAQ = async (req, res) => {
  try {
    const faqs = await Faq.find();

    if (!faqs) {
      return res.status(400).json({ success: false, message: "No FAQ found" });
    } else {
      return res.status(200).json({ success: true, faqs });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const getFAQ = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);

    if (!faq) {
      return res.status(400).json({ success: false, message: "FAQ not found" });
    }

    return res.status(200).json({ success: true, faq });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const updateFAQ = async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ message: "HTML is required" });
    }

    const faqId = req.params.id;
    let faq = await Faq.findById(faqId);

    if (!faq) {
      return res.status(400).json({ success: false, message: "FAQ not found" });
    }

    faq.html = html;

    const updatedFAQ = await faq.save();

    if (!updatedFAQ) {
      return res.status(400).json({
        success: false,
        message: "FAQ could not be updated",
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const deleteFAQ = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);

    if (!faq) {
      return res.status(400).json({ success: false, message: "FAQ not found" });
    }

    const deletedFAQ = await faq.deleteOne();

    if (!deletedFAQ) {
      return res.status(400).json({
        success: false,
        message: "FAQ could not be deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};
