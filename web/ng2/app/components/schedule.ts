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
    availableSlots:string[] = [];
    // Days list.
    days:Date[] = [];
    // Week days names helper.
    weekDays:string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // Currently selected doctor.
    selectedDoctor:Doctor;
    // The time table is loading
    timeTableIsLoading:boolean = false;
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
                    this.selectDoctor(this.doctors[doctorIndex]);
                }
            }
        }

        // Appointment form.
        this.appointment = new Appointment;
    }

    public selectDoctor(doctor) {
        this.selectedDoctor = doctor;

        // We're reloading the time table
        this.timeTableIsLoading = true;

        // Fetch available slots and rebuild the table.
        var currentDate = new Date((new Date).toISOString()),
            firstDay = currentDate.getDate() - currentDate.getDay(),
            lastDay = firstDay + 6;
        this._api.getAppointments(
            this.selectedDoctor,
            (new Date(currentDate.setUTCDate(firstDay))).setUTCHours(0, 0, 0, 0) / 1000,
            (new Date(currentDate.setUTCDate(lastDay))).setUTCHours(23, 59, 59, 0) / 1000
        ).then((res) => {
            this.availableSlots = res;
            this.reloadTimeSlotsAvailability();
            this.timeTableIsLoading = false;
        });
    }

    public reloadTimeSlotsAvailability() {
        // Preload days.
        var currentDate = new Date,
            firstDay = currentDate.getDate() - currentDate.getDay(),
            lastDay = firstDay + 6;
        this.days = [];
        for (var day = firstDay; day <= lastDay; day++) {
            this.days.push(new Date(currentDate.setDate(day)));
        }

        // Time slots.
        this.fillTimeSlots(currentDate, firstDay, lastDay);
    }

    private fillTimeSlots(currentDate, firstDay, lastDay) {
        var startTime = Schedule.doctorWorkdayTimeStart,
            endTime = Schedule.doctorWorkdayTimeEnd,
            currentUTCDate = new Date(currentDate.toUTCString());
        // 2-dimensional array - this.slots[time_of_the_day][day].
        this.slots = [];
        for (var currentMinutes = startTime * 60; currentMinutes < endTime * 60; currentMinutes += Schedule.slotSize) {
            var days = [],
                minutes = currentMinutes % 60;
            for (var day = firstDay; day <= lastDay; day++) {
                var currentDateDay = new Date((new Date(currentDate.setDate(day))).setHours(0, currentMinutes, 0)),
                    currentUTCDateDay = new Date((new Date(currentUTCDate.setUTCDate(day))).setUTCHours(0, currentMinutes, 0)),
                    dateString = currentUTCDateDay.toISOString().slice(0, 19).replace('T', ' ');
                days.push({
                    // Data format for the time slot information.
                    'time': {
                        'minutes': currentMinutes,
                        'formatted': Math.floor(currentMinutes / 60) + ':' + (minutes < 10 ? '0' + minutes : minutes)
                    },
                    'day': day,
                    'date': currentUTCDateDay,
                    'localDate': currentDateDay,
                    'active': this.availableSlots.indexOf(dateString) != -1
                })
            }
            this.slots.push(days);
        }
    };

    // Open the appointment creation dialog.
    public openDialog(day) {
        // The slot may be already inactive.
        if (!day.active) {
            return;
        }

        // Remember selection.
        this.selectedSlot = day;
        this.appointment.doctor = this.selectedDoctor;
        this.appointment.start = this.selectedSlot.date;
        this.appointment.startLocalTime = this.selectedSlot.localDate;
        this.appointment.startLocalString = this.selectedSlot.date.toISOString().slice(0, 19);

        // Clean form error string.
        this.formError = '';

        // Show the dialog.
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
                this.selectDoctor(this.selectedDoctor);
            }
        }, (error) => {
            this.disableForm = false;
            this.formError = 'Internal error occured!';
        });
    }
}