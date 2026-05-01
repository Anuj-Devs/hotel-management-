import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stat-card',
  imports: [MatIconModule, CommonModule],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
})
export class StatCard implements OnInit {
  @Input() tablist: any
  @Output() hoverChange = new EventEmitter<number | null>();
  ngOnInit(): void {
    console.log("TEST", this.tablist)
  }

  onHover(val: number | null) {
    this.hoverChange.emit(val);
  }

}
