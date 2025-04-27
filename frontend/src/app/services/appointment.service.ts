import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Appointment {
  id: string;
  time: string;
  date: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface NewAppointment {
  professionalId: string;
  date: string;
  time: string;
  reason: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private baseUrl = 'http://localhost:5001/appointments';

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.baseUrl, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      })
    });
  }

  updateStatus(appointmentId: string, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${appointmentId}/status`, { status }, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      })
    });
  }

  getAppointmentById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      })
    });
  }

  rescheduleAppointment(id: string, newDate: string, newTime: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.baseUrl}/${id}/reschedule`, { date: newDate, time: newTime }, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      })
    });
  }

  createAppointment(appointment: NewAppointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.baseUrl}/create`, appointment, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      })
    });
  }
  
}