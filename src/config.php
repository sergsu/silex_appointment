<?php

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