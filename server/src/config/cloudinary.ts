import { v2 as cloudinary } from 'cloudinary';
import { environment } from './environment.js';

if (environment.cloudinary.cloudName) {
  cloudinary.config({
    cloud_name: environment.cloudinary.cloudName,
    api_key: environment.cloudinary.apiKey,
    api_secret: environment.cloudinary.apiSecret
  });
}

export { cloudinary };
