import {Http, Headers, Response} from '@angular/http'
import {Injectable} from '@angular/core'
import {Appointment,Doctor} from 'model'
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

@Injectable()
export class ScheduleApi {
    apiUrl:string = '/api/';
    headers:Headers = new Headers;

    constructor(private _http:Http) {
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
    }

    public getAppointments(doctor:Doctor, start, end) {
        return new Promise((resolve, reject) => {
            this._http.get(this.apiUrl + 'slots/available/' + doctor.id + '/' + start + '/' + end)
                .map(response => response.json())
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (error) => {
                        reject(error);
                    }
                );
        })
    }

    public createAppointment(appointment) {
        return new Promise((resolve, reject) => {
            this._http.post(this.apiUrl + 'appointments', appointment, {
                    headers: this.headers
                })
                .map((res:Response) => res.json())
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    (error) => {
                        reject(error);
                    }
                );
        })
    }
}