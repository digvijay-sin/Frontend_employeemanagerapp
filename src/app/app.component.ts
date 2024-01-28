import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
//  Direct DOM manipulation can sometimes interfere with Angular's change detection and lifecycle hooks.
//  Using Renderer2 ensures that the DOM manipulations are done in a way that aligns with Angular's lifecycle.
import { Renderer2, ElementRef, ViewChild   } from '@angular/core'
import { ModalComponent } from "./modal/modal.component";
import { NgModel } from '@angular/forms';
@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [CommonModule, ModalComponent]
})
export class AppComponent implements OnInit {
  
  public constructor(private employeeService: EmployeeService, private renderer: Renderer2, private modalComponent : ModalComponent) { }

  @ViewChild('mainContainer')
  mainContainer!: ElementRef;

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
  // public onOpenModal(employee: Employee | null, mode : String) : void{
    
  //   const button = this.renderer.createElement('button');
  //   this.renderer.setAttribute(button, 'type', 'button');
  //   this.renderer.setStyle(button, 'display', 'none');
  //   this.renderer.setAttribute(button, 'data-toggle', 'modal');
  
  //   if (mode === 'add') {
  //     this.renderer.setAttribute(button, 'data-target', '#addEmployeeModal');
  //   }    
  //   if (mode === 'edit') {
  //     this.renderer.setAttribute(button, 'data-target', '#updateEmployeeModal');
  //   }
  //   if (mode === 'delete') {
  //     this.renderer.setAttribute(button, 'data-target', '#deleteEmployeeModal');
  //   }
  //   this.renderer.appendChild(this.mainContainer.nativeElement, button);

  //   setTimeout(() => {
  //     button.click();
  //   }, 100);
  // }

  onOpenModal(){
    this.modalComponent.openModal();
  }
}
