import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public constructor(private employeeService: EmployeeService) { }
  ngOnInit(): void {
    this.getEmployees();
  }

  public employees!: Employee[];

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (response: Employee[]) => {
        this.employees = response;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }
}
