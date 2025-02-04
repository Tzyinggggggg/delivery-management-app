import { Routes } from '@angular/router';
import { AddDriverComponent } from './add-driver/add-driver.component';
import { ListDriversComponent } from './list-drivers/list-drivers.component';
import { DeleteDriverComponent } from './delete-driver/delete-driver.component';
import { InvalidDataComponent } from './invalid-data/invalid-data.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { UpdateDriverComponent } from './update-driver/update-driver.component';
import { AddPackageComponent } from './add-package/add-package.component';
import { ListPackagesComponent } from './list-packages/list-packages.component';
import { DeletePackageComponent } from './delete-package/delete-package.component';
import { UpdatePackageComponent } from './update-package/update-package.component';
import { StatisticComponent } from './statistic/statistic.component';
import { TranslationComponent } from './translation/translation.component';
import { Text2speechComponent } from './text2speech/text2speech.component';
import { GenAiComponent } from './gen-ai/gen-ai.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'add-driver',
    component: AddDriverComponent,
    canActivate: [authGuard],
  },
  {
    path: 'list-drivers',
    component: ListDriversComponent,
    canActivate: [authGuard],
  },
  {
    path: 'delete-driver',
    component: DeleteDriverComponent,
    canActivate: [authGuard],
  },
  {
    path: 'update-driver',
    component: UpdateDriverComponent,
    canActivate: [authGuard],
  },
  {
    path: 'add-package',
    component: AddPackageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'list-packages',
    component: ListPackagesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'delete-package',
    component: DeletePackageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'update-package',
    component: UpdatePackageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'statistics',
    component: StatisticComponent,
    canActivate: [authGuard],
  },
  {
    path: 'translation',
    component: TranslationComponent,
    canActivate: [authGuard],
  },
  {
    path: 'text2speech',
    component: Text2speechComponent,
    canActivate: [authGuard],
  },
  { path: 'gen-ai', component: GenAiComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'invalid-data',
    component: InvalidDataComponent,
  },
  { path: '**', component: PageNotFoundComponent },
];
