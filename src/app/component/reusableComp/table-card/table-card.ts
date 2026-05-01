import { Component, EventEmitter, HostListener, Input, OnInit, Output, signal } from '@angular/core';
import { NaPipe } from '../../../pipes/na-pipe';
import { CommonModule, DatePipe } from '@angular/common';
import { StatusPipe } from '../../../pipes/status/status-pipe';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ConfirmPopup } from '../confirm-popup/confirm-popup';
import { GetTableData } from '../../../service/get-table-data';
import { NoRecordFound } from '../no-record-found/no-record-found';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-table-card',
  imports: [
    NaPipe,
    CommonModule,
    StatusPipe,
    DatePipe,
    MatIconModule,
    FormsModule,
    ConfirmPopup,
    NoRecordFound,
    MatTooltipModule
  ],
  templateUrl: './table-card.html',
  styleUrl: './table-card.css',
})
export class TableCard {
  @Input() tableList: any = [];
  @Input() hoveredStatus: number | null = null;
  @Output() tableUpdated = new EventEmitter<any>();
  isLoading = signal(false);
  isDeletePopup = signal(false);
  isPopupVisible = signal(false);
  assignTableId = signal(0);
  selectedTableObj: any = {
    id: 0,
    tableNumber: '',
    status: 1,
    capacity: 0,
    isDeleted: false,
    date: new Date(),
    reserved: { name: '', count: 0, time: new Date() },
    occupied: { name: '', count: 0, time: new Date() },
  };
  errors: ErrModel = new ErrModel();

  bookFor: any = [
    {
      statusId: 1,
      title: 'Available',
      color: 'bg-(--success)',
      isSelected: false,
    },
    {
      statusId: 2,
      title: 'Occupied',
      color: 'bg-(--red)/90',
      isSelected: false,
    },
    {
      statusId: 3,
      title: 'Reserved',
      color: 'bg-(--warning)',
      isSelected: false,
    },
  ];

  assignPopupVisible = signal(false);

    assignForm = {
      name: '',
      count: 0,
    };

    assignErrors = {
      name: '',
      count: '',
      general: ''
    };

    openAssignPopup() {
      this.assignPopupVisible.set(true);
    }

    closeAssignPopup() {
      this.assignPopupVisible.set(false);
      this.assignForm = { name: '', count: 0 };
      this.assignErrors = { name: '', count: '', general: '' };
    }

  hoverButtonCSS =
    'rounded-full size-9 border text-white/60 hover:text-white/95 border-white/60 cursor-pointer hover:border-white/95 justify-center flex items-center transition duration-200';

  selectedTable(params: any) {
    this.isPopupVisible.set(true);
    let temp = JSON.parse(JSON.stringify(params));
    this.assignTableId.set(temp.id);
    this.selectedTableObj = {
      ...temp,
      reserved: temp.reserved || { name: '', count: 0, time: new Date() },
      occupied: temp.occupied || { name: '', count: 0, time: new Date() },
    };
    this.forLoop(params.status);
  }

  selectStatus(statusId: number): void {
    this.selectedTableObj.status = statusId;
    this.forLoop(statusId);
    if (statusId === 1) {
      this.selectedTableObj.occupied = null;
      this.selectedTableObj.reserved = null;
    } else if (statusId === 2) {
      this.selectedTableObj.occupied = {
        name: '',
        count: 0,
        time: new Date(),
      };
      this.selectedTableObj.reserved = null;
    } else if (statusId === 3) {
      this.selectedTableObj.reserved = {
        name: '',
        count: 0,
        time: new Date(),
      };
      this.selectedTableObj.occupied = null;
    }
  }

  forLoop(statusId: number) {
    for (let index = 0; index < this.bookFor.length; index++) {
      this.bookFor[index].isSelected = false;
      if (this.bookFor[index].statusId == statusId) {
        this.bookFor[index].isSelected = true;
      }
    }
  }

  async updateTable() {
    this.errors = new ErrModel();
    this.isLoading.set(true);
    let shouldStop = false;
    try {
      if (!this.selectedTableObj.tableNumber.trim()) {
        this.errors.nameErr = 'Table name is required';
        shouldStop = true;
      }
      if (
        this.selectedTableObj.capacity == 0 ||
        this.selectedTableObj.capacity == '' ||
        this.selectedTableObj.capacity == null
      ) {
        this.errors.totalCapErr = 'Table capacity must be greater than 0';
        shouldStop = true;
      } else if (this.selectedTableObj.capacity > 12) {
         this.errors.totalCapErr = 'Table capacity must be less than 10';
          shouldStop = true;
      }
      if (this.selectedTableObj.status == 3) {
        if (this.selectedTableObj.reserved.name === '') {
          this.errors.resNameErr = 'Reserved name is required';
          shouldStop = true;
        }
        if (
          this.selectedTableObj.reserved.count == 0 ||
          this.selectedTableObj.reserved.count == '' ||
          this.selectedTableObj.reserved.count == null
        ) {
          this.errors.resPersonErr = 'Number of guests must be greater than 0';
          shouldStop = true;
        } else if (this.selectedTableObj.reserved.count > this.selectedTableObj.capacity) {
          this.errors.resPersonErr = 'Number of guests cannot exceed table capacity';
          shouldStop = true;
        }
      }
      if (this.selectedTableObj.status == 2) {
        if (this.selectedTableObj.occupied.name === '') {
          this.errors.occNameErr = 'Occupied name is required';
          shouldStop = true;
        }
        if (
          this.selectedTableObj.occupied.count == 0 ||
          this.selectedTableObj.occupied.count == '' ||
          this.selectedTableObj.occupied.count == null
        ) {
          this.errors.occPersonErr = 'Number of guests must be greater than 0';
          shouldStop = true;
        } else if (this.selectedTableObj.occupied.count > this.selectedTableObj.capacity) {
          this.errors.occPersonErr = 'Number of guests cannot exceed table capacity';
          shouldStop = true;
        }
      }

      if (shouldStop) {
        this.isLoading.set(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      if (this.selectedTableObj.status == 2) {
        this.selectedTableObj.reserved = null;
      } else if (this.selectedTableObj.status == 3) {
        this.selectedTableObj.occupied = null;
        this.selectedTableObj.reserved.time = new Date();
      }
      this.selectedTableObj.date = new Date()
      this.tableUpdated.emit(this.selectedTableObj);
      this.resetToDefault();
      this.isPopupVisible.set(false);
    } catch (error) {
      console.log('ERRRR', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  resetToDefault() {
    this.selectedTableObj = {
      id: 0,
      tableNumber: '',
      status: 1,
      capacity: 0,
      isDeleted: false,
      date: new Date(),
      reserved: { name: '', count: 0, time: new Date() },
      occupied: { name: '', count: 0, time: new Date() },
    };
    this.assignTableId.set(0);
  }

  closePopup() {
    this.assignTableId.set(0);
    this.errors = new ErrModel();
    this.isPopupVisible.set(false);
    this.resetToDefault();
  }

  addNewFound() {
    this.forLoop(1);
    this.assignTableId.set(0);
    this.isPopupVisible.set(true);
  }

  deleteThisTable() {
    setTimeout(() => {
      this.selectedTableObj.isDeleted = true;
      this.tableUpdated.emit(this.selectedTableObj);
      this.resetToDefault();
      this.isPopupVisible.set(false);
    }, 500);
  }

  onEventCall(value: boolean) {
    if (value) {
      setTimeout(() => {
        this.isDeletePopup.set(false);
        this.selectedTableObj.isDeleted = true;
        this.tableUpdated.emit(this.selectedTableObj);
        this.resetToDefault();
        this.isPopupVisible.set(false);
      }, 500);
    } else {
      this.isDeletePopup.set(false);
    }
  }

  makeAvailable(item: any) {
    const updated = {
      ...item,
      status: 1,
      date: new Date(),
      occupied: null,
      reserved: null,
    };

    this.tableUpdated.emit(updated);
  }

  swapToOccupied(item: any) {
    if (!item.reserved) return;

    const updated = {
      ...item,
      status: 2,
      date: new Date(),
      occupied: {
        name: item.reserved.name,
        count: item.reserved.count,
        time: new Date(),
      },
      reserved: null,
    };

    this.tableUpdated.emit(updated);
  }

  assignTableToCustomer() {
    this.assignErrors = { name: '', count: '', general: '' };
    let shouldStop = false;

    if (!this.assignForm.name.trim()) {
      this.assignErrors.name = 'Customer name is required';
      shouldStop = true;
    }

    if (this.assignForm.count == 0 ||
        this.assignForm.count == null) {
      this.assignErrors.count = 'Guest count must be greater than 0';
      shouldStop = true;
    }
    if (shouldStop) {
        return;
      }

    const availableTables = this.tableList.filter(
      (t: any) => t.status === 1 && !t.isDeleted
    );

    if (availableTables.length === 0) {
      this.assignErrors.general = 'No tables available right now'
      return;
    }

    const suitableTables = availableTables
      .filter((t: any) => t.capacity >= this.assignForm.count)
      .sort((a: any, b: any) => a.capacity - b.capacity);

    if (suitableTables.length === 0) {
      this.assignErrors.general = 'No suitable table available for this guest count'
      return;
    }

    const selectedTable = suitableTables[0];

    const updated = {
      ...selectedTable,
      status: 2,
      date: new Date(),
      occupied: {
        name: this.assignForm.name,
        count: this.assignForm.count,
        time: new Date(),
      },
      reserved: null,
    };

    this.tableUpdated.emit(updated);

    this.closeAssignPopup();
  }

  createTableForGuest() {
  this.assignPopupVisible.set(false);

  this.resetToDefault();
  this.forLoop(2);

  this.selectedTableObj = {
    ...this.selectedTableObj,
    tableNumber: '',
    capacity: this.assignForm.count || 0,
    status: 2,
    date: new Date(),
    occupied: {
      name: this.assignForm.name,
      count: this.assignForm.count,
      time: new Date(),
    },
    reserved: null,
  };

  this.assignTableId.set(0);
  this.isPopupVisible.set(true);

  this.assignForm = { name: '', count: 0 };
  this.assignErrors = { name: '', count: '', general: '' };
}

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    // Ctrl + K --> Asign Table Opening
    if (event.ctrlKey && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.openAssignPopup();
    }
    // Ctrl + N --> Create Table Opening
    if (event.ctrlKey && event.key.toLowerCase() === 'm') {
      event.preventDefault();
      this.addNewFound();
    }

    // Esc --> Close Popup Opening
    if (event.key === 'Escape') {
      this.closeAssignPopup();
      this.closePopup();
    }
  }

}

class ErrModel {
  nameErr: string = '';
  totalCapErr: string = '';
  occNameErr: string = '';
  occPersonErr: string = '';
  resNameErr: string = '';
  resPersonErr: string = '';
}
