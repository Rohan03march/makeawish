const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const stream = require('stream');
const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'makeawish',
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ message: 'Image upload failed' });
                }
                res.status(200).json(result.secure_url);
            }
        );

        bufferStream.pipe(uploadStream);

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Server error during upload' });
    }
});

module.exports = router;
