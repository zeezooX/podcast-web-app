import express from 'express';
import {
  getAllPodcasts,
  getPodcastById,
  createPodcast,
  deletePodcast,
} from '../controllers/podcastController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

/**
 * @swagger
 * /api/podcasts:
 *   get:
 *     summary: Get all podcasts with basic metadata only
 *     tags: [Podcasts]
 *     responses:
 *       200:
 *         description: List of podcasts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/podcasts', getAllPodcasts);

/**
 * @swagger
 * /api/podcast/{id}:
 *   get:
 *     summary: Get specific podcast with full metadata and audio file
 *     tags: [Podcasts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Podcast ID
 *     responses:
 *       200:
 *         description: Podcast retrieved successfully
 *       404:
 *         description: Podcast not found
 */
router.get('/podcast/:id', getPodcastById);

/**
 * @swagger
 * /api/podcast:
 *   post:
 *     summary: Upload new podcast with metadata and audio file
 *     tags: [Podcasts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - author
 *               - audio
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               author:
 *                 type: string
 *               category:
 *                 type: string
 *               audio:
 *                 type: string
 *                 format: binary
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Podcast uploaded successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/podcast',
  authenticate,
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
  createPodcast
);

/**
 * @swagger
 * /api/podcast/{id}:
 *   delete:
 *     summary: Delete a podcast (only owner can delete)
 *     tags: [Podcasts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Podcast ID
 *     responses:
 *       200:
 *         description: Podcast deleted successfully
 *       403:
 *         description: Not authorized to delete this podcast
 *       404:
 *         description: Podcast not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/podcast/:id', authenticate, deletePodcast);

export default router;
