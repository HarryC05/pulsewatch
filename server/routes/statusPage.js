import express from 'express';

import { protect } from '../middleware/auth.js';
import {
  descRegex,
  nameRegex,
  slugRegex,
} from '../../shared/regex.js';
import { prisma, formatPage } from '../utils/index.js';

const router = express.Router();

/**
 * API Routes
 * @route GET /api/v1/status-page
 * @access Public
 * 
 * @returns {object} - API information
 */
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Status Page API',
    endpoints: [
      { method: 'POST', path: '/api/v1/status-page/create', description: 'Create a new status page' },
      { method: 'GET', path: '/api/v1/status-page/list', description: 'Get all status pages for the logged-in user' },
      { method: 'GET', path: '/api/v1/status-page/:slug', description: 'Get a specific status page by slug' },
      { method: 'PUT', path: '/api/v1/status-page/:id', description: 'Update a status page' },
      { method: 'DELETE', path: '/api/v1/status-page/:id', description: 'Delete a status page' },
    ],
  });
});

/**
 * Create a new status page
 * @route POST /api/v1/status-page/create
 * @access Private
 * 
 * @param {string}   title        - The name of the status page
 * @param {string}   slug        - The slug of the status page
 * @param {string}   description - The description of the status page
 * @param {boolean}  isPublic    - Whether the status page is public or private
 * @param {string[]} monitors    - The list of monitor IDs associated with the status page
 * 
 * @returns {object} - The created status page object
 */
router.post('/create', protect, async (req, res) => {
  // Check that the body is provided
  if (!req.body) {
    return res.status(400).json({ message: 'Body is required' });
  }

  const {
    title = '',
    slug = '',
    description = '',
    isPublic = false,
    monitors = [],
  } = req.body;

  // Check that the title and slug are provided
  if (!title || !slug) {
    return res.status(400).json({ message: 'Title and slug are required' });
  }

  // Validate status page name
  if (!nameRegex.pattern.test(title)) {
    return res.status(400).json({ message: nameRegex.err });
  }

  // Validate status page slug
  if (!slugRegex.pattern.test(slug)) {
    return res.status(400).json({ message: slugRegex.err });
  }

  // Validate status page description
  if (!descRegex.pattern.test(description)) {
    return res.status(400).json({ message: descRegex.err });
  }

  // Check if the user has reached their status page limit
  const userStatusPages = await prisma.statusPage.count({
    where: { userId: req.user.id },
  });

  const statusPageLimit = 100;

  if (userStatusPages >= statusPageLimit) {
    return res.status(403).json({ message: `Status page limit of ${statusPageLimit} reached` });
  }

  try {
    // Check if the slug is already taken
    const existingStatusPage = await prisma.statusPage.findUnique({
      where: { slug },
    });

    if (existingStatusPage) {
      return res.status(400).json({ message: 'Slug is already taken' });
    }

    // Validate the current user owns the monitors
    const userMonitors = await prisma.monitor.findMany({
      where: {
        id: { in: monitors },
        userId: req.user.id,
      },
    });

    if (userMonitors.length !== monitors.length) {
      return res.status(400).json({ message: 'You do not own all the monitors' });
    }

    // Create the status page
    const statusPage = await prisma.statusPage.create({
      data: {
        userId: req.user.id,
        title,
        slug,
        description,
        isPublic,
        monitors: {
          create: monitors.map((monitorId) => ({
            monitor: {
              connect: { id: monitorId },
            },
          })),
        },
      },
    });

    res.status(201).json(statusPage);
  } catch (error) {
    console.error('Error creating status page:', error);
    res.status(500).json({ message: 'Failed to create status page' });
  }
});

/**
 * Get all status pages for the logged-in user
 * @route GET /api/v1/status-page/list
 * @access Private
 * 
 * @returns {Array} - List of status pages for the logged-in user
 */
router.get('/list', protect, async (req, res) => {
  try {
    // Get status pages belonging to logged-in user
    const statusPages = await prisma.statusPage.findMany({
      where: { userId: req.user.id },
      include: {
        monitors: {
          include: {
            monitor: true,
          },
        },
      },
    });

    res.json(statusPages);
  } catch (error) {
    console.error('Error fetching status pages:', error);
    res.status(500).json({ message: 'Failed to fetch status pages' });
  }
});

/**
 * Get a specific status page by slug
 * @route GET /api/v1/status-page/:slug
 * @access Public
 * 
 * @param {string} slug - The slug of the status page
 * 
 * @returns {object} - The status page object
 */
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    // Find the status page by slug
    const statusPage = await prisma.statusPage.findUnique({
      where: { slug },
      include: {
        monitors: {
          include: {
            monitor: {
              include: {
                heartbeats: {
                  orderBy: {
                    createdAt: 'desc',
                  },
                  where: {
                    createdAt: {
                      gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // last 7 days
                    },
                  },
                },
              },
            }
          },
        },
      },
    });

    if (!statusPage) {
      return res.status(404).json({ message: 'Status page not found' });
    }

    // Check if the status page is public or belongs to the logged-in user
    if (!statusPage.isPublic) {
      // Pass to protect middleware to check if the user is logged in
      return protect(req, res, () => {
        // Check if the logged-in user is the owner of the status page
        if (req.user.id !== statusPage.userId) {
          return res.status(403).json({ message: 'Forbidden' });
        }

        // Format the status page data
        res.json(formatPage(statusPage));
      });
    }

    // Format the status page data
    const formattedStatusPage = formatPage(statusPage);
    res.json(formattedStatusPage);
  } catch (error) {
    console.error('Error fetching status page:', error);
    res.status(500).json({ message: 'Failed to fetch status page' });
  }
});

/**
 * Update a status page
 * @route PUT /api/v1/status-page/:id
 * @access Private
 * 
 * @param {string}   id          - The ID of the status page
 * @param {string}   title       - The name of the status page
 * @param {string}   slug        - The slug of the status page
 * @param {string}   description - The description of the status page
 * @param {boolean}  isPublic    - Whether the status page is public or private
 * @param {string[]} monitors    - The list of monitor IDs associated with the status page
 * 
 * @returns {object} - The updated status page object
 */
router.put('/:id', protect, async (req, res) => {
  const { id } = req.params;

  // Check that the ID is provided
  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  // Check that the body is provided
  if (!req.body) {
    return res.status(400).json({ message: 'Body is required' });
  }

  const {
    title = '',
    slug = '',
    description = '',
    isPublic = false,
    monitors = [],
  } = req.body;

  // Check that the title and slug are provided
  if (!title || !slug) {
    return res.status(400).json({ message: 'Title and slug are required' });
  }

  // Validate status page name
  if (!nameRegex.pattern.test(title)) {
    return res.status(400).json({ message: nameRegex.err });
  }

  // Validate status page slug
  if (!slugRegex.pattern.test(slug)) {
    return res.status(400).json({ message: slugRegex.err });
  }

  // Validate status page description
  if (!descRegex.pattern.test(description)) {
    return res.status(400).json({ message: descRegex.err });
  }

  try {
    // Check if the status page exists
    const existingStatusPage = await prisma.statusPage.findUnique({
      where: { id },
    });

    if (!existingStatusPage) {
      return res.status(404).json({ message: 'Status page not found' });
    }

    // Check if the logged-in user is the owner of the status page
    if (existingStatusPage.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Update the status page
    const updatedStatusPage = await prisma.statusPage.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        isPublic,
        monitors: {
          deleteMany: {},
          create: monitors.map((monitorId) => ({
            monitor: {
              connect: { id: monitorId },
            },
          })),
        },
      },
    });

    res.json(updatedStatusPage);
  } catch (error) {
    console.error('Error updating status page:', error);
    res.status(500).json({ message: 'Failed to update status page' });
  }
});

/**
 * Delete a status page
 * @route DELETE /api/v1/status-page/:id
 * @access Private
 * 
 * @param {string} id - The ID of the status page
 * 
 * @returns {object} - The deleted status page object
 */
router.delete('/:id', protect, async (req, res) => {
  const { id } = req.params;

  // Check that the ID is provided
  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  try {
    // Check if the status page exists
    const existingStatusPage = await prisma.statusPage.findUnique({
      where: { id },
    });

    if (!existingStatusPage) {
      return res.status(404).json({ message: 'Status page not found' });
    }

    // Check if the logged-in user is the owner of the status page
    if (existingStatusPage.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Delete all statusPageMonitors associated with the status page
    await prisma.statusPageMonitor.deleteMany({
      where: { statusPageId: id },
    });

    // Delete the status page
    const deletedStatusPage = await prisma.statusPage.delete({
      where: { id },
    });

    res.json(deletedStatusPage);
  } catch (error) {
    console.error('Error deleting status page:', error);
    res.status(500).json({ message: 'Failed to delete status page' });
  }
});

export default router;