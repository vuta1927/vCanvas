import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule,MatToolbarModule, MatInputModule,MatFormFieldModule, MatProgressSpinnerModule, MatCardModule, MatGridListModule} from '@angular/material';
@NgModule({
    imports:[MatButtonModule, MatToolbarModule, MatInputModule,MatFormFieldModule, MatProgressSpinnerModule, MatCardModule, MatGridListModule],
    exports:[MatButtonModule, MatToolbarModule, MatInputModule,MatFormFieldModule, MatProgressSpinnerModule, MatCardModule, MatGridListModule],
})

export class MaterialModule{}
