const { Router } = require('express');
const roomsController = require('../controllers/roomsController');
const router = Router();

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: List of all rooms
 */
router.get('/rooms', (req, res) => {
    const room = roomsController.getRoom(req.params.room)
    if(!room) return res.status(404).json({error:'not_found'})
    res.json(room)
})

/**
 * @swagger
 * /rooms/{room}:
 *   get:
 *     summary: Get a specific room
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: room
 *         schema:
 *           type: string
 *         required: true
 *         description: Room identifier
 *     responses:
 *       200:
 *         description: Room details
 *       404:
 *         description: Room not found
 */
router.get('/rooms/:room', roomsController.getRoom);

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Room created successfully
 */
router.post('/rooms', (req, res) => roomsController.createRoom(req, res));

/**
 * @swagger
 * /rooms/{room}:
 *   delete:
 *     summary: Delete a room
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: room
 *         schema:
 *           type: string
 *         required: true
 *         description: Room identifier
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *       404:
 *         description: Room not found
 */
router.delete('/rooms/:room', roomsController.removeRoom);

/**
 * @swagger
 * /rooms/{room}:
 *   put:
 *     summary: Rename a room
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: room
 *         schema:
 *           type: string
 *         required: true
 *         description: Room identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Room renamed successfully
 *       404:
 *         description: Room not found
 */
router.put('/rooms/:room', roomsController.renameRoom);

/**
 * @swagger
 * /rooms/{room}/users:
 *   post:
 *     summary: Add a user to a room
 *     tags: [Rooms, Users]
 *     parameters:
 *       - in: path
 *         name: room
 *         schema:
 *           type: string
 *         required: true
 *         description: Room identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User added successfully
 *       404:
 *         description: Room not found
 */
router.post('/rooms/:room/users', roomsController.addUser);

/**
 * @swagger
 * /rooms/{room}/users/{user}:
 *   delete:
 *     summary: Remove a user from a room
 *     tags: [Rooms, Users]
 *     parameters:
 *       - in: path
 *         name: room
 *         schema:
 *           type: string
 *         required: true
 *         description: Room identifier
 *       - in: path
 *         name: user
 *         schema:
 *           type: string
 *         required: true
 *         description: User identifier
 *     responses:
 *       200:
 *         description: User removed successfully
 *       404:
 *         description: Room or user not found
 */
router.delete('/rooms/:room/users/:user', roomsController.removeUserByName);

/**
 * @swagger
 * /rooms/{room}/users/{user}:
 *   put:
 *     summary: Update a user in a room
 *     tags: [Rooms, Users]
 *     parameters:
 *       - in: path
 *         name: room
 *         schema:
 *           type: string
 *         required: true
 *         description: Room identifier
 *       - in: path
 *         name: user
 *         schema:
 *           type: string
 *         required: true
 *         description: User identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: Room or user not found
 */
router.put('/rooms/:room/users/:user', roomsController.updateUserByName);

module.exports = router;