import mongoose from "mongoose";
let { ObjectId } = mongoose.Types;

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    destination: [
      {
        type: ObjectId,
        ref: "Destination",
      },
    ],
    tripType: [
      {
        type: ObjectId,
        ref: "TripType",
      },
    ],
    galleryImages: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },
    nights: {
      type: Number,
    },
    days: {
      type: Number,
    },
    flightTrain: {
      type: String,
    },
    cabs: {
      type: String,
    },
    hotels: [
      {
        name: {
          type: String,
        },
        rating: {
          type: Number,
        },
        city: {
          type: String,
        },
        nights: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    ],
    itineraries: [
      {
        heading: {
          type: String,
        },
        activity: {
          type: String,
        },
      },
    ],
    costOptions: {
      type: {
        type: String,
        enum: ["cost per person", "total cost"],
      },
      flightPrice: {
        type: Number,
      },
      landPackagePrice: {
        type: Number,
      },
      totalPrice: {
        type: Number,
      },
    },
    fixedDeparture: {
      type: {
        type: Boolean,
        default: false,
      },
      groupSize: {
        type: Number,
      },
      doubleSharing: {
        flightPrice: {
          type: Number,
        },
        landPackagePrice: {
          type: Number,
        },
        totalPrice: {
          type: Number,
        },
      },
      tripleSharing: {
        flightPrice: {
          type: Number,
        },
        landPackagePrice: {
          type: Number,
        },
        totalPrice: {
          type: Number,
        },
      },
      dates: [
        {
          type: String,
        },
      ],
    },

    includes: [
      {
        type: String,
      },
    ],
    excludes: [
      {
        type: String,
      },
    ],
    travelEssentials: {
      type: String,
    },
    faqs: {
      type: String,
    },
    termsAndConditions: {
      type: String,
    },
    paymentTerms: {
      type: String,
    },
    partialPayment: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    reviews: [
      {
        type: ObjectId,
        ref: "Review",
      },
    ],
    hotDeals: {
      type: Boolean,
      default: false,
    },
    offer: {
      type: ObjectId,
      ref: "Offer",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isRajasthani: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

export default mongoose.model("Package", packageSchema);
