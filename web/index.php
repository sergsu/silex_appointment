<?php

require_once __DIR__.'/../vendor/autoload.php';

$app = new Silex\Application();

// Enable debugging mode for local server.
if ($_SERVER['HTTP_HOST'] == '192.168.0.4:8008') {
    error_reporting(E_ALL);
    ini_set('display_errors', 'On');
    $app['debug'] = true;
}

require_once __DIR__.'/../src/config.php';
require_once __DIR__.'/../src/controllers.php';

$app->run();