export class Appointment {
    doctor:Doctor;
    start:Date;
    startLocalTime:Date;
    startLocalString:string;
    phone:string;
}
export class Doctor {
    id:number;
    name:string;
}