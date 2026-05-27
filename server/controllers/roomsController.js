class RoomsController {
  constructor() {
    this.rooms = {}
  }

  getAll() {
    return this.rooms
  }

  getRoom(name) {
    return this.rooms[name] || null
  }

  createRoom(name, initialUser) {
    if (!name) return { ok: false, error: 'roomName required' }
    if (this.rooms[name]) return { ok: false, error: 'room_exists' }
    this.rooms[name] = { users: [] }
    if (initialUser) this.addUser(name, initialUser)
    return { ok: true }
  }

  removeRoom(name) {
    if (!this.rooms[name]) return { ok: false, error: 'not_found' }
    delete this.rooms[name]
    return { ok: true }
  }

  addUser(roomName, user) {
    const room = this.rooms[roomName]
    if (!room) return { ok: false, error: 'room_not_found' }
    room.users.push(user)
    return { ok: true }
  }

  removeUserByName(roomName, userName) {
    const room = this.rooms[roomName]
    if (!room) return { ok: false, error: 'room_not_found' }
    const before = room.users.length
    room.users = room.users.filter((u) => u.name !== userName)
    const after = room.users.length
    return { ok: true, removed: before - after }
  }

  updateUserByName(roomName, userName, newUserData) {
    const room = this.rooms[roomName]
    if (!room) return { ok: false, error: 'room_not_found' }
    const idx = room.users.findIndex((u) => u.name === userName)
    if (idx === -1) return { ok: false, error: 'user_not_found' }
    room.users[idx] = { ...room.users[idx], ...newUserData }
    return { ok: true, user: room.users[idx] }
  }

  renameRoom(oldName, newName) {
    if (!this.rooms[oldName]) return { ok: false, error: 'room_not_found' }
    if (this.rooms[newName]) return { ok: false, error: 'new_name_taken' }
    this.rooms[newName] = this.rooms[oldName]
    delete this.rooms[oldName]
    return { ok: true }
  }
}

module.exports = new RoomsController()
