// professional-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { ProfessionalService } from '../../services/professional.services'; // Import the service

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

@Component({
  selector: 'app-professional-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class ProfessionalDashboardComponent implements OnInit {
  professionalName: string = '';
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  statusFilter: string = 'all';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private appointmentService: AppointmentService,
    private professionalService: ProfessionalService
  ) {}

  ngOnInit() {
    this.loadProfessionalInfo();
    this.loadAppointments();
  }
  loadProfessionalInfo() {

    this.professionalService.getProfessionalInfo().subscribe({
      next: (data) => {
        this.professionalName = data.name; // Set the professional's name
      },
      error: (error) => {
        console.error('Error loading professional info:', error);
        this.professionalName = 'Unknown'; // Default value in case of error
      }
    });
  }

  loadAppointments() {
    this.isLoading = true;
    this.errorMessage = '';

    this.appointmentService.getAppointments().subscribe({
      next: (data: Appointment[]) => {
        this.appointments = data;
        this.filterAppointments();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load appointments', err);
        this.errorMessage = 'Failed to load appointments';
        this.isLoading = false;
        this.filteredAppointments = [];
      }
    });
  }

  filterAppointments() {
    if (this.statusFilter === 'all') {
      this.filteredAppointments = this.appointments;
    } else {
      this.filteredAppointments = this.appointments.filter(app => app.status === this.statusFilter);
    }
  }

  updateAppointmentStatus(appointment: Appointment) {
    this.appointmentService.updateStatus(appointment.id, appointment.status).subscribe({
      next: () => {
        console.log('Status updated');
      },
      error: (err) => {
        console.error('Failed to update status', err);
      }
    });
  }

  getTodayAppointments(): number {
    const today = new Date().toDateString();
    return this.appointments.filter(app => new Date(app.date).toDateString() === today).length;
  }

  getUpcomingAppointments(): number {
    const now = new Date();
    return this.appointments.filter(app => new Date(app.date) > now).length;
  }

  getTotalPatients(): number {
    const uniqueEmails = new Set(this.appointments.map(app => app.patientEmail));
    return uniqueEmails.size;
  }
}
