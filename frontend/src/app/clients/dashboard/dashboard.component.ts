import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { UserService } from '../../services/user.service';

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

interface Professional {
  id: string;
  name: string;
  speciality: string;
}

interface NewAppointment {
  professionalId: string;
  date: string;
  time: string;
  reason: string;
}

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  providers: [AppointmentService, UserService],  // Add providers here
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class ClientDashboardComponent implements OnInit {
  clientName = '';
  professionalName: string = '';
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  statusFilter: string = 'all';
  isLoading: boolean = false;
  errorMessage: string = '';
  
  showCreateModal = false;
  professionals: Professional[] = [];
  newAppointment: NewAppointment = {
    professionalId: '',
    date: '',
    time: '',
    reason: ''
  };

  constructor(
    private appointmentService: AppointmentService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadAppointments();
    this.loadProfessionals();
  }

  loadProfessionals() {
    this.userService.getProfessionals().subscribe({
      next: (data) => {
        this.professionals = data;
      },
      error: (err) => {
        console.error('Failed to load professionals', err);
      }
    });
  }

  openCreateAppointmentModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.newAppointment = {
      professionalId: '',
      date: '',
      time: '',
      reason: ''
    };
  }

  createAppointment() {
    this.appointmentService.createAppointment(this.newAppointment).subscribe({
      next: () => {
        this.loadAppointments();
        this.closeCreateModal();
      },
      error: (err) => {
        console.error('Failed to create appointment', err);
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
      error: (err: Error) => {  // Add type annotation here
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