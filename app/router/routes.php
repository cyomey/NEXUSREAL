<?php

declare(strict_types=1);

/**
 * Roteador da API.
 * Monta PDO → Repository → Service → Controller e despacha as rotas JSON.
 */

require_once __DIR__ . '/../bootstrap.php';

use Nexus\Database\Database;
use Nexus\Repository\JogadorRepository;
use Nexus\Service\JogadorService;
use Nexus\Controller\JogadorController;
use Nexus\Middleware\Middleware;

// ── Headers globais ─────────────────────────────────────────────
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Responde OPTIONS (preflight CORS) imediatamente
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Montagem das dependências (DI Container manual) ─────────────
try {
    $pdo        = Database::getInstance();              // Passo 1
    $repository = new JogadorRepository($pdo);          // Passo 2
    $service    = new JogadorService($repository);      // Passo 3
    $controller = new JogadorController($service);      // Passo 4
} catch (\Throwable $e) {
    error_log('[NEXUS BOOT API] ' . $e->getMessage());
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'erro' => 'Falha ao iniciar as camadas da API.',
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// ── Roteamento simples ──────────────────────────────────────────
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$basePath = nexus_base_path();
if ($basePath !== '' && $basePath !== '/' && str_starts_with($uri, $basePath)) {
    $uri = substr($uri, strlen($basePath)) ?: '/';
}
$uri = rtrim($uri, '/');
$method = $_SERVER['REQUEST_METHOD'];

match (true) {

    // POST /jogador/iniciar — cria ou retoma sessão
    ($uri === '/jogador/iniciar' && $method === 'POST') => (function () use ($controller): void {
        Middleware::handleIniciar();   // Passo 5: sanitiza XSS, valida campos
        $controller->iniciar();
    })(),

    // POST /jogador/progresso — autosave do jogo
    ($uri === '/jogador/progresso' && $method === 'POST') => (function () use ($controller): void {
        Middleware::handleJson();
        $controller->salvarProgresso();
    })(),

    // POST /jogador/final — desbloqueia final ou morte no mural
    ($uri === '/jogador/final' && $method === 'POST') => (function () use ($controller): void {
        Middleware::handleJson();
        $controller->desbloquearFinal();
    })(),

    // GET /jogador/mural?id=X — retorna mural do jogador
    ($uri === '/jogador/mural' && $method === 'GET') => (function () use ($controller): void {
        Middleware::handleGet();
        $controller->getMural();
    })(),

    // GET /jogador?id=X — retorna dados completos do jogador
    ($uri === '/jogador' && $method === 'GET') => (function () use ($controller): void {
        Middleware::handleGet();
        $controller->buscar();
    })(),

    // DELETE /jogador?id=X — reseta jogador
    ($uri === '/jogador' && $method === 'DELETE') => (function () use ($controller): void {
        Middleware::handleGet();
        $controller->deletar();
    })(),

    // Rota raiz — healthcheck
    ($uri === '' || $uri === '/') => (function (): void {
        header('Content-Type: application/json');
        echo json_encode([
            'status'  => 'online',
            'sistema' => 'NEXUS ENTERPRISE — Backend API',
            'versao'  => '2.0',
            'rotas'   => [
                'POST /jogador/iniciar'   => 'Criar ou retomar sessão',
                'POST /jogador/progresso' => 'Autosave do progresso',
                'POST /jogador/final'     => 'Desbloquear final/morte',
                'GET  /jogador/mural'     => 'Buscar mural (?id=X)',
                'GET  /jogador'           => 'Buscar jogador (?id=X)',
                'DELETE /jogador'         => 'Resetar jogador (?id=X)',
            ],
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    })(),

    // 404
    default => (function (): void {
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'erro' => 'Rota não encontrada.']);
    })(),
};
