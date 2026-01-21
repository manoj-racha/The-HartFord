import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/models';

@Component({
    selector: 'app-property-switch',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './property-switch.component.html',
    styleUrl: './property-switch.component.css'
})
export class PropertySwitchComponent implements OnInit {
    @Output() propertyChanged = new EventEmitter<Property>();

    properties: Property[] = [];
    selectedId: string = '';

    constructor(private propertyService: PropertyService) { }

    ngOnInit() {
        this.propertyService.getProperties().subscribe(data => {
            this.properties = data;
            if (this.properties.length > 0) {
                this.selectedId = this.properties[0].id; // Default to first
                this.onChange(); // Emit initial value
            }
        });
    }

    onChange() {
        const selected = this.properties.find(p => p.id === this.selectedId);
        if (selected) {
            console.log('PropertySwitch: Emitting Change:', selected);
            this.propertyChanged.emit(selected);
        }
    }
}
