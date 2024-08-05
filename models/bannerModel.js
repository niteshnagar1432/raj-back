import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    bannerImage: {
        type: String,
    },
    externalLink: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
});

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;