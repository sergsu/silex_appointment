<?php

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

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
  '/api/slots/avaliable/{doctor}/{start}',
  function ($doctor, $start) use ($app) {
      $appointments = $app['dbs']['mysql_read']->fetchAll('SELECT * FROM appointments WHERE doctor_id = ? AND deleted_at IS NULL;', array((int)$doctor));

      return new JsonResponse($appointments);
  }
);

$app->post(
  '/api/appointments',
  function (Request $request) use ($app) {
      $data = json_decode($request->getContent(), true);
      $doctor_id = (int)$data['doctor']['id'];
      $time = (int)strtotime($data['start']);
      $phone = $data['phone'];

      // Ensure the time slot start time is correct.
      $time_of_the_day = $time % 86400; // Get amount of seconds in the day.
      // Time slot time should be round - no a second below or above is allowed.
      if (($time_of_the_day - $app['doctor_workday_time_start'] * 60 * 60) % $app['appointment_time_amount'] != 0) {
          return new JsonResponse(array('error' => 'Incorrect appointment slot time!'));
      }

      // Check if the slot is already taken.
      $taken = $app['dbs']['mysql_read']->fetchColumn('SELECT COUNT(*) FROM appointments WHERE doctor_id = ? AND time_start = ? AND deleted_at IS NULL;', array($doctor_id, $time));
      if ($taken) {
          return new JsonResponse(array('error' => 'The appointment slot is already taken!'));
      }

      // Everything's good - schedule it.
      $app['dbs']['mysql_write']->insert(
        'appointments',
        array(
          'doctor_id' => $doctor_id,
          'time_start' => $time,
          'phone' => $phone,
          'created_at' => time(),
          'updated_at' => time(),
          'version' => 1,
        )
      );

      return new JsonResponse(array('status' => 'ok'));
  }
);
