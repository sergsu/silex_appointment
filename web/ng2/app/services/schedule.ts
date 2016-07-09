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
    apiUrl:string = '/api/appointments';
    headers:Headers = new Headers;
    appointments$:Observable<Appointment[]>;
    private _appointmentsObserver:Observer<Appointment[]>;
    private _dataStore:{
        appointments: Appointment[]
    };

    constructor(private _http:Http) {
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');

        this.appointments$ = new Observable(observer => this._appointmentsObserver = observer).share();
        this._dataStore = {appointments: []};
    }

    public getAppointments() {
        this._http.get(this.apiUrl).map(response => response.json()).subscribe(data => {
            this._dataStore.appointments = data.appointments;
            this._appointmentsObserver.next(this._dataStore.appointments);
        }, error => console.log('Could not load appointments.'));
    }

    public getAppointment(id) {
        return new Promise((resolve, reject) => {
            this._http.get(this.apiUrl + id)
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

    public createAppointment(appointment) {
        return new Promise((resolve, reject) => {
            this._http.post(this.apiUrl, appointment, {
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

    public updateAppointment(appointment, id) {
        return new Promise((resolve, reject) => {
            this._http.patch(this.apiUrl + id, appointment, {
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

    public deleteAppointment(id) {
        this._http.delete(this.apiUrl + id, {
            headers: this.headers
        }).subscribe(response => {
            this._dataStore.appointments.forEach((t, i) => {
                if (t.id === id) {
                    this._dataStore.appointments.splice(i, 1);
                }
            });
            this._appointmentsObserver.next(this._dataStore.appointments);
        }, error => console.log('Could not delete appointment.'));
    }
}