import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { StatCard } from '../reusableComp/stat-card/stat-card';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TableCard } from '../reusableComp/table-card/table-card';
import { GetTableData } from '../../service/get-table-data';
import { TableStatus } from '../../model/tableCount ';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Snackbar } from '../../service/snackbar/snackbar';
@Component({
  selector: 'app-dashboard',
  imports: [StatCard, TableCard, NgClass, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  @ViewChild(TableCard) child!: TableCard;
  store = inject(Store);
  stateValue: any;
  tableValue: any = JSON.parse(localStorage.getItem('tableData') || '[]').map((t: any) => ({
    ...t,
    date: t.date ? new Date(t.date) : new Date()
  }))
  .sort((a: any, b: any) => b.date.getTime() - a.date.getTime());
  tableColor: TableStatus[] = [];
  loading = signal(false);
  hoveredStatus = signal<number | null>(null);

  constructor(private serviceData: GetTableData, private snackbar: Snackbar) {
    this.fetchTableData();
    this.tableColor = this.serviceData.tableStatusArray;
    this.stateValue = this.serviceData.tableCountSignal;
    if (this.tableValue.length === 0) {
    }
  }

  ngOnInit() {
    setTimeout(() => {
        console.log('TEST23')
    }, 200);
  }

  fetchTableData() {
    this.loading.set(true);
    this.serviceData.getTableDataFromJSON().subscribe(
      (res: any) => {
        if (res) {
          this.tableValue = res
          .map((t: any) => ({
            ...t,
            date: t.date ? new Date(t.date) : new Date()
          }))
          .sort((a: any, b: any) => b.date.getTime() - a.date.getTime());
          localStorage.setItem('tableData', JSON.stringify(res));
          this.serviceData.updateTableCount();
          this.loading.set(false);
        }
      },
      (error) => {
        console.error('Failed to fetch data', error);
        this.loading.set(false);
      },
    );
  }

  refreshData() {
    this.loading.set(true);
    setTimeout(() => {
      this.stateValue = this.serviceData.tableCountSignal;
      this.tableValue = JSON.parse(localStorage.getItem('tableData') || '[]')
        .map((t: any) => ({
          ...t,
          date: t.date ? new Date(t.date) : new Date()
        }))
        .sort((a: any, b: any) => b.date.getTime() - a.date.getTime());
      this.loading.set(false);
    }, 1000);
  }

  onAddButtonClick() {
    this.child.addNewFound();
  }

  getTableMessage(updatedTable: any, existing: any): string {
    const table = updatedTable.tableNumber || 'Table';

    if (updatedTable.isDeleted) {
      return `${table} number has been deleted`;
    }

    if (!existing) {
      return `New table ${table} has been added`;
    }

    if (existing.status === 3 && updatedTable.status === 2) {
      return `${table} has been changed from Reserved to Occupied`;
    }

    if (existing.status === 2 && updatedTable.status === 1) {
      return `${table} has been marked as Available from Occupied`;
    }

    if (updatedTable.status === 1 && existing.status !== 1) {
      return `${table} has been activated`;
    }

    return `${table} has been updated`;
  }

  onEventCall(updatedTable: any) {
    let existing = this.tableValue.find((t: any) => t.id === updatedTable.id);
    const message = this.getTableMessage(updatedTable, existing);
    this.snackbar.show(message);

    if (updatedTable.isDeleted) {
      this.tableValue = this.tableValue.filter((table: any) => table.id !== updatedTable.id);
    } else {
      if (updatedTable.id == 0) {
        const newId = this.tableValue.length + 1;
        updatedTable.id = newId;
        this.tableValue.push(updatedTable);
      } else {
        const tableIndex = this.tableValue.findIndex((table: any) => table.id == updatedTable.id);
        if (tableIndex !== -1) {
          this.tableValue[tableIndex] = updatedTable;
        }
      }
    }
    this.tableValue.sort(
      (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    localStorage.setItem('tableData', JSON.stringify(this.tableValue));
    setTimeout(() => {
      this.serviceData.updateTableCount()
    }, 200);

  }
}
