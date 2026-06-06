class RoomsController {
  constructor() {
    this.rooms = {};
  }

  getAll(req, res) {
    res.json(this.rooms);
  }

  getRoom(req, res) {
    const room = this.rooms[req.params.name];
    if (!room) return res.status(404).json({ error: "not_found" });
    res.json(room);
  }

  createRoom(req, res) {

    const { roomName, userName } = req.body;
    if (!roomName) return res.status(400).json({ error: "roomName required" });
    if (this.rooms[roomName]) return res.status(409).json({ error: "room_exists" });
    this.rooms[roomName] = { users: [] };
    if (userName) this.addUser(roomName, userName);
    res.status(201).json({ ok: true });
  }

  removeRoom(name) {
    if (!this.rooms[name]) return { ok: false, error: "not_found" };
    delete this.rooms[name];
    return { ok: true };
  }

  addUser(roomName, user) {
    const room = this.rooms[roomName];
    if (!room) return { ok: false, error: "room_not_found" };
    room.users.push(user);
    return { ok: true };
  }

  // Remove a user by their socket id from a single room.
  removeUserById(userId) {
    for (const roomName of Object.keys(this.rooms)) {
      const room = this.rooms[roomName]
      const idx = room.users.findIndex((u) => u.id === userId)
      if (idx !== -1) {
        room.users.splice(idx, 1)
        return { ok: true, roomName }
      }
    }
    return { ok: true, roomName: null }
  }

  removeUserByName(roomName, userName) {
    const room = this.rooms[roomName];
    if (!room) return { ok: false, error: "room_not_found" };
    const before = room.users.length;
    room.users = room.users.filter((u) => u.name !== userName);
    const after = room.users.length;
    return { ok: true, removed: before - after };
  }

  updateUserByName(roomName, userName, newUserData) {
    const room = this.rooms[roomName];
    if (!room) return { ok: false, error: "room_not_found" };
    const idx = room.users.findIndex((u) => u.name === userName);
    if (idx === -1) return { ok: false, error: "user_not_found" };
    room.users[idx] = { ...room.users[idx], ...newUserData };
    return { ok: true, user: room.users[idx] };
  }

  renameRoom(oldName, newName) {
    if (!this.rooms[oldName]) return { ok: false, error: "room_not_found" };
    if (this.rooms[newName]) return { ok: false, error: "new_name_taken" };
    this.rooms[newName] = this.rooms[oldName];
    delete this.rooms[oldName];
    return { ok: true };
  }
}

module.exports = new RoomsController();
