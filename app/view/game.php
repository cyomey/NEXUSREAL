<?php

declare(strict_types=1);

$assetVersion = '1.0.0';
$apiBase = nexus_base_path();
$scripts = [
    'js/core/globals.js',
    'js/core/api.js',
    'js/core/storage.js',
    'js/game/ui.js',
    'js/game/art.js',
    'js/game/dialog.js',
    'js/game/scenes.js',
    'js/game/endings.js',
    'js/game/inventory.js',
    'js/game/minigames.js',
    'js/game/init.js',
];
?>
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>NEXUS - A Anomalia</title>
    <link rel="stylesheet" href="<?= htmlspecialchars(nexus_asset('css/game.css'), ENT_QUOTES, 'UTF-8') ?>?v=<?= rawurlencode($assetVersion) ?>">
  </head>
  <body>
<?php require nexus_path('view', 'game-body.php'); ?>
    <script>
      window.NEXUS_CONFIG = {
        apiBase: <?= json_encode($apiBase, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?>
      };
    </script>
<?php foreach ($scripts as $script): ?>
    <script src="<?= htmlspecialchars(nexus_asset($script), ENT_QUOTES, 'UTF-8') ?>?v=<?= rawurlencode($assetVersion) ?>"></script>
<?php endforeach; ?>
  </body>
</html>
