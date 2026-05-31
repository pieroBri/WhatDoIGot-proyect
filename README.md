Proyecto para crear un juegito web utilizando react y express.

Resumen de arquitectura
-----------------------

Este proyecto tiene una arquitectura sencilla: un cliente en React que se conecta por WebSockets (socket.io) a un servidor Express/Node que mantiene en memoria las "rooms" y sus usuarios.

Cliente (client)
- Context: `client/src/context/RoomContext.tsx`
	- Gestiona el estado global de la sala: `RoomState`, `roomName`, `userName`, `playersList`, `error` y el `socket` (almacenado en un ref).
	- Exporta `useRoom()` para acceder y mutar ese estado desde componentes.

- Hook: `client/src/hooks/useSocket.ts`
	- Crea y expone una instancia singleton de `socket.io-client` con `autoConnect: false` y hace cleanup al desmontar.

- Componentes clave: `client/src/components/LobbyManager.tsx`
	- `RoomManager`: formulario para crear/unirse a una room (emite `createRoom` y `joinRoom`).
	- `WaitingLobby`: lista `playersList`, botón `Salir` y (solo para el master) botón `Comenzar`.
	- Escucha/usa los eventos del context: `updateRoom`, `room_noexiste`, `roomYaExistente`.

Servidor (server)
- Entrypoint: `server/server.js`
	- Inicializa Express, Socket.IO y los endpoints REST para gestionar rooms.
	- En cada conexión de socket llama a `handleRoomEvents(socket, io)`.

- Handlers: `server/controllers/roomHandlers.js`
	- Maneja eventos de socket:
		- `createRoom(roomName, userName)` — crea la sala y agrega el usuario como master; emite `roomYaExistente` o `updateRoom`.
		- `joinRoom(roomName, userName)` — añade usuario a la sala; emite `updateRoom` o `room_noexiste`.
		- `leaveRoom(roomName, userName)` — elimina usuario, reasigna master si hace falta, emite `updateRoom` y puede eliminar la sala si queda vacía.

- Controller en memoria: `server/controllers/roomsController.js`
	- API simple en memoria: `getAll`, `getRoom`, `createRoom`, `addUser`, `removeUserByName`, `updateUserByName`, `renameRoom`, `removeRoom`.

Eventos socket importantes
- Cliente -> Servidor:
	- `createRoom` — pide crear una sala con un usuario inicial (server asigna `isMaster: true`).
	- `joinRoom` — pide unirse a una sala.
	- `leaveRoom` — salir de la sala.

- Servidor -> Cliente (emite):
	- `updateRoom` — envía la lista actualizada de usuarios de la sala.
	- `room_noexiste` — notifica que la sala no existe.
	- `roomYaExistente` — notifica que la sala que se intentó crear ya existe.
	- `room_deleted` — notifica que la sala fue eliminada.

Árbol de archivos (resumen)

project-root/
├─ client/
│  ├─ src/
│  │  ├─ context/
│  │  │  └─ RoomContext.tsx      # estado global y socket ref
│  │  ├─ hooks/
│  │  │  └─ useSocket.ts          # hook que crea el socket singleton
│  │  └─ components/
│  │     └─ LobbyManager.tsx      # RoomManager + WaitingLobby
│  └─ package.json
├─ server/
│  ├─ controllers/
│  │  ├─ roomHandlers.js         # socket event handlers (create/join/leave)
│  │  └─ roomsController.js      # in-memory store + helpers
│  ├─ server.js                   # express + socket.io entry
└─ README.md

Diagrama ASCII de interacciones (simplificado)

Client (React)
	|
	|-- useSocket() (socket.io-client)  <-- TCP/WebSocket -->  server/socket.io
	|
	`-- RoomContext -> proporciona `socket` y `playersList` a componentes
				 |
				 `-- LobbyManager (RoomManager / WaitingLobby)
							 - emite: `createRoom`, `joinRoom`, `leaveRoom`
							 - recibe: `updateRoom`, `room_noexiste`, `roomYaExistente`, `room_deleted`

Server (Express + Socket.IO)
	|
	`-- server.js -> on connection -> handleRoomEvents(socket, io)
				 |
				 `-- roomHandlers.js: createRoom / joinRoom / leaveRoom
							 `-- usa roomsController.js para persistencia en memoria
