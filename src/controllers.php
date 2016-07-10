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
  '/api/slots/available/{doctor}/{start}/{end}',
  function ($doctor, $start, $end) use ($app) {
      // Load existing appointments.
      $appointments = $app['dbs']['mysql_read']->fetchAll(
        'SELECT time_start FROM appointments WHERE doctor_id = ? AND time_start BETWEEN ? AND ? AND deleted_at IS NULL;',
        array(
          (int)$doctor,
          date('Y-m-d H:i:s', $start),
          date('Y-m-d H:i:s', $end),
        )
      );
      if (!is_array($appointments)) {
          $appointments = array();
      }

      $appointments = array_map('reset', $appointments);

      // Build available time slots list.
      $start = $start - ($start % 86400);
      $end = $end - ($end % 86400) + 86400 - 1;
      $days = floor(($end - $start) / 86400);

      // @todo Rework it to use time intervals instead of plain list of slots to save bandwidth.
      $possible_slots = array();
      for ($day = 0; $day <= $days; $day++) {
          $current_day_time = $start + $day * 86400 + $app['doctor_workday_time_start'] * 60 * 60;
          $current_day_time_end = $start + $day * 86400 + $app['doctor_workday_time_end'] * 60 * 60;
          for ($time = $current_day_time; $time < $current_day_time_end; $time += $app['appointment_time_amount']) {
              $possible_slots[] = date('Y-m-d H:i:s', $time);
          }
      }

      return new JsonResponse(array_values(array_diff($possible_slots, $appointments)));
  }
);

$app->post(
  '/api/appointments',
  function (Request $request) use ($app) {
      $data = json_decode($request->getContent(), true);
      $doctor_id = (int)$data['doctor']['id'];
      $time = (int)strtotime($data['startLocalString']);
      $phone = $data['phone'];

      // Ensure the time slot start time is correct.
      $time_of_the_day = $time % 86400; // Get amount of seconds in the day.
      // Time slot time should be round - no a second below or above is allowed.
      if (($time_of_the_day - $app['doctor_workday_time_start'] * 60 * 60) % $app['appointment_time_amount'] != 0) {
          return new JsonResponse(array('error' => 'Incorrect appointment slot time!'));
      }

      // Check if the slot is already taken.
      $taken = $app['dbs']['mysql_read']->fetchColumn('SELECT COUNT(*) FROM appointments WHERE doctor_id = ? AND time_start = ? AND deleted_at IS NULL;', array($doctor_id, date('Y-m-d H:i:s', $time)));
      if ($taken) {
          return new JsonResponse(array('error' => 'The appointment slot is already taken!'));
      }

      // Everything's good - schedule it.
      $app['dbs']['mysql_write']->insert(
        'appointments',
        array(
          'doctor_id' => $doctor_id,
          'time_start' => date('Y-m-d H:i:s', $time),
          'phone' => $phone,
          'created_at' => gmdate('Y-m-d H:i:s'),
          'updated_at' => gmdate('Y-m-d H:i:s'),
          'version' => 0,
        )
      );

      return new JsonResponse(array('status' => 'ok'));
  }
);
$app->get('/login', function(Request $request) use ($app) {
    return $app['twig']->render('login.twig', array(
        'error'         => $app['security.last_error']($request),
        'last_username' => $app['session']->get('_security.last_username'),
    ));
});
