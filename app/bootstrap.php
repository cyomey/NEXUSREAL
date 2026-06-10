<?php

declare(strict_types=1);

const NEXUS_ROOT = __DIR__ . '/..';
const NEXUS_APP = __DIR__;

const NEXUS_PATHS = [
    'root'       => NEXUS_ROOT,
    'app'        => NEXUS_APP,
    'config'     => NEXUS_APP . '/config',
    'controller' => NEXUS_APP . '/controller',
    'database'   => NEXUS_APP . '/database',
    'middleware' => NEXUS_APP . '/middleware',
    'migration'  => NEXUS_APP . '/migration',
    'model'      => NEXUS_APP . '/model',
    'public'     => NEXUS_APP . '/public',
    'css'        => NEXUS_APP . '/public/css',
    'js'         => NEXUS_APP . '/public/js',
    'router'     => NEXUS_APP . '/router',
    'services'   => NEXUS_APP . '/services',
    'view'       => NEXUS_APP . '/view',
];

function nexus_path(string $folder, string $file = ''): string
{
    $base = NEXUS_PATHS[$folder] ?? NEXUS_APP . '/' . trim($folder, '/');
    return $file === '' ? $base : $base . '/' . ltrim($file, '/');
}

function nexus_base_path(): string
{
    $basePath = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/');
    return ($basePath === '/' || $basePath === '.') ? '' : $basePath;
}

function nexus_asset(string $file): string
{
    return nexus_base_path() . '/app/public/' . ltrim($file, '/');
}

$configPath = nexus_path('config', 'config.ini');
if (is_file($configPath)) {
    $config = parse_ini_file($configPath, true) ?: [];
    if (isset($config['app']['timezone'])) {
        date_default_timezone_set((string) $config['app']['timezone']);
    }
}

spl_autoload_register(static function (string $class): void {
    $prefix = 'Nexus\\';

    if (!str_starts_with($class, $prefix)) {
        return;
    }

    $relative = substr($class, strlen($prefix));
    $parts = explode('\\', $relative);
    $base = array_shift($parts);

    $map = [
        'Controller' => 'controller',
        'Database'   => 'router',
        'Exception'  => 'services',
        'Middleware' => 'middleware',
        'Model'      => 'model',
        'Repository' => 'migration',
        'Service'    => 'services',
    ];

    if (!isset($map[$base])) {
        return;
    }

    $file = nexus_path($map[$base], implode('/', $parts) . '.php');
    if (is_file($file)) {
        require_once $file;
        return;
    }

    foreach (glob(nexus_path($map[$base], '*.php')) ?: [] as $candidate) {
        require_once $candidate;
        if (class_exists($class, false) || interface_exists($class, false) || trait_exists($class, false)) {
            return;
        }
    }
});
