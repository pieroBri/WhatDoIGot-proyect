const { Router } = require('express');
const roomsController = require('../controllers/roomsController');
const router = Router();

router.get('/rooms', (roomName) => {

    /* #swagger.tags = ['Rooms'] */
    /* #swagger.summary = 'Get all rooms' */
    /* #swagger.description = 'Returns all application rooms' */

    /* #swagger.responses[200] = {
        description: 'Rooms retrieved successfully',
        schema: [
            {
                roomName: 'General Chat',
                users: [
                    {
                        username: 'juan123'
                    },
                    {
                        username: 'maria456'
                    }
                ]
            }
        ],
        example: [ 
            { 
                roomName: 'General Chat', 
                users: [ 
                    { 
                        username: 'juan123' 
                    }, 
                    {   
                        username: 'maria456' 
                    } 
                ] 
            }
        ]
    } */
    roomsController.getAll();
})


router.get('/rooms/:room', (roomName) => {
    /* #swagger.tags = ['Rooms'] */
    /* #swagger.summary = 'Get all rooms' */
    /* #swagger.description = 'Returns all application rooms' */

    /* #swagger.responses[200] = {
        description: 'Rooms retrieved successfully',
        schema: [
            {
                roomName: 'General Chat',
                users: [
                    {
                        username: 'juan123'
                    },
                    {
                        username: 'maria456'
                    }
                ]
            }
        ],
        example: [ 
            { 
                roomName: 'General Chat', 
                users: [ 
                    { 
                        username: 'juan123' 
                    }, 
                    {   
                        username: 'maria456' 
                    } 
                ] 
            }
        ]
    } */

    /* #swagger.responses[404] = {
        description: 'Error retrieving rooms',
        schema: {
            message: 'not_found'
        }
    } */
    roomsController.getRoom(roomName)
});


router.post('/rooms', (roomName, userName) => {
    
    /* #swagger.tags = ['Rooms'] */
    /* #swagger.summary = 'Create rooms' */
    /* #swagger.description = 'Create a room' */

    /* #swagger.responses[200] = {
        description: 'Rooms Create successfully',
        schema: [
            {
                roomName: 'General Chat',
                username: 'Piero'
            }
        ],
        example: [ 
            { 
                roomName: 'General Chat',
                username: 'Piero'
            }
        ]
    } */
    roomsController.createRoom(roomName, userName)
});


router.delete('/rooms/:room', (roomName) => {
    
    /* #swagger.tags = ['Rooms'] */
    /* #swagger.summary = 'Delete room' */
    /* #swagger.description = 'Delete a room' */

    /* #swagger.responses[200] = {
        description: 'Rooms Deleted successfully',
        schema: [
            {
                roomName: 'General Chat'
            }
        ],
        example: [ 
            { 
                roomName: 'General Chat'
            }
        ]
    } */

     /* #swagger.responses[400] = {
        description: 'Error deleting rooms',
        schema: {
            message: 'not_found'
        }
    } */
    roomsController.removeRoom
});

router.put('/rooms/:room', (newRoomName, oldRoomName) => {
    /* #swagger.tags = ['Rooms'] */
    /* #swagger.summary = 'Rename room' */
    /* #swagger.description = 'Rename a room' */

    /* #swagger.responses[200] = {
        description: 'Rooms Renamed successfully',
        schema: [
            {
                oldRoomName: 'General Chat',
                newRoomName: 'Tuki chat'
            }
        ],
        example: [ 
            { 
                oldRoomName: 'General Chat',
                newRoomName: 'Tuki chat'
            }
        ]
    } */

     /* #swagger.responses[400] = {
        description: 'Error renaming rooms',
        schema: {
            message: 'Error renaming rooms'
        }
    } */
    roomsController.renameRoom(newRoomName, oldRoomName)
});

router.post('/rooms/:room/users', (roomName, user) => {
    /* #swagger.tags = ['Rooms'] */
    /* #swagger.summary = 'Add user' */
    /* #swagger.description = 'Add user' */

    /* #swagger.responses[200] = {
        description: 'User added successfully',
        schema: [
            {
                roomName: 'General Chat',
                user: 'Tuki'
            }
        ],
        example: [ 
            { 
                roomName: 'General Chat',
                user: 'Tuki'
            }
        ]
    } */

     /* #swagger.responses[404] = {
        description: 'Error rooms',
        schema: {
            message: 'Room not found'
        }
    } */
    roomsController.addUser(roomName, user)
});

router.delete('/rooms/:room/users/:user', (roomName, user) => {

    roomsController.removeUserByName(roomName, user)
});

router.put('/rooms/:room/users/:user', (roomName, userName, newUser) => {
    roomsController.updateUserByName(roomName, userName, newUser)
});

module.exports = router;