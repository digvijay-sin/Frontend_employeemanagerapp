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

  // creating button programmatically
  public onOpenModal(employee: Employee | null, mode : String) : void{
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    // dynamically opening the modal using their id's
    if(mode === 'add'){
      button.setAttribute('data-target', '#addEmployeeModal');
    }    
    if(mode === 'edit'){
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if(mode === 'delete'){
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container?.appendChild(button);
    button.click();
  }
}
