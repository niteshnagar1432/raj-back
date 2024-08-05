import Coupon from '../models/couponModel.js';


export const addCoupon = async (req, res) => {
    try {
        const { code, discount, expireAt, limit } = req.body;

        switch (true) {
            case !code:
                return res.status(400).json({
                    success: false,
                    message: "Code is required",
                });
            case !discount:
                return res.status(400).json({
                    success: false,
                    message: "Discount is required",
                });
            case !expireAt:
                return res.status(400).json({
                    success: false,
                    message: "ExpireAt is required",
                });
            case !limit:
                return res.status(400).json({
                    success: false,
                    message: "Limit is required",
                });

        }

        const coupon = new Coupon({
            code,
            discount,
            expireAt,
            limit
        });

        await coupon.save();

        res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            data: coupon,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();

        res.status(200).json({
            success: true,
            data: coupons,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }

        res.status(200).json({
            success: true,
            data: coupon,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }

        const { code, discount, expireAt, limit } = req.body;

        if (code) {
            coupon.code = code;
        }

        if (discount) {
            coupon.discount = discount;
        }

        if (expireAt) {
            coupon.expireAt = expireAt;
        }

        if (limit) {
            coupon.limit = limit;
        }

        await coupon.save();

        res.status(200).json({
            success: true,
            message: "Coupon updated successfully",
            data: coupon,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }


}

export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }

        await coupon.deleteOne();

        res.status(200).json({
            success: true,
            message: "Coupon deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const applyCoupon = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Code is required",
            });
        }

        const coupon = await Coupon.findOne({ code });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }

        res.status(200).json({
            success: true,
            data: {
                _id: coupon._id,
                code: coupon.code,
                discount: coupon.discount,
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
