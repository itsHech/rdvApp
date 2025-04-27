import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ProfessionalInfo {
  name: string;
  qualifications: string;
  specialization: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {
  private apiUrl = 'http://localhost:5001/professionals';

  constructor(private http: HttpClient) {}

  getProfessionalInfo(): Observable<ProfessionalInfo> {
    return this.http.get<ProfessionalInfo>(this.apiUrl);
  }
}
