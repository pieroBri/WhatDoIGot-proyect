# WhatDoIGot

Proyecto para crear un juego web multijugador simple con React, Express y Socket.IO.

## Últimas actualizaciones

- Nuevo flujo de "waiting lobby" donde los jugadores pueden ver la lista de participantes.
- Se agregó la capacidad de marcar al jugador como listo (`isReady`) y ver el estado de cada participante.
- El creador de la sala (`master`) puede iniciar el juego cuando todos están listos.
- El servidor ahora maneja desconexiones, reasigna el master si es necesario y elimina salas vacías.
- Se añadió documentación de API con Swagger en la carpeta `swagger/`.
- El servidor expone endpoints REST para crear, renombrar, consultar y eliminar salas y usuarios.

## Arquitectura general

Este proyecto se divide en tres partes principales:

- `client/`: aplicación React que consume el backend por sockets.
- `server/`: backend Express + Socket.IO que mantiene las salas en memoria.
- `swagger/`: documentación estática de la API generada con Swagger.

## Cliente (`client`)

- `client/src/context/RoomContext.tsx`
    - Gestiona el estado global de sala: `state`, `roomName`, `userName`, `playersList`, `error` y la instancia de `socket`.
    - Expone `useRoom()` para ser consumido por componentes.

- `client/src/hooks/useSocket.ts`
    - Crea y mantiene un socket singleton con `autoConnect: false`.
    - Hace cleanup al desmontar para desconectar la conexión.

- `client/src/components/LobbyManager.tsx`
    - `RoomManager`: formulario para crear o unirse a una sala.
    - `WaitingLobby`: muestra la lista de jugadores, permite salir de la sala y agrega el estado de listo/no listo.
    - La UI decide si el usuario actual es el `master` y habilita un botón de "Start Game" cuando todos están listos.

## Servidor (`server`)

- `server/server.js`
    - Arranca Express en el puerto `4000`.
    - Inicializa Socket.IO con CORS para `http://localhost:5173`.
    - Expone endpoints REST para gestionar salas y usuarios.
    - Maneja eventos de socket al conectar clientes.

- `server/controllers/roomHandlers.js`
    - Evento `createRoom`: crea una sala y marca al usuario inicial como master.
    - Evento `joinRoom`: agrega usuario a la sala existente.
    - Evento `leaveRoom`: elimina usuario y actualiza la sala.
    - Evento `toggleReady`: alterna el estado de listo de un jugador.
    - Evento `disconnect`: limpia la sala cuando un cliente se desconecta.

- `server/controllers/roomsController.js`
    - Controlador en memoria para las salas.
    - Métodos disponibles:
        - `getAll()`, `getRoom(name)`
        - `createRoom(name, initialUser)`
        - `removeRoom(name)`
        - `addUser(roomName, user)`
        - `removeUserById(userId)`
        - `removeUserByName(roomName, userName)`
        - `updateUserByName(roomName, userName, newUserData)`
        - `renameRoom(oldName, newName)`

## API REST

El servidor ofrece estos endpoints principales:

- `GET /api` — mensaje de prueba.
- `GET /api/rooms` — lista todas las salas activas.
- `GET /api/rooms/:room` — obtiene el detalle de una sala.
- `POST /api/rooms` — crea una sala y puede recibir un usuario inicial.
- `PUT /api/rooms/:room` — renombra una sala.
- `DELETE /api/rooms/:room` — elimina una sala.
- `DELETE /api/rooms/:room/users/:username` — elimina un usuario de una sala.
- `PUT /api/rooms/:room/users/:username` — actualiza datos de un usuario.
- `DELETE /api/rooms/` — elimina todas las salas (uso de testing).

## Swagger / Documentación

La carpeta `swagger/` contiene un servidor de documentación de API con Swagger UI.

- Ejecuta `node swagger/app.js` para iniciar la docs en `http://localhost:3000`.
- El código usa `swagger-ui-express` y la definición de Swagger en `swagger/public/swagger_output.json`.

## Cómo correr el proyecto

1. Instalar dependencias en cada carpeta:

```bash
cd client && npm install
cd ../server && npm install
cd ../swagger && npm install
```

2. Correr el servidor:

```bash
cd server
npm start
```

3. Correr el cliente:

```bash
cd client
npm run dev
```

4. (Opcional) Correr la documentación Swagger:

```bash
cd swagger
node app.js
```

## Árbol de archivos actualizado

```
project-root/
├─ client/
│  ├─ public/
│  ├─ src/
│  │  ├─ components/
│  │  │  └─ LobbyManager.tsx
│  │  ├─ context/
│  │  │  └─ RoomContext.tsx
│  │  ├─ hooks/
│  │  │  └─ useSocket.ts
│  │  └─ main.tsx
│  └─ package.json
├─ server/
│  ├─ controllers/
│  │  ├─ roomHandlers.js
│  │  └─ roomsController.js
│  ├─ server.js
│  └─ package.json
├─ swagger/
│  ├─ app.js
│  ├─ swagger.js
│  ├─ public/
│  │  └─ swagger_output.json
│  └─ package.json
└─ README.md

```
