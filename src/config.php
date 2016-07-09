<?php

// Database.
$app->register(
  new Silex\Provider\DoctrineServiceProvider(),
  array(
    'dbs.options' => array(
      'mysql_read' => array(
        'driver' => 'pdo_mysql',
        'host' => 'localhost',
        'dbname' => 'silex_booking',
        'user' => 'root',
        'password' => '',
      ),
      'mysql_write' => array(
        'driver' => 'pdo_mysql',
        'host' => 'localhost',
        'dbname' => 'silex_booking',
        'user' => 'root',
        'password' => '',
      ),
    ),
  )
);

// Templates.
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/views',
    'twig.class_path'   => __DIR__.'/../vendor/twig/twig/lib',
));
$app['crud.layout'] = 'base.twig';

// CRUD generator.
$dataFactory = new CRUDlex\CRUDMySQLDataFactory($app['db']);
$app->register(new CRUDlex\CRUDServiceProvider(), array(
    'crud.file' => __DIR__ . '/crud.yml',
    'crud.datafactory' => $dataFactory
));
$app->mount('/crud', new CRUDlex\CRUDControllerProvider());
