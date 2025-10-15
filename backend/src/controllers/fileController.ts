import { Request, Response } from 'express';
import { getGridFSBucket } from '../config/database';
import mongoose from 'mongoose';

/**
 * @route   GET /api/files/audio/:fileId
 * @desc    Stream audio file from GridFS
 * @access  Public
 */
export const getAudioFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid file ID',
      });
      return;
    }

    const bucket = getGridFSBucket();
    const objectId = new mongoose.Types.ObjectId(fileId);

    // Check if file exists
    const files = await bucket.find({ _id: objectId }).toArray();
    if (files.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Audio file not found',
      });
      return;
    }

    const file = files[0];

    // Set response headers
    res.set({
      'Content-Type': file.metadata?.contentType || 'audio/mpeg',
      'Content-Length': file.length,
      'Accept-Ranges': 'bytes',
      'Content-Disposition': `inline; filename="${file.filename}"`,
    });

    // Stream the file
    const downloadStream = bucket.openDownloadStream(objectId);

    downloadStream.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error streaming audio file',
        });
      }
    });

    downloadStream.pipe(res);
  } catch (error: unknown) {
    console.error('Get audio file error:', error);
    if (!res.headersSent) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({
        success: false,
        message: 'Server error while fetching audio file',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      });
    }
  }
};

/**
 * @route   GET /api/files/image/:fileId
 * @desc    Get image file from GridFS
 * @access  Public
 */
export const getImageFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid file ID',
      });
      return;
    }

    const bucket = getGridFSBucket();
    const objectId = new mongoose.Types.ObjectId(fileId);

    // Check if file exists
    const files = await bucket.find({ _id: objectId }).toArray();
    if (files.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Image file not found',
      });
      return;
    }

    const file = files[0];

    // Set response headers
    res.set({
      'Content-Type': file.metadata?.contentType || 'image/jpeg',
      'Content-Length': file.length,
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Cache-Control': 'public, max-age=31536000',
    });

    // Stream the file
    const downloadStream = bucket.openDownloadStream(objectId);

    downloadStream.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error streaming image file',
        });
      }
    });

    downloadStream.pipe(res);
  } catch (error: unknown) {
    console.error('Get image file error:', error);
    if (!res.headersSent) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({
        success: false,
        message: 'Server error while fetching image file',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      });
    }
  }
};
