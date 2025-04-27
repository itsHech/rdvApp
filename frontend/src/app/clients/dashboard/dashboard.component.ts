import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>My Appointments</h1>
        <div class="user-info">
          <span>Welcome, {{clientName}}</span>
        </div>
      </header>

      <div class="appointments-section">
        <div class="upcoming-appointments">
          <h2>Upcoming Appointments</h2>
          <div class="appointment-card" *ngFor="let appointment of upcomingAppointments">
            <div class="appointment-date">
              <strong>{{appointment.date | date:'mediumDate'}}</strong>
              <span>{{appointment.time}}</span>
            </div>
            <div class="appointment-info">
              <p><strong>Professional:</strong> Dr. {{appointment.professionalName}}</p>
              <p><strong>Status:</strong> <span class="status-{{appointment.status}}">{{appointment.status}}</span></p>
              <p>{{appointment.description}}</p>
            </div>
            <div class="appointment-actions">
              <button class="btn-secondary" [routerLink]="['/appointments', appointment.id]">View Details</button>
              <button class="btn-danger" *ngIf="appointment.status !== 'cancelled'"
                      (click)="cancelAppointment(appointment.id)">Cancel</button>
            </div>
          </div>
        </div>

        <div class="appointment-history">
          <h2>Past Appointments</h2>
          <div class="appointment-card" *ngFor="let appointment of pastAppointments">
            <div class="appointment-date">
              <strong>{{appointment.date | date:'mediumDate'}}</strong>
              <span>{{appointment.time}}</span>
            </div>
            <div class="appointment-info">
              <p><strong>Professional:</strong> Dr. {{appointment.professionalName}}</p>
              <p><strong>Status:</strong> <span class="status-{{appointment.status}}">{{appointment.status}}</span></p>
              <p>{{appointment.description}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {
  clientName = '';
  upcomingAppointments: any[] = [];
  pastAppointments: any[] = [];

  ngOnInit() {
    // TODO: Load client data and appointments
  }

  cancelAppointment(appointmentId: string) {
    // TODO: Implement appointment cancellation
  }
}
