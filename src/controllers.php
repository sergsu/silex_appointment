<?php

use Symfony\Component\HttpFoundation\JsonResponse;

$app->get(
  '/',
  function () use ($app) {
      $doctors = $app['dbs']['mysql_read']->fetchAll('SELECT * FROM doctors;');

      return $app['twig']->render(
        'index.twig',
        array(
            'doctors' => $doctors,
        )
      );
  }
);
$app->get(
  '/doctors',
  function () use ($app) {
      $doctors = $app['dbs']['mysql_read']->fetchAll('SELECT * FROM doctors;');

      return new JsonResponse($doctors);
  }
);
