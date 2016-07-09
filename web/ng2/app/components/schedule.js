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
        this.doctors = [];
        this.days = [];
        this.weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.slots = [];
        this.appointments = this._api.appointments$;
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
                    this.selectedDoctor = this.doctors[doctorIndex];
                }
            }
        }
        // Preload days.
        var currentDate = new Date, firstDay = currentDate.getDate() - currentDate.getDay(), lastDay = firstDay + 6;
        for (var day = firstDay; day <= lastDay; day++) {
            this.days.push(new Date(currentDate.setDate(day)));
        }
        // Time slots.
        var startTime = 8, endTime = 20;
        for (var currentTime = startTime * 60; currentTime < endTime * 60; currentTime += Schedule.slotSize) {
            var days = [], minutes = currentTime % 60;
            for (var day = firstDay; day <= lastDay; day++) {
                days.push({
                    'time': {
                        'minutes': currentTime,
                        'formatted': Math.floor(currentTime / 60) + ':' + (minutes < 10 ? '0' + minutes : minutes)
                    },
                    'day': day,
                    'active': Math.random() > 0.8
                });
            }
            this.slots.push(days);
        }
    }
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