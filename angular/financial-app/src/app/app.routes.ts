import { Routes } from '@angular/router';
import { AddInsurance } from './add-insurance/add-insurance';
import { ListInsurance } from './list-insurance/list-insurance';
import { UpdateInsurance } from './update-insurance/update-insurance';
import { DeleteInsurance } from './delete-insurance/delete-insurance';

export const routes: Routes = [
    { path: '', component: ListInsurance },
    { path: 'list', component: ListInsurance },
    { path: 'add', component: AddInsurance },
    { path: 'update/:id', component: UpdateInsurance },
    { path: 'delete/:id', component: DeleteInsurance },
];
