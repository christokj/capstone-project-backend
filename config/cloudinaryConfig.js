// import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import multer from 'multer';

// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.API_KEY,
//     api_secret: process.env.API_SECRET,
// });

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'ecommerce',
//         format: async (req, file) => 'png', // Or 'jpeg', etc.
//         public_id: (req, file) => file.originalname.split('.')[0],
//     },
// });

// const upload = multer({ storage: storage });

// export { upload, cloudinary };
