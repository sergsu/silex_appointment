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
var http_1 = require('@angular/http');
var core_1 = require('@angular/core');
require('rxjs/Rx');
var Observable_1 = require('rxjs/Observable');
require('rxjs/add/operator/share');
require('rxjs/add/operator/map');
var ScheduleApi = (function () {
    function ScheduleApi(_http) {
        var _this = this;
        this._http = _http;
        this.apiUrl = '/api/appointments';
        this.headers = new http_1.Headers;
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
        this.appointments$ = new Observable_1.Observable(function (observer) { return _this._appointmentsObserver = observer; }).share();
        this._dataStore = { appointments: [] };
    }
    ScheduleApi.prototype.getAppointments = function () {
        var _this = this;
        this._http.get(this.apiUrl).map(function (response) { return response.json(); }).subscribe(function (data) {
            _this._dataStore.appointments = data.appointments;
            _this._appointmentsObserver.next(_this._dataStore.appointments);
        }, function (error) { return console.log('Could not load appointments.'); });
    };
    ScheduleApi.prototype.getAppointment = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._http.get(_this.apiUrl + id)
                .map(function (res) { return res.json(); })
                .subscribe(function (res) {
                resolve(res);
            }, function (error) {
                reject(error);
            });
        });
    };
    ScheduleApi.prototype.createAppointment = function (appointment) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._http.post(_this.apiUrl, appointment, {
                headers: _this.headers
            })
                .map(function (res) { return res.json(); })
                .subscribe(function (res) {
                resolve(res);
            }, function (error) {
                reject(error);
            });
        });
    };
    ScheduleApi.prototype.updateAppointment = function (appointment, id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._http.patch(_this.apiUrl + id, appointment, {
                headers: _this.headers
            })
                .map(function (res) { return res.json(); })
                .subscribe(function (res) {
                resolve(res);
            }, function (error) {
                reject(error);
            });
        });
    };
    ScheduleApi.prototype.deleteAppointment = function (id) {
        var _this = this;
        this._http.delete(this.apiUrl + id, {
            headers: this.headers
        }).subscribe(function (response) {
            _this._dataStore.appointments.forEach(function (t, i) {
                if (t.id === id) {
                    _this._dataStore.appointments.splice(i, 1);
                }
            });
            _this._appointmentsObserver.next(_this._dataStore.appointments);
        }, function (error) { return console.log('Could not delete appointment.'); });
    };
    ScheduleApi = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ScheduleApi);
    return ScheduleApi;
}());
exports.ScheduleApi = ScheduleApi;
//# sourceMappingURL=schedule.js.map