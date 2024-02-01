import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../modal/employee';
import { EmployeeService } from '../services/employee.service';
import { HttpErrorResponse } from '@angular/common/http';
//  Direct DOM manipulation can sometimes interfere with Angular's change detection and lifecycle hooks.
//  Using Renderer2 ensures that the DOM manipulations are done in a way that aligns with Angular's lifecycle.
import { Renderer2, ElementRef, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddEmployeeComponent } from './add-employee/add-employee.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    AddEmployeeComponent,
  ],
})
export class AppComponent implements OnInit {
  public constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private renderer: Renderer2
  ) {}

  @ViewChild('mainContainer') mainContainer!: ElementRef;

  ngOnInit(): void {
    this.getEmployees();
  }

  public employees!: Employee[];
  public editEmployee!: Employee | null;
  public deleteEmployee!: Employee | null;

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (response: Employee[]) => {
        this.employees = response;
        console.log(response);
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      },
    });
  }

  public onAddEmployee(addEmployeeForm: NgForm): void {
    document.getElementById('addEmployee')?.click();
    this.employeeService.addEmployee(addEmployeeForm.value).subscribe({
      next: (response: Employee) => {
        console.log(response);
        this.getEmployees();
        addEmployeeForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      },
    });
  }

  public onUpdateEmployee(employee: Employee): void {
    document.getElementById('editEmployee')?.click();
    this.employeeService.updateEmployee(employee).subscribe({
      next: (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  public onDeleteEmployee(employeeId?: number): void {
    document.getElementById('deleteEmployee')?.click();
    this.employeeService.deleteEmployeeById(employeeId).subscribe({
      next: (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  // creating button programmatically
  public onOpenModal(employee: Employee | null, mode: String): void {
    const button = this.renderer.createElement('button');
    this.renderer.setAttribute(button, 'type', 'button');
    this.renderer.setStyle(button, 'display', 'none');
    this.renderer.setAttribute(button, 'data-bs-toggle', 'modal');

    if (mode === 'add') {
      this.renderer.setAttribute(button, 'data-bs-target', '#addEmployeeModal');
    }
    if (mode === 'edit') {
      this.editEmployee = employee;
      this.renderer.setAttribute(
        button,
        'data-bs-target',
        '#updateEmployeeModal'
      );
    }
    if (mode === 'delete') {
      this.deleteEmployee = employee;
      this.renderer.setAttribute(
        button,
        'data-bs-target',
        '#deleteEmployeeModal'
      );
    }
    this.renderer.appendChild(this.mainContainer.nativeElement, button);
    setTimeout(() => {
      button.click();
    }, 10);
  }

  public searchEmployee(key: string): void {
    console.log(key);
    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (
        employee?.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        employee?.email.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        employee?.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        employee?.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1
      ) {
        results.push(employee);
      }
    }
    this.employees = results;
    if (results.length === 0 || !key) {
      this.getEmployees();
    }
  }

  // openDialog(type: 'add' | 'edit') {
  //   let dialogRef = this.dialog.open(DevDialog, {
  //     height: '400px',
  //     width: '600px',
  //     data: { type: type}
  //   });
  // }
}

// @Component({
//   selector: 'app-dialog',
//   template: `<h1 mat-dialog-title>Hi {{data.type == 'add' ? 'ADD Dialog' : 'Edit Dialog'}}</h1>
//   <div mat-dialog-content>
//     <p>What's your favorite animal?</p>
//     <mat-form-field>
//       <mat-label>Favorite Animal</mat-label>
//       <input matInput [(ngModel)]="data.animal">
//     </mat-form-field>
//   </div>
//   <div mat-dialog-actions>
//     <button mat-button (click)="onNoClick()">No Thanks</button>
//     <button mat-button [mat-dialog-close]="data.animal" cdkFocusInitial>Ok</button>
//   </div>
//   `,
//   standalone: true,
//   imports: [CommonModule, MatFormFieldModule,
//     MatInputModule,
//     FormsModule,
//     MatButtonModule,
//     MatDialogTitle,
//     MatDialogContent,
//     MatDialogActions,
//     MatDialogClose,]
// })
// export class DevDialog {
//   constructor(
//     public dialogRef: MatDialogRef<DevDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: any) { }

//   closeDialog() {
//     this.dialogRef.close('Pizza!');
//   }

//   onNoClick() {
//   }
// }
