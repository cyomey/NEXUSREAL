// NEXUS game JavaScript manifest.
// The runtime is loaded by app/view/game.php in this order:
// core/globals.js     -> shared globals and constants
// core/api.js         -> PHP API integration
// core/storage.js     -> local/session storage and game state
// game/ui.js          -> HUD, notifications, save/load screens, menu
// game/art.js         -> portrait and scene canvas renderers
// game/dialog.js      -> dialogue typing and scene navigation
// game/scenes.js      -> narrative scene definitions
// game/endings.js     -> endings, deaths and mural
// game/inventory.js   -> inventory and item usage
// game/minigames.js   -> minigame controllers
// game/init.js        -> DOM events, timers and startup effects
