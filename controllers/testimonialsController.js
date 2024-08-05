import Testimonial from "../models/testimonialModel.js";
import { deleteImageFromS3, uploadFileToS3 } from "../middlewares/bucket.js";


export const createTestimonial = async (req, res) => {
    try {
        const { name, position, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name is required",
            });
        }

        if (!position) {
            return res.status(400).json({
                success: false,
                message: "Position is required",
            });
        }

        if (!description) {
            return res.status(400).json({
                success: false,
                message: "Description is required",
            });
        }

        const image = req.files[0]

        if (!image) {
            return res.status(400).json({
                success: false,
                message: "Image is required",
            });
        }
        let imageKey = await uploadFileToS3(image)

        const testimonial = new Testimonial({
            name,
            position,
            description,
            image: imageKey.Location,
        });

        await testimonial.save();

        return res.status(201).json({
            success: true,
            message: "Testimonial created successfully",
            data: testimonial,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }

}

export const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find();

        return res.status(200).json({
            success: true,
            data: testimonials,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

export const deleteTestimonial = async (req, res) => {

    try {
        const testimonialId = req.params.id;
        if (!testimonialId) {
            return res.status(400).json({
                success: false,
                message: "Testimonial id is required",
            });
        }
        const testimonial = await Testimonial.findById(testimonialId);
        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found",
            });
        }
        await deleteImageFromS3(testimonial.image)
        await testimonial.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Testimonial deleted successfully",
        });

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

export const updateTestimonial = async (req, res) => {
    try {
        const testimonialId = req.params.id;
        if (!testimonialId) {
            return res.status(400).json({
                success: false,
                message: "Testimonial id is required",
            });
        }
        const testimonial = await Testimonial.findById(testimonialId);
        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found",
            });
        }

        const { name, position, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name is required",
            });
        }

        if (!position) {
            return res.status(400).json({
                success: false,
                message: "Position is required",
            });
        }

        if (!description) {
            return res.status(400).json({
                success: false,
                message: "Description is required",
            });
        }

        const image = req.files[0]
        if(image){
            await deleteImageFromS3(testimonial.image)
            let imageKey = await uploadFileToS3(image)
            testimonial.image = imageKey.Location;
        }
        testimonial.name = name;
        testimonial.position = position;
        testimonial.description = description;

        await testimonial.save();

        return res.status(200).json({
            success: true,
            message: "Testimonial updated successfully",
            data: testimonial,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

export const featuredTestimonial = async (req, res) => {
    try {
        const testimonialId = req.params.id;
        if (!testimonialId) {
            return res.status(400).json({
                success: false,
                message: "Testimonial id is required",
            });
        }
        const testimonial = await Testimonial.findById(testimonialId);
        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found",
            });
        }

        testimonial.isFeatured = !testimonial.isFeatured;

        await testimonial.save();

        return res.status(200).json({
            success: true,
            message: "Testimonial updated successfully",
            data: testimonial,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

export const getFeaturedTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ isFeatured: true });

        return res.status(200).json({
            success: true,
            data: testimonials,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}
