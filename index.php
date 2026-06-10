<?php

declare(strict_types=1);

require_once __DIR__ . '/app/bootstrap.php';

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
if (PHP_SAPI === 'cli-server' && is_file(__DIR__ . $uri)) {
    return false;
}

$basePath = nexus_base_path();
if ($basePath !== '' && $basePath !== '/' && str_starts_with($uri, $basePath)) {
    $uri = substr($uri, strlen($basePath)) ?: '/';
}
$path = rtrim($uri, '/') ?: '/';

if (str_starts_with($path, '/jogador')) {
    require nexus_path('router', 'routes.php');
    exit;
}

if ($path === '/sistema/pastas') {
    $folders = [];
    foreach (NEXUS_PATHS as $name => $folderPath) {
        $folders[$name] = [
            'caminho' => $folderPath,
            'existe' => is_dir($folderPath),
        ];
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => true,
        'pastas' => $folders,
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($path === '/sistema/fluxo') {
    $scripts = [
        'core/globals.js',
        'core/api.js',
        'core/storage.js',
        'game/ui.js',
        'game/art.js',
        'game/dialog.js',
        'game/scenes.js',
        'game/endings.js',
        'game/inventory.js',
        'game/minigames.js',
        'game/init.js',
    ];
    $scriptStatus = [];
    foreach ($scripts as $script) {
        $scriptStatus[$script] = is_file(nexus_path('js', $script));
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => true,
        'fluxo' => [
            'entrada'    => 'index.php',
            'rotas'      => 'app/router/routes.php',
            'middleware' => class_exists(\Nexus\Middleware\Middleware::class),
            'controller' => class_exists(\Nexus\Controller\JogadorController::class),
            'service'    => class_exists(\Nexus\Service\JogadorService::class),
            'migration'  => interface_exists(\Nexus\Repository\IJogadorRepository::class)
                && class_exists(\Nexus\Repository\JogadorRepository::class),
            'database'   => class_exists(\Nexus\Database\Database::class),
            'model'      => class_exists(\Nexus\Model\Jogador::class),
            'view'       => is_file(nexus_path('view', 'game.php')),
            'css'        => is_file(nexus_path('css', 'game.css')),
            'js'         => is_file(nexus_path('js', 'game.js')),
            'js_modulos' => $scriptStatus,
            'sql'        => is_file(nexus_path('database', 'banco.sql')),
            'config'     => is_file(nexus_path('config', 'config.ini')),
        ],
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

require nexus_path('view', 'game.php');
