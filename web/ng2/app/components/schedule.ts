import { Component } from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http'
import {ScheduleApi} from "../services/schedule";
import {Appointment,Doctor} from "../services/model";

@Component({
    selector: 'schedule',
    templateUrl: '/ng2/app/components/schedule.html'
})
export class ScheduleComponent {
    doctors:Doctor[] = [];
    appointments:[];
    days:Date[] = [];
    weekDays:string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    selectedDoctor:Doctor;
    slots = [];

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
        var startTime = 8,
            endTime = 20;
        for (var currentTime = startTime * 60; currentTime < endTime * 60; currentTime += Schedule.slotSize) {
            var days = [],
                minutes = currentTime % 60;
            for (var day = firstDay; day <= lastDay; day++) {
                days.push({
                    'time': {
                        'minutes': currentTime,
                        'formatted': Math.floor(currentTime / 60) + ':' + (minutes < 10 ? '0' + minutes : minutes)
                    },
                    'day': day,
                    'active':Math.random() > 0.8
                })
            }
            this.slots.push(days);
        }
    }
}