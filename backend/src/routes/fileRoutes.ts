import express from 'express';
import { getAudioFile, getImageFile } from '../controllers/fileController';

const router = express.Router();

/**
 * @swagger
 * /api/files/audio/{fileId}:
 *   get:
 *     summary: Stream audio file from MongoDB GridFS
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: GridFS file ID
 *     responses:
 *       200:
 *         description: Audio file stream
 *         content:
 *           audio/mpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 */
router.get('/audio/:fileId', getAudioFile);

/**
 * @swagger
 * /api/files/image/{fileId}:
 *   get:
 *     summary: Get image file from MongoDB GridFS
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: GridFS file ID
 *     responses:
 *       200:
 *         description: Image file
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 */
router.get('/image/:fileId', getImageFile);

export default router;
