<?php

// Time slot size.
$app['appointment_time_amount'] = '15'; // Minutes.
$app['doctor_workday_time_start'] = 8; // A doctor works from...
$app['doctor_workday_time_end'] = 20; // to.

// Database.
$app->register(
  new Silex\Provider\DoctrineServiceProvider(),
  array(
    'dbs.options' => array(
      'mysql_read' => array(
        'driver' => 'pdo_mysql',
        'host' => 'localhost',
        'dbname' => 'silex_appointment',
        'user' => 'root',
        'password' => 'root',
      ),
      'mysql_write' => array(
        'driver' => 'pdo_mysql',
        'host' => 'localhost',
        'dbname' => 'silex_appointment',
        'user' => 'root',
        'password' => 'root',
      ),
    ),
  )
);

// Templates.
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/views',
    'twig.class_path'   => __DIR__.'/../vendor/twig/twig/lib',
    'twig.options'    => array(
        'cache' => '/tmp/twig_cache',
    ),
));
$app['crud.layout'] = 'base.twig';

// CRUD generator.
$dataFactory = new CRUDlex\CRUDMySQLDataFactory($app['db']);
$app->register(new CRUDlex\CRUDServiceProvider(), array(
    'crud.file' => __DIR__ . '/crud.yml',
    'crud.datafactory' => $dataFactory
));
$app->mount('/crud', new CRUDlex\CRUDControllerProvider());

// Users
$app['security.firewalls'] = array(
    'login' => array(
        'pattern' => '^/login$',
    ),
    'crud' => array(
        'pattern' => '^/crud/',
        'users' => array(
            // raw password is foo
            'admin' => array('ROLE_ADMIN', 'nhDr7OyKlXQju+Ge/WKGrPQ9lPBSUFfpK+B1xqx/+8zLZqRNX0+5G1zBQklXUFy86lCpkAofsExlXiorUcKSNQ=='),
        ),
        'form' => array('login_path' => '/login', 'check_path' => '/crud/login_check'),
        'logout' => array('logout_path' => '/crud/logout', 'invalidate_session' => true),
    ),
);
$app->register(new Silex\Provider\SecurityServiceProvider());
$app->register(new Silex\Provider\SessionServiceProvider());
