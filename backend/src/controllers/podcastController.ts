import { Response } from 'express';
import Podcast from '../models/Podcast';
import { AuthRequest } from '../middleware/auth';
import { getGridFSBucket } from '../config/database';
import { Readable } from 'stream';
import * as mm from 'music-metadata';

/**
 * @route   GET /api/podcasts
 * @desc    Get all podcasts with basic metadata only
 * @access  Public
 */
export const getAllPodcasts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get only basic metadata, exclude audioFileId
    const podcasts = await Podcast.find()
      .select('-audioFileId')
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    // Add imageUrl to each podcast
    const podcastsWithUrls = podcasts.map((podcast) => {
      const podcastObj = podcast.toObject();
      return {
        ...podcastObj,
        imageUrl: podcastObj.imageFileId ? `/api/files/image/${podcastObj.imageFileId}` : null,
      };
    });

    res.status(200).json({
      success: true,
      count: podcastsWithUrls.length,
      data: podcastsWithUrls,
    });
  } catch (error: unknown) {
    console.error('Get all podcasts error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      message: 'Server error while fetching podcasts',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    });
  }
};

/**
 * @route   GET /api/podcast/:id
 * @desc    Get specific podcast with full metadata (file IDs for download)
 * @access  Public
 */
export const getPodcastById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const podcast = await Podcast.findById(id).populate('uploadedBy', 'name email');

    if (!podcast) {
      res.status(404).json({
        success: false,
        message: 'Podcast not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        ...podcast.toObject(),
        audioUrl: `/api/files/audio/${podcast.audioFileId}`,
        imageUrl: podcast.imageFileId ? `/api/files/image/${podcast.imageFileId}` : null,
      },
    });
  } catch (error: unknown) {
    console.error('Get podcast by ID error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      message: 'Server error while fetching podcast',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    });
  }
};

/**
 * @route   POST /api/podcast
 * @desc    Upload new podcast with metadata and audio file
 * @access  Private (requires authentication)
 */
export const createPodcast = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, author, category } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Validation
    if (!title || !description || !author) {
      res.status(400).json({
        success: false,
        message: 'Please provide title, description, and author',
      });
      return;
    }

    if (!files?.audio || files.audio.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Please upload an audio file',
      });
      return;
    }

    const audioFile = files.audio[0];
    const imageFile = files.image ? files.image[0] : null;

    // Extract audio metadata (duration)
    let duration: number | undefined;
    try {
      const metadata = await mm.parseBuffer(audioFile.buffer, audioFile.mimetype);
      duration = metadata.format.duration ? Math.floor(metadata.format.duration) : undefined;
    } catch (metadataError) {
      console.warn('Failed to extract audio duration:', metadataError);
      // Continue without duration - it's not critical
    }

    // Get GridFS bucket
    const bucket = getGridFSBucket();

    // Upload audio file to GridFS
    const audioUploadStream = bucket.openUploadStream(audioFile.originalname, {
      contentType: audioFile.mimetype,
      metadata: {
        fieldName: 'audio',
        originalName: audioFile.originalname,
        uploadedBy: req.user?.id,
      },
    });

    const audioReadable = Readable.from(audioFile.buffer);
    audioReadable.pipe(audioUploadStream);

    await new Promise((resolve, reject) => {
      audioUploadStream.on('finish', resolve);
      audioUploadStream.on('error', reject);
    });

    const audioFileId = audioUploadStream.id;

    // Upload image file to GridFS if provided
    let imageFileId = null;
    if (imageFile) {
      const imageUploadStream = bucket.openUploadStream(imageFile.originalname, {
        contentType: imageFile.mimetype,
        metadata: {
          fieldName: 'image',
          originalName: imageFile.originalname,
          uploadedBy: req.user?.id,
        },
      });

      const imageReadable = Readable.from(imageFile.buffer);
      imageReadable.pipe(imageUploadStream);

      await new Promise((resolve, reject) => {
        imageUploadStream.on('finish', resolve);
        imageUploadStream.on('error', reject);
      });

      imageFileId = imageUploadStream.id;
    }

    // Create podcast
    const podcast = await Podcast.create({
      title,
      description,
      author,
      category: category || 'General',
      audioFileId,
      imageFileId,
      duration,
      fileSize: audioFile.size,
      uploadedBy: req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: 'Podcast uploaded successfully',
      data: {
        ...podcast.toObject(),
        audioUrl: `/api/files/audio/${audioFileId}`,
        imageUrl: imageFileId ? `/api/files/image/${imageFileId}` : null,
      },
    });
  } catch (error: unknown) {
    console.error('Create podcast error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      message: 'Server error while creating podcast',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    });
  }
};

/**
 * @route   DELETE /api/podcast/:id
 * @desc    Delete a podcast and its associated files from GridFS
 * @access  Private (requires authentication, only podcast owner can delete)
 */
export const deletePodcast = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find the podcast
    const podcast = await Podcast.findById(id);

    if (!podcast) {
      res.status(404).json({
        success: false,
        message: 'Podcast not found',
      });
      return;
    }

    // Check if user is the owner
    if (podcast.uploadedBy.toString() !== req.user?.id) {
      res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this podcast',
      });
      return;
    }

    const bucket = getGridFSBucket();

    // Delete audio file from GridFS
    try {
      await bucket.delete(podcast.audioFileId);
    } catch (error) {
      console.error('Error deleting audio file:', error);
    }

    // Delete image file from GridFS if it exists
    if (podcast.imageFileId) {
      try {
        await bucket.delete(podcast.imageFileId);
      } catch (error) {
        console.error('Error deleting image file:', error);
      }
    }

    // Delete podcast document
    await Podcast.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Podcast deleted successfully',
    });
  } catch (error: unknown) {
    console.error('Delete podcast error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      message: 'Server error while deleting podcast',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    });
  }
};
