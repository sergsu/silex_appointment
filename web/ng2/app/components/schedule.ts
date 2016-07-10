import { Component } from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http'
import {ScheduleApi} from "../services/schedule";
import {Appointment,Doctor} from "../services/model";

@Component({
    selector: 'schedule',
    templateUrl: '/ng2/app/components/schedule.html'
})
export class ScheduleComponent {
    // Doctors list.
    doctors:Doctor[] = [];
    appointments:[];
    // Days list.
    days:Date[] = [];
    // Week days names helper.
    weekDays:string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // Currently selected doctor.
    selectedDoctor:Doctor;
    // All time slots.
    slots = [];
    // Chosen time slot.
    selectedSlot;
    // Current appointment data.
    appointment:Appointment;
    // Disable the appointment form.
    disableForm:boolean = false;
    formError:string;

    constructor(private _api: ScheduleApi)
    {
        this.appointments = this._api.appointments$;

        // Add existing doctor.
        for (var doctorIndex in Schedule.doctors) {
            var doctor = new Doctor();
            doctor.id = Schedule.doctors[doctorIndex].id;
            doctor.name = Schedule.doctors[doctorIndex].name;

            this.doctors.push(doctor)
        }

        // Preload selected doctor.
        this.selectedDoctor = new Doctor;
        if (window.location.hash.substr(0, 8) == '#doctor-') {
            for (var doctorIndex in this.doctors) {
                if (window.location.hash.substr(8) == this.doctors[doctorIndex].id) {
                    this.selectedDoctor = this.doctors[doctorIndex];
                }
            }
        }

        // Preload days.
        var currentDate = new Date,
            firstDay = currentDate.getDate() - currentDate.getDay(),
            lastDay = firstDay + 6;
        for (var day = firstDay; day <= lastDay; day++) {
            this.days.push(new Date(currentDate.setDate(day)));
        }

        // Time slots.
        var startTime = Schedule.doctorWorkdayTimeStart,
            endTime = Schedule.doctorWorkdayTimeEnd;
        // 2-dimensional array - this.slots[time_of_the_day][day].
        for (var currentMinutes = startTime * 60; currentMinutes < endTime * 60; currentMinutes += Schedule.slotSize) {
            var days = [],
                minutes = currentMinutes % 60;
            for (var day = firstDay; day <= lastDay; day++) {
                days.push({
                    // Data format for the time slot information.
                    'time': {
                        'minutes': currentMinutes,
                        'formatted': Math.floor(currentMinutes / 60) + ':' + (minutes < 10 ? '0' + minutes : minutes)
                    },
                    'day': day,
                    'date': new Date((new Date(currentDate.setDate(day))).setHours(0, currentMinutes, 0)),
                    'active':Math.random() > 0.8
                })
            }
            this.slots.push(days);
        }

        // Appointment form.
        this.appointment = new Appointment;
    }

    // Open the appointment creation dialog.
    public openDialog(day) {
        if (!day.active) {
            return;
        }

        this.selectedSlot = day;
        this.appointment.doctor = this.selectedDoctor;
        this.appointment.start = this.selectedSlot.date;

        $('#appointment-dialog').modal();
    }

    // Process appointment creation.
    public createAppointment(appointment) {
        this.disableForm = true;
        this.formError = '';
        this._api.createAppointment(appointment).then((res) => {
            this.disableForm = false;

            // An error occurred.
            if (typeof res.error != 'undefined') {
                this.formError = res.error;
            }
            else {
                $('#appointment-dialog').modal('hide');
            }
        });
    }
}