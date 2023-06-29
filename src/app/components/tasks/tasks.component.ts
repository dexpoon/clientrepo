import { Status } from './../common/containers';
import { Logger } from 'angular2-logger/core';
import { AuthenticationService } from '../../services/auth.service';
import { NotFoudError } from '../error/not-found-error';
import { BadRequest } from '../error/bad-request';
import { AppError } from '../error/app-error';
import { TaskService } from '../../services/task.service';
import { Component, ElementRef, Renderer, OnInit } from '@angular/core';
import { ITask } from './itask';
import { ActivatedRoute, Router } from '@angular/router';
import { clone } from 'lodash';
import * as _ from 'lodash';
// SEARCH ========================================
import { SearchService } from '../../services/search.service';
import { Subject } from 'rxjs/Subject';
//================================================
import { Category, Priority, TaskCategories, TaskPriorities } from '../common/containers';
import { SOURCE } from '../common/classifier';
import { Observable, Observer } from 'rxjs';


enum UPDATE_MODE {
  OPTIMISTIC,
  PESSIMISTIC
}
enum TASK_STATUS {
  CREATED,
  STARTED,
  COMPLETED,
  ONHOLD
}
enum TASK_PRIORITY {
  CRITICAL,
  HIGH,
  LOW,
  NA
}
enum TASK_OPTION {
  ACTIV,    // represents Task Categories: Task, Aptm, Bill
  PASSIV,   // represents Task Categories: Info, HowTo
  ALL
}

const MINIMAL_TASK_LENGTH = 3;

@Component({
  selector: 'app-posts',
  templateUrl: './tasks.component.html',
  styleUrls: ['../common/component.css']
})
export class TasksComponent implements OnInit {

  // SEARCH SECTION ====================
  results: Object;
  searchTerm$ = new Subject<string>();
  //====================================

  showActives = true;   // to show Task, Aptm and Bill count
  showPassives = false;  // Do not show Infos and HowTos

  renderer: any;
  pageTitleEng = "Task List Management Console";
  pageTitle = "Store and Find Information Quickly";
  todos = 'Add ngOnDestroy()';

  taskHintEng = "Task Description Here. - Hit Enter Key or the Add Task Button";
  taskHint = "Task or Info, Title Keywords Tags..";

  taskSuccessEng = "Success: Entry has been Created";
  taskSuccess = "Success: Entry has been Created.";
  tasks: any[] = [];     // this list changes based on what we search for


  EMPTY_STRING = '';
  STATUS_VERBOSE_MAP: Map<number, string>
  PRIORITY_VERBOSE_MAP: Map<number, string>

  isMapInit: boolean
  usefancy = true;
  user: any
  username: string
  userFullname: string

  disableCreate: boolean = true;

  // Elements needed to create a new Task
  // Binds to Due Date for New Task on TaskList Screen
  newddate: string = new Date().toISOString().slice(0, 10);



  STATUS_RANKING_MAP: Map<string, number>;
  PRIORITY_RANKING_MAP: Map<string, number>;
  CATEGORY_RANKING_MAP: Map<string, number>;

  STATUS_TO_COLOR_MAP: Map<string, string>;
  PRIORITY_TO_COLOR_MAP: Map<string, string>;
  CATEGORY_TO_COLOR_MAP: Map<string, string>;


  // Add New categories here.. Future load from Configuration table..
  categories = TaskCategories;
  priorities = TaskPriorities;

  public selectedCategory: Category = this.categories[0];
  onSelectCategory(categoryId) {
    this.selectedCategory = null;
    for (var i = 0; i < this.categories.length; i++) {
      if (this.categories[i].id == categoryId) {
        this.selectedCategory = this.categories[i];
      }
    }
  }

  public selectedPriority: Priority = this.priorities[1];
  onSelectPriority(priorityId) {
    this.selectedPriority = null;
    for (var i = 0; i < this.priorities.length; i++) {
      if (this.priorities[i].id == priorityId) {
        this.selectedPriority = this.priorities[i];
      }
    }
  }

  // Handle Decription Only Search
  public isChecked = true; // search Description Only
  changed = (evt) => {
    this.isChecked = evt.target.checked;
    console.log('Checked: ', this.isChecked);
    this.searchService.updateNotesOptOut(this.isChecked);

    // subscribe to search to listen for search events
    this.searchService.search(this.searchTerm$, this.isChecked) // isChecked not used
      .subscribe(results => {
        this.tasks = [];
        this.tasks = results;
      });

    if (this.currentSearchTermValue != '' && this.currentSearchTermValue != null) {
      this.searchTerm$.next(this.currentSearchTermValue);
    }
  }

  currentSearchTermValue;
  onSearchKeyUp(searchTermValue) {
    this.currentSearchTermValue = searchTermValue;
    this.searchTerm$.next(searchTermValue);
  }

  constructor(private router: Router, private service: TaskService,
    private authService: AuthenticationService,
    private searchService: SearchService,
    private activatedRoute: ActivatedRoute,
    private logger: Logger) {

    this.isChecked = true;
    // SECTION FOR DYNAMIC TASKS ===================================================//
    this.searchService.search(this.searchTerm$, this.isChecked) // isChecked not used
      .subscribe(results => {
        console.log('taskComponentTS.search called FROM CONSTRUCTOR');
        this.tasks = [];
        this.tasks = results;

        if (this.includeCompleted == false) {
          console.log('[]==== Tasks including completed ' + this.tasks);
          for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].status === 'Completed')
              this.tasks.splice(i--, 1);
          }
          console.log('[]==== Only non completed Tasks ' + this.tasks);
        }

      });

  } // End Consructor

  category;
  filteredTasks: any[] = [];
  filter(): any[] {
    this.tasks.forEach((task) => {
      if (task.category == this.category)
        this.filteredTasks.push(task);
    });
    return this.filteredTasks;
  }

  editedTaskID;
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.category = params['taskCategory'];
      this.editedTaskID = params['taskIdKey'];
    });

    this.userFullname = this.authService.getUserFullName();
    this.initMaps();
    this.service.loadWithOption('ACTIV').
      subscribe(tasks => {
        this.tasks = this.format(tasks)
        this.tasks = this.showEditedFirst();

        for (let i = 0; i < this.tasks.length; i++) {
          if (this.tasks[i].status === 'Completed')
            this.tasks.splice(i--, 1);
        }
      
      });

    // Whenever we load the tasks, we want to see the highest priority tasks first
    //this.sortTable('prioritySorter'); do not sort, so that the edited item shows up first..
    this.includeCompleted = false
    this.isChecked = true
    this.searchService.updateNotesOptOut(this.isChecked)
    //console.log(this.tasks);

  } // ngOnInit


  // ======================================== START -- COUNT & FILTERING SECTION -- START ===================================================//
  doShow: boolean = true;
  narrowDown(term) {
    this.searchTerm$.next(term);
    this.sortTableExplicit('ddate', 1);
  }

  criticalCount() {
    let res = 0;
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].priority === 'Critical')
        res++;
    }
    return res;
  }

  completedCount() {
    let res = 0;
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].status === 'Completed')
        res++;
    }
    return res;
  }


  highCount() {
    let res = 0;
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].priority === 'High')
        res++;
    }
    return res;
  }

  totalCount() {
    return this.tasks.length;
  }

  addedFunctionThatDoesNothing() {
  }

  // Handle Disable Alerts
  showAlerts = false
  alerting = (evt) => {
    this.showAlerts = evt.target.checked;
    console.log('Disable Alerts: ', this.showAlerts);
  }

  handleAlerts(task) {
    if(!this.showAlerts) 
      return
    let item = ''
    if(task.category === 'Aptm')
      item = 'APPOINTMENT'
    else
    if(task.category === 'Bill')
      item = 'Bill'
    else
    if(task.category === 'Task')
      item = 'Task'
  
    if(task.status != 'Completed' 
        && task.alerted == false
        && new Date(task.ddate) <= new Date()) {
      alert(`${item}:  ${task.description} 
           PAST DUE, KEY DATE: ${task.ddate} `);
           task.alerted= true
    }
  }

  AptmCount() {
    //console.log(" AptmCount called!!!")
    let res = 0;
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].category === 'Aptm') {
        res++;
        this.handleAlerts(this.tasks[i])
      }
    }
    return res;
  }

  BillCount() {
    let res = 0;
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].category === 'Bill') {
        res++;
        this.handleAlerts(this.tasks[i])
      }
    }
    return res;
  }

  TaskCount() {
    let res = 0;
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].category === 'Task') {
        res++;
        this.handleAlerts(this.tasks[i])
      }
    }
    return res;
  }

  // =============================================== END -- COUNT & FILTERING SECTION -- END ================================================//
  format(objs) {
    for (var i = 0; i < objs.length; i++) {
      
      let tempNotes = this.decodeBase64(objs[i].notes);

      if(i == 45) {
        console.log(" Before replace: ", objs[i].description)
      }
      objs[i].description = objs[i].description.replace(/~/g, "-");
      objs[i].description = objs[i].description.replace(/<>/g, "/");
  
      if(i == 45) {
        console.log(" After replace: ", objs[i].description)
      }
  
      if (tempNotes !== undefined) {
        objs[i].notes = tempNotes.replace(/~/g, "-");
        objs[i].notes = tempNotes.replace(/<>/g, "/");
      }
    }
    return objs;
  }

  // TASK CREATE SECTION
  onKeyUp(taskInput: HTMLInputElement): void {
    this.logger.info(taskInput.value);
    if (taskInput.value !== null &&
      taskInput.value !== this.EMPTY_STRING &&
      taskInput.value !== this.taskHint &&
      taskInput.value.length > MINIMAL_TASK_LENGTH) {

      this.disableCreate = false;

    } else {
      this.disableCreate = true;
    }
    this.logger.info(this.disableCreate);
  }

  createTask(event: KeyboardEvent, taskInput: HTMLInputElement) {
    this.logger.info('+++++++++++ CREATE_TASK: ' + taskInput.value);
    if ((event === null || event.keyCode == 13) &&
      taskInput !== null &&
      taskInput.value !== this.EMPTY_STRING &&
      taskInput.value !== this.taskHint &&
      taskInput.value !== this.taskSuccess &&
      taskInput.value.length > MINIMAL_TASK_LENGTH) {

      if (this.newddate === undefined || this.newddate === 'undefined')
        this.newddate = new Date().toISOString().slice(0, 10);

      taskInput.value = taskInput.value.replace(/-/g, "~");
      taskInput.value = taskInput.value.replace(/\//g, "<>");

      var task = {
        description: taskInput.value,
        status: this.STATUS_VERBOSE_MAP.get(TASK_STATUS.CREATED),
        priority: this.selectedPriority.name,
        id: this.EMPTY_STRING,
        username: this.EMPTY_STRING,
        ddate: this.newddate,
        notes: this.encodeBase64('Place Holder..'),
        category: this.selectedCategory.name,
        expanded: false
      };

      this.tasks.splice(0, 0, task);  // OPTIMISTIC UPDATE
      this.service.create(task).
        subscribe(
          response => {
            taskInput.value = this.EMPTY_STRING;
          },
          (error: AppError) => {
            // Something went wrong during task creation, we need to
            // undo the change. Remove new task from top of the list
            taskInput.value = this.EMPTY_STRING;
            //  if(this.update_mode === UPDATE_MODE.OPTIMISTIC)
            this.tasks.splice(0, 1);
            if (error instanceof BadRequest)
              this.logger.error(error);
            else throw error;
          }
        );
      taskInput.value = this.EMPTY_STRING;

      // switch back to - for dd-mm-yyyy date format display
      let tempDate = task.ddate.replace(/A/g, "-");
      task.ddate = tempDate;
      task.id = '**'
      this.disableCreate = true;
      taskInput.value = this.taskSuccess;
      taskInput.style.backgroundColor = 'rgb(185, 244, 66)';

    } // if Task Desc not EMPTY
    else { // EMPTY

      if (taskInput.value !== this.taskSuccess) {
        taskInput.value = this.taskHint;
        taskInput.style.backgroundColor = 'red';
      }
    }

  } // createTask

  /**
   * Encode a string of text as base64
   * @param data The string of text.
   * @returns The base64 encoded string.
   */
  encodeBase64(data: string) {
    // return btoa(encodeURIComponent(data));
    return encodeURIComponent(data);
  }

  /**
  * Decode a string of base64 as text
  * @param data The string of base64 encoded text
  * @returns The decoded text.
  */
  decodeBase64(data: string) {
    //return decodeURIComponent(atob(data));
    try {
      return decodeURIComponent(data);
    } catch (e) {
      console.log(e.message, ' returning data as is..');
      return data;
    }

    //return data;
  }

  deleteTask(task) {

    if (confirm("Are You Sure You Want To Delete " + task.description)) {
      let index = this.tasks.indexOf(task);
      this.tasks.splice(index, 1);
      this.service.delete(task).
        subscribe(response => {
        },
          (error: AppError) => {
            // If an error occured during delete, put the task back
            // the task list
            this.tasks.splice(index, 0, task);
            if (error instanceof NotFoudError)
              alert('Post already deleted!');
            else
              throw error;
          });
    } // End if(confirm)     
  } // deleteTask()

  // Action to load/view Task notes, task-edit.component.ts.updateTask() is used to update
  editTask(task) {
    this.router.navigate(['/taskEdit',
      {
        'taskIdKey'       : task.id,
        'taskdscKey'      : task.description,
        'taskNotesKey'    : this.decodeBase64(task.notes),
        'taskStatusKey'   : task.status,
        'taskPriorityKey' : task.priority,
        'taskDateKey'     : task.ddate,
        'taskCategory'    : task.category,
        'usernameKey'     : this.userFullname,
        'addressKey'      : task.address,
        'credosKey'       : task.credos,
        'docuNameKey'     : task.docuName,
        'categoryGroupKey': 'task'
      }]);
  }

  showEditedFirst(): any[] {
    this.tasks.forEach((item, i) => {
      if (item.id == this.editedTaskID) {
        console.log('===== item.id = ' + item.id);
        this.tasks.splice(i, 1);    // remove that one item
        this.tasks.push(item);      // place it at the head of array
      }
    });
    return this.tasks;
  }

  // Handle include/exclude Completed Tasks
  public includeCompleted = false;
  public showCompleted = (evtos) => {
    this.includeCompleted = evtos.target.checked
    if (this.includeCompleted) {
      console.log(`[Y]=== SHOW COMPLETED TASKS == ${this.includeCompleted}`)
    } else {
      console.log(`[X]=== HIDE COMPLETED TASKS == ${this.includeCompleted}`)
    }
  } // End showCompleted
  colorForStatus(status) {
    return this.STATUS_TO_COLOR_MAP.get(status);
  }

  colorForPriority(priority) {
    return this.PRIORITY_TO_COLOR_MAP.get(priority);
  }

  colorForCategory(category) {
    return this.CATEGORY_TO_COLOR_MAP.get(category);
  }



  clearTask(taskInput: HTMLInputElement) {
    this.doShow = true;
    if (taskInput.value === this.taskHint ||
      taskInput.value === this.taskSuccess) {
      taskInput.value = this.EMPTY_STRING;
      taskInput.style.backgroundColor = 'white';
    }
  }

  clear() {
    this.renderer = null;
    this.tasks = [];
    this.isMapInit = false;
    this.user = {};
    this.username = this.EMPTY_STRING;
    this.STATUS_VERBOSE_MAP = null;
    this.PRIORITY_VERBOSE_MAP = null;
    this.isMapInit = false;
    this.user = null;
    this.username = this.EMPTY_STRING;
    this.userFullname = this.EMPTY_STRING;
    this.STATUS_RANKING_MAP = null;
    this.PRIORITY_RANKING_MAP = null;
  }


  // SORTING HOOK ==================================
  path: string[] = ['task'];
  order: number = 1; // 1 asc, -1 desc;

  sortTable(prop: string) {
    this.path = prop.split('.')
    this.order = this.order * (-1); // change order
    return false; // do not reload
  }

  sortTableExplicit(prop: string, x) {
    this.path = prop.split('.')
    this.order = x; // change order
    return false; // do not reload
  }

  //===========================================


  initMaps() {
    if (!this.isMapInit) {
      this.STATUS_VERBOSE_MAP = new Map()
      this.STATUS_VERBOSE_MAP.set(TASK_STATUS.CREATED, 'New')
      this.STATUS_VERBOSE_MAP.set(TASK_STATUS.STARTED, 'Pending')
      this.STATUS_VERBOSE_MAP.set(TASK_STATUS.COMPLETED, 'Completed')
      this.STATUS_VERBOSE_MAP.set(TASK_STATUS.ONHOLD, 'OnHold')

      this.PRIORITY_VERBOSE_MAP = new Map()
      this.PRIORITY_VERBOSE_MAP.set(TASK_PRIORITY.LOW, 'Low')
      this.PRIORITY_VERBOSE_MAP.set(TASK_PRIORITY.HIGH, 'High')
      this.PRIORITY_VERBOSE_MAP.set(TASK_PRIORITY.CRITICAL, 'Critical')
      this.PRIORITY_VERBOSE_MAP.set(TASK_PRIORITY.NA, 'NA')

      this.STATUS_RANKING_MAP = new Map();
      this.STATUS_RANKING_MAP.set('New', 1);
      this.STATUS_RANKING_MAP.set('Pending', 2);
      this.STATUS_RANKING_MAP.set('Completed', 3);
      this.STATUS_RANKING_MAP.set('OnHold', 4);

      this.PRIORITY_RANKING_MAP = new Map();
      this.PRIORITY_RANKING_MAP.set('Low', 10);
      this.PRIORITY_RANKING_MAP.set('High', 30);
      this.PRIORITY_RANKING_MAP.set('Critical', 40);
      this.PRIORITY_RANKING_MAP.set('NA', 50);

      this.CATEGORY_RANKING_MAP = new Map();
      this.CATEGORY_RANKING_MAP.set('Task', 10);
      this.CATEGORY_RANKING_MAP.set('Aptm', 20);
      this.CATEGORY_RANKING_MAP.set('Info', 30);
      this.CATEGORY_RANKING_MAP.set('HowTo', 40);

      this.STATUS_TO_COLOR_MAP = new Map();
      this.STATUS_TO_COLOR_MAP.set('New', 'blue')
      this.STATUS_TO_COLOR_MAP.set('Pending', 'velvet');
      this.STATUS_TO_COLOR_MAP.set('Completed', 'green');
      this.STATUS_TO_COLOR_MAP.set('OnHold', 'red');

      this.PRIORITY_TO_COLOR_MAP = new Map();
      this.PRIORITY_TO_COLOR_MAP.set('Low', 'blue');
      this.PRIORITY_TO_COLOR_MAP.set('High', 'orange');
      this.PRIORITY_TO_COLOR_MAP.set('Critical', 'red');
      this.PRIORITY_TO_COLOR_MAP.set('NA', 'black');

      this.CATEGORY_TO_COLOR_MAP = new Map();
      this.CATEGORY_TO_COLOR_MAP.set('Task', 'LightBlue');
      this.CATEGORY_TO_COLOR_MAP.set('Aptm', 'Chartreuse');
      this.CATEGORY_TO_COLOR_MAP.set('Info', 'Aqua');
      this.CATEGORY_TO_COLOR_MAP.set('HowTo', 'SpringGreen');
      this.CATEGORY_TO_COLOR_MAP.set('Bill', 'AliceBlue');

      this.isMapInit = true
    }

  } // End initMaps()

} // End TasksComponent Class

