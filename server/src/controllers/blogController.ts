import { Request, Response } from 'express';
import Blog from '../models/Blog.js';
import { successResponse } from '../utils/response.js';
import { defaultBlogs } from '../utils/mockData.js';
import { ApiError } from '../middlewares/errorHandler.js';

export const listBlogs = async (_req: Request, res: Response): Promise<void> => {
  const blogs = await Blog.find();
  res.json(successResponse(blogs.length ? blogs : defaultBlogs));
};

export const getBlogById = async (req: Request, res: Response, next: (err: Error) => void): Promise<void> => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(new ApiError(404, 'Blog not found'));
  }
  res.json(successResponse(blog));
};
