import { deleteImageFromS3, uploadFileToS3 } from "../middlewares/bucket.js";
import Blog from "../models/blogModel.js";
import BlogComment from "../models/blogComments.js";

export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, html, status } = req.body;

    switch (true) {
      case !title:
        return res.status(400).json({
          success: false,
          message: "Title is required",
        });
      case !subTitle:
        return res.status(400).json({
          success: false,
          message: "SubTitle is required",
        });
      case !description:
        return res.status(400).json({
          success: false,
          message: "Description is required",
        });
      case !html:
        return res.status(400).json({
          success: false,
          message: "Html is required",
        });
      case status && status !== "active" && status !== "inactive":
        return res.status(400).json({
          success: false,
          message: "Status shuld be active or inactive",
        });
    }

    if (!req.files["coverImage"]) {
      return res.status(400).json({
        success: false,
        message: "Cover Image is required",
      });
    }

    if (!req.files["otherImages"]) {
      return res.status(400).json({
        success: false,
        message: "Other Images are required",
      });
    }

    if (!req.files["backgroundImage"]) {
      return res.status(400).json({
        success: false,
        message: "Background Image is required",
      });
    }

    const coverImage = req.files["coverImage"][0];

    const coverImageLocation = await uploadFileToS3(coverImage);

    const images = req.files["otherImages"].map((image) => image);

    const imagesLocations = [];

    const imagesLocation = await Promise.all(
      images.map(async (image) => {
        const location = await uploadFileToS3(image);
        imagesLocations.push(location.Location);
      })
    );

    const backgroundImage = req.files["backgroundImage"][0];

    const backgroundImageLocation = await uploadFileToS3(backgroundImage);

    const blog = new Blog({
      title,
      subTitle,
      description,
      html,
      status,
      coverImage: coverImageLocation.Location,
      otherImages: imagesLocations,
      backgroundImage: backgroundImageLocation.Location,
    });

    await blog.save();

    return res.status(201).json({
      success: true,
      message: "Blog added successfully",
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate({
      path: 'comments',
      populate: {
        path: 'user',
      }
    })
    .exec();

    return res.status(200).json({
      success: true,
      message: "All blogs fetched successfully",
      data: blogs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
      }
    })
    .exec();
  
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    await blog.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const { title, subTitle, description, html, status } = req.body;

    if (title) {
      blog.title = title;
    }

    if (subTitle) {
      blog.subTitle = subTitle;
    }

    if (description) {
      blog.description = description;
    }

    if (html) {
      blog.html = html;
    }

    if (status) {
      blog.status = status;
    }

    if (req.files["coverImage"]) {
      const coverImage = req.files["coverImage"][0];

      const coverImageLocation = await uploadFileToS3(coverImage);
      //   delete old cover image
      await deleteImageFromS3(blog.coverImage);

      blog.coverImage = coverImageLocation.Location;
    }

    if (req.files["otherImages"]) {
      const images = req.files["otherImages"].map((image) => image);

      const imagesLocations = [];

      const imagesLocation = await Promise.all(
        images.map(async (image) => {
          const location = await uploadFileToS3(image);
          imagesLocations.push(location.Location);
          await deleteImageFromS3(location.Location);
        })
      );

      blog.otherImages = imagesLocations;
    }

    if (req.files["backgroundImage"]) {
      const backgroundImage = req.files["backgroundImage"][0];

      const backgroundImageLocation = await uploadFileToS3(backgroundImage);
      //   delete old background image
      await deleteImageFromS3(blog.backgroundImage);

      blog.backgroundImage = backgroundImageLocation.Location;
    }

    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// comments in blog 

export const addCommentBlog = async (req, res) => {

  try {
    const { content } = req.body;
    switch (true) {
      case !content:
        return res.status(400).json({
          success: false,
          message: "Content is required",
        });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const comment = new BlogComment({
      user: req.user._id,
      blog: blog._id,
      content,
    });

    await comment.save();

    blog.comments.push(comment._id);

    await blog.save();

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
