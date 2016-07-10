"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var schedule_1 = require("../services/schedule");
var model_1 = require("../services/model");
var ScheduleComponent = (function () {
    function ScheduleComponent(_api) {
        this._api = _api;
        // Doctors list.
        this.doctors = [];
        this.availableSlots = [];
        // Days list.
        this.days = [];
        // Week days names helper.
        this.weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        // The time table is loading
        this.timeTableIsLoading = false;
        // All time slots.
        this.slots = [];
        // Disable the appointment form.
        this.disableForm = false;
        // Add existing doctor.
        for (var doctorIndex in Schedule.doctors) {
            var doctor = new model_1.Doctor();
            doctor.id = Schedule.doctors[doctorIndex].id;
            doctor.name = Schedule.doctors[doctorIndex].name;
            this.doctors.push(doctor);
        }
        // Preload selected doctor.
        this.selectedDoctor = new model_1.Doctor;
        if (window.location.hash.substr(0, 8) == '#doctor-') {
            for (var doctorIndex in this.doctors) {
                if (window.location.hash.substr(8) == this.doctors[doctorIndex].id) {
                    this.selectDoctor(this.doctors[doctorIndex]);
                }
            }
        }
        // Appointment form.
        this.appointment = new model_1.Appointment;
    }
    ScheduleComponent.prototype.selectDoctor = function (doctor) {
        var _this = this;
        this.selectedDoctor = doctor;
        // We're reloading the time table
        this.timeTableIsLoading = true;
        // Fetch available slots and rebuild the table.
        var currentDate = new Date((new Date).toISOString()), firstDay = currentDate.getDate() - currentDate.getDay(), lastDay = firstDay + 6;
        this._api.getAppointments(this.selectedDoctor, (new Date(currentDate.setUTCDate(firstDay))).setUTCHours(0, 0, 0, 0) / 1000, (new Date(currentDate.setUTCDate(lastDay))).setUTCHours(23, 59, 59, 0) / 1000).then(function (res) {
            _this.availableSlots = res;
            _this.reloadTimeSlotsAvailability();
            _this.timeTableIsLoading = false;
        });
    };
    ScheduleComponent.prototype.reloadTimeSlotsAvailability = function () {
        // Preload days.
        var currentDate = new Date, firstDay = currentDate.getDate() - currentDate.getDay(), lastDay = firstDay + 6;
        this.days = [];
        for (var day = firstDay; day <= lastDay; day++) {
            this.days.push(new Date(currentDate.setDate(day)));
        }
        // Time slots.
        this.fillTimeSlots(currentDate, firstDay, lastDay);
    };
    ScheduleComponent.prototype.fillTimeSlots = function (currentDate, firstDay, lastDay) {
        var startTime = Schedule.doctorWorkdayTimeStart, endTime = Schedule.doctorWorkdayTimeEnd, currentUTCDate = new Date(currentDate.toUTCString());
        // 2-dimensional array - this.slots[time_of_the_day][day].
        this.slots = [];
        for (var currentMinutes = startTime * 60; currentMinutes < endTime * 60; currentMinutes += Schedule.slotSize) {
            var days = [], minutes = currentMinutes % 60;
            for (var day = firstDay; day <= lastDay; day++) {
                var currentDateDay = new Date((new Date(currentDate.setDate(day))).setHours(0, currentMinutes, 0)), currentUTCDateDay = new Date((new Date(currentUTCDate.setUTCDate(day))).setUTCHours(0, currentMinutes, 0)), dateString = currentUTCDateDay.toISOString().slice(0, 19).replace('T', ' ');
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
                });
            }
            this.slots.push(days);
        }
    };
    ;
    // Open the appointment creation dialog.
    ScheduleComponent.prototype.openDialog = function (day) {
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
    };
    // Process appointment creation.
    ScheduleComponent.prototype.createAppointment = function (appointment) {
        var _this = this;
        this.disableForm = true;
        this.formError = '';
        this._api.createAppointment(appointment).then(function (res) {
            _this.disableForm = false;
            // An error occurred.
            if (typeof res.error != 'undefined') {
                _this.formError = res.error;
            }
            else {
                $('#appointment-dialog').modal('hide');
                _this.selectDoctor(_this.selectedDoctor);
            }
        }, function (error) {
            _this.disableForm = false;
            _this.formError = 'Internal error occured!';
        });
    };
    ScheduleComponent = __decorate([
        core_1.Component({
            selector: 'schedule',
            templateUrl: '/ng2/app/components/schedule.html'
        }), 
        __metadata('design:paramtypes', [schedule_1.ScheduleApi])
    ], ScheduleComponent);
    return ScheduleComponent;
}());
exports.ScheduleComponent = ScheduleComponent;
//# sourceMappingURL=schedule.js.map