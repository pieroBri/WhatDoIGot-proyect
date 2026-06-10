/**
 * Utilidad para calcular el layout circular del tablero de juego
 * Maneja los calculos matematicos de posicionamiento
 */

/**
 * Configuracion para el layout circular
 */
export interface CircularLayoutConfig {
  containerSize: number; // Size in pixels (600)
  playerRadius: number; // Distance from center to player card center (200)
  startAngle: number; // Starting angle in radians (-Math.PI / 2 for top)
}

/**
 * Posicion calculada de una card de Player en el layout circular
 */
export interface PlayerPosition {
  x: number;
  y: number;
  angle: number;
}

/**
 * Configuracion por defecto
 */
export const DEFAULT_LAYOUT_CONFIG: CircularLayoutConfig = {
  containerSize: 600,
  playerRadius: 300,
  startAngle: -Math.PI / 2, // Start at top (12 o'clock)
};

/**
 * Calcula la posicion de un jugador en el layout circular
 * @param playerIndex - Index of the player (0-based)
 * @param totalPlayers - Total number of players
 * @param config - Layout configuration
 * @returns Position coordinates and angle
 */
export const calculatePlayerPosition = (
  playerIndex: number,
  totalPlayers: number,
  config: CircularLayoutConfig = DEFAULT_LAYOUT_CONFIG
): PlayerPosition => {
  if (totalPlayers <= 0) {
    return { x: 0, y: 0, angle: 0 };
  }

  const centerX = config.containerSize / 2;
  const centerY = config.containerSize / 2;

  // Angular step between players
  const angularStep = (2 * Math.PI) / totalPlayers;

  // Current angle for this player
  const currentAngle = playerIndex * angularStep + config.startAngle;

  // Parametric equations for circle
  const x = centerX + config.playerRadius * Math.cos(currentAngle);
  const y = centerY + config.playerRadius * Math.sin(currentAngle);

  return {
    x,
    y,
    angle: currentAngle,
  };
};

/**
 * Calculate positions for all players
 * @param totalPlayers - Total number of players
 * @param config - Layout configuration
 * @returns Array of positions for each player
 */
export const calculateAllPlayerPositions = (
  totalPlayers: number,
  config: CircularLayoutConfig = DEFAULT_LAYOUT_CONFIG
): PlayerPosition[] => {
  return Array.from({ length: totalPlayers }, (_, i) =>
    calculatePlayerPosition(i, totalPlayers, config)
  );
};
