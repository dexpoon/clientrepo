import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { FiatComponent } from './components/dashboard/fiat.component';
import { CryptoComponent } from './components/dashboard/crypto.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthenticationService } from './services/auth.service';
import { AuthorizationGuard } from './services/auth.guard';
import { AppErrorHandler } from './components/error/app-error-handler';
import { DatahubService } from './services/datahub.service';
import { PasswordComponent } from './components/password/password.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { TaskService } from './services/task.service';
import { UserComponent } from './components/user/user.component';
import { ChangepasswordComponent } from './components/changepassword/changepassword.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { AboutComponent } from './components/about/about.component';
import { TaskEditComponent } from './components/task-edit/task-edit.component';
import { SortTaskPipe } from './components/tasks/sort-task.pipe';
import { SearchService } from './services/search.service';
import {DropdownModule} from "ngx-dropdown";
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { SortUserPipe } from './components/user/sort-user.pipe';
import { CryptoService } from './services/crypto.service';
import { ForexService } from './services/forex.service';
import { StockService } from './services/stock.service';
import { SortCryptoPipe } from './components/dashboard/sort-crypto.pipe';
import { Logger, LOG_LOGGER_PROVIDERS } from "angular2-logger/core";
import { TreeViewComponent, SidebarModule } from '@syncfusion/ej2-angular-navigations';
import { TasksComponentOptions } from './components/tasks/tasks.componentOptions';
import { DashEditComponent } from './components/dashboard-edit/dashEdit.component';
import { AssetService } from './services/asset.service';
import { StockComponent } from './components/dashboard/stock.component';
import { HttpClientModule } from '@angular/common/http';


let appRoutes: Routes = [
    { path: '',                  component: HomeComponent},
    { path: 'register',          component: RegisterComponent},
    { path: 'login',             component: LoginComponent},
    { path: 'tasklist',          component: TasksComponent, canActivate:[AuthorizationGuard]},          // Shows Tasks, Bills, Appointments
    { path: 'tasklistOptions',   component: TasksComponentOptions, canActivate:[AuthorizationGuard]},   // Shows Infos, HowTos
    { path: 'fiat',              component: FiatComponent, canActivate:[AuthorizationGuard]},      // Shows Financials
    { path: 'stocks',             component: StockComponent, canActivate:[AuthorizationGuard]},      // Shows Financials
    { path: 'crypto',            component: CryptoComponent, canActivate:[AuthorizationGuard]},      // Shows Financials
    { path: 'profile',           component: ProfileComponent, canActivate:[AuthorizationGuard]},
    { path: 'password',          component: PasswordComponent },
    { path: 'userlist',          component: UserComponent },
    { path: 'create',            component: TasksComponent },
    { path: 'update',            component: TaskEditComponent },
    { path: 'changepassword',    component: ChangepasswordComponent },
    { path: 'passwordChangeConfirmation',   component: ConfirmationComponent },
    { path: 'about',             component: AboutComponent },
    { path: 'taskEdit',          component: TaskEditComponent },
    { path: 'userEdit',          component: UserEditComponent },
    { path: 'assetEdit',         component: DashEditComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    FiatComponent,
    CryptoComponent,
    StockComponent,
    ProfileComponent,
    PasswordComponent,
    TasksComponent,
    TasksComponentOptions,
    UserComponent,
    ChangepasswordComponent,
    ConfirmationComponent,
    AboutComponent,
    TaskEditComponent,
    DashEditComponent,
    SortTaskPipe,
    UserEditComponent,
    SortUserPipe,
    SortCryptoPipe
    ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    DropdownModule,
    RouterModule.forRoot(appRoutes),
    SidebarModule,
    HttpClientModule  // added to handle POST Requests
  ],
  providers: [AuthenticationService,
              AuthorizationGuard,
	            DatahubService,
              TaskService,
              AssetService,
              SearchService,
              StockService,
              ForexService,
              CryptoService,
              { provide: ErrorHandler, useClass: AppErrorHandler},
              Logger],
  bootstrap: [AppComponent]
})
export class AppModule { }
