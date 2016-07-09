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
  '/api/appointments/{doctor}',
  function ($doctor) use ($app) {
      $appointments = $app['dbs']['mysql_read']->fetchAll('SELECT * FROM appointments WHERE doctor_id = ?;', array((int)$doctor));

      return new JsonResponse($appointments);
  }
);
