import { InfoCategories, TaskCategories } from './../common/containers';
import { AuthenticationService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ITask } from '../tasks/itask';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { TaskStati, TaskPriorities } from '../common/containers'
import { CHILL_TIME_OUT, CHILL } from '../common/config';
import { Logger } from 'angular2-logger/core';

// SEARCH ========================================
import { SearchService } from '../../services/search.service';
import { Subject } from 'rxjs/Subject';
import { Http, RequestOptions } from '@angular/http';

@Component({
  selector: 'app-post-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./../common/component.css']
})
export class TaskEditComponent implements OnInit, AfterViewInit {

  RESOURCE_PATH= '../../../assets/'
  userFullname: string;
  task: ITask;
  editddate: string;
  hideId: boolean = true;
  selectedStatus: string;
  selectedPriority: string;
  selectedCategory: string;

  // Declared in containers.ts, but we need them as CLass variable to be able
  // to bind to them in the template
  stati = TaskStati;
  priorities = TaskPriorities;
  categoriesTaskGroup = TaskCategories;
  categoriesInfoGroup = InfoCategories;
  
  hasDocument = false;

  taskEditForm = new FormGroup({
    id: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    notes: new FormControl(''),
    status: new FormControl('', Validators.required),
    priority: new FormControl('', Validators.required),
    ddate: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required)
  });

  constructor(private router: Router,
    private authService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private taskService: TaskService,
    private logger: Logger, 
    private http: Http) {

  }

  IFRAME;
  categories
  ngOnInit() {
    this.userFullname = this.authService.getUserFullName();
    this.activatedRoute.params.subscribe(params => {
      this.task             = new ITask();
      this.task.id          = params['taskIdKey'];
      this.task.description = params['taskdscKey'];
      this.task.notes       = params['taskNotesKey'];
      this.task.status      = params['taskStatusKey'];
      this.task.priority    = params['taskPriorityKey'];
      this.task.ddate       = params['taskDateKey'];
      this.task.category    = params['taskCategory'];
      this.userFullname     = params['usernameKey'];
      this.task.address     = params['addressKey'];
      this.task.credos      = params['credosKey'];
      this.task.docuName    = params['docuNameKey'];
      let  categoryGroup    = params['categoryGroupKey']; 

      if(categoryGroup == 'info')
            this.categories = this.categoriesInfoGroup
      else 
      if(categoryGroup == 'task')
            this.categories = this.categoriesTaskGroup    

    });
  
    this.selectedStatus = this.task.status;
    this.selectedPriority = this.task.priority;
    this.selectedCategory = this.task.category;

    // MongoDB will store \n as <br> html add on
    // we need to reconvert <br> to \n to preserve the formatting
    this.logger.info('NGINIT BEFORE ' + this.task.notes);
  
    this.task.notes = this.task.notes.replace(/<br>/g, '\n');
    this.task.notes = this.task.notes.replace(/~/g, "-");
    this.task.notes = this.task.notes.replace(/<>/g, "/");
  
    this.task.description = this.task.description.replace(/<br>/g, '\n');
    this.task.description = this.task.description.replace(/~/g, "-");
    this.task.description = this.task.description.replace(/<>/g, "/");
  

    // Adding document attachement if present
    if(this.task.docuName == 'XYZ')
        this.task.docuName = ''
    this.task.docuName = this.task.docuName.replace(/~/g, "-")
    this.task.docuName = this.task.docuName.replace(/<>/g, "/")

    //this.logger.info('NGINIT AFTER ' + this.task.notes);
    this.IFRAME = document.getElementById("aiFrame")

    this.beforeToggle()

    console.log("OnInit === exiting..", new Date().getMilliseconds())

  } // ngOnInit

  // true if document attached
  // false if notes only
  checkForDocument():boolean {
    return (this.task.docuName != null 
            && this.task.docuName != 'undefined'
            && this.task.docuName != '')
  }

  // Upon Edit-Component loading
  beforeToggle() {
    // initialization of hasDocument only happens here
    // ngOnInit ==> beforeToggle()

    this.hasDocument = this.checkForDocument() 
    // hasDocument used on Component to load iFrame for Doc if true
    // otherwise the Textarea is loaded
    if(!this.hasDocument){     // no document
      (document.getElementById('toggler') as HTMLInputElement).disabled = true;
      (document.getElementById('toggler') as HTMLInputElement).textContent = 'No Document';
      (document.getElementById('copyPasta') as HTMLInputElement).disabled = false;
    }else{  
      (document.getElementById('toggler') as HTMLInputElement).disabled = false;
      (document.getElementById('toggler') as HTMLInputElement).textContent = 'View Edit Notes';
    }

  } 

  toggle() {
    // Before toggling, check if we have a document attached to toggle to
    if(!this.checkForDocument()){     // no document
      (document.getElementById('toggler') as HTMLInputElement).disabled = true;
      (document.getElementById('toggler') as HTMLInputElement).textContent = 'No Document';
      (document.getElementById('copyPasta') as HTMLInputElement).disabled = false;
     
    }else{  
      this.hasDocument= !this.hasDocument;
      if((document.getElementById('toggler') as HTMLInputElement).textContent == 'View Document') {
          (document.getElementById('toggler') as HTMLInputElement).textContent = 'View Edit Notes';
          (document.getElementById('copyPasta') as HTMLInputElement).disabled = true;
      }
      else {   
          (document.getElementById('toggler') as HTMLInputElement).textContent = 'View Document';
          (document.getElementById('copyPasta') as HTMLInputElement).disabled = false;
      }
    }
  }

  ngAfterViewInit(): void {
    console.log("AfterViewInit ===", new Date().getMilliseconds()) 
  }
  ngAfterContentInit(): void { console.log("AfterContentInit ===", new Date().getMilliseconds()) }
  ngDoCheck(): void { console.log("DoCheck ===", new Date().getMilliseconds()) }
  ngAfterContentChecked(): void { console.log("AfterContentChecked ===", new Date().getMilliseconds()) }

  ngAfterViewChecked(): void
  { 
      console.log("AfterViewChecked ===", new Date().getMilliseconds())
      this.husle()
  }
  
  husle() {
    console.log("Docu Name: ", this.task.docuName)
    if(this.hasDocument) {
        let docuFrame = document.getElementById("aiFrame")
        console.log("docuFrame:", docuFrame)
        console.log("hasDocument:", this.hasDocument)
        //this.hasDocument = true;      // line 2
        if(docuFrame == null || docuFrame == undefined)
          return
        this.IFRAME = docuFrame
        this.IFRAME.contentWindow.location.replace(this.RESOURCE_PATH + this.task.docuName)
    }
  }

  isEmpty(data) {
    return (data == '' || data == 'undefined' || data == undefined || data == ' ') ? true : false
  }

  infoTab = ['Asset', 'Info', 'HowTo']
  updateTask() {
    const editedTask = this.taskEditForm.value;
    editedTask.status = this.selectedStatus;
    editedTask.priority = this.selectedPriority;
    editedTask.category = this.selectedCategory;
    this.logger.info('UPDATE TASK BEFORE ' + editedTask.notes);
    // MongoDB will store \n as <br> html add on
    // to keep the formatting.
    // - needs to be converted to ~ because - is used in the parameter list
    editedTask.notes = editedTask.notes.replace(/-/g, "~");
    editedTask.notes = editedTask.notes.replace(/\n/g, '<br>');
    editedTask.notes = editedTask.notes.replace(/\//g, "<>");
    editedTask.notes = this.encodeBase64(editedTask.notes);

    editedTask.description = editedTask.description.replace(/-/g, "~");
    editedTask.description = editedTask.description.replace(/\n/g, '<br>');
    editedTask.description = editedTask.description.replace(/\//g, "<>");

    // Adding document attachement if present
    if(this.isEmpty(this.attachment)) 
        this.attachment = 'XYZ'
    
    this.attachment = this.attachment.replace(/-/g, "~")
    this.attachment = this.attachment.replace(/\//g, "<>")
    editedTask.docuName = this.attachment

    //editedTask.description = btoa(editedTask.description);
    this.logger.info('UPDATE TASK AFTER ' + editedTask.notes)

    this.taskService.update(editedTask).
      subscribe(data => {
        if (data.success) {
          this.taskEditForm.setErrors({ failedUpdate: false, msg: data.msg });
          if (this.infoTab.includes(editedTask.category))
            this.router.navigate(['/tasklistOptions']);
          else
            this.router.navigate(['/tasklist', { 'taskIdKey': editedTask.id }]);


        } else {
          this.taskEditForm.setErrors({ failedUpdate: true, msg: data.msg });
          this.router.navigate(['/EditTask']);
        }
      });

    CHILL(CHILL_TIME_OUT);  // block for 300 ms to allow the update to be available before
    // the loadAll on the next screen
    if (this.infoTab.includes(editedTask.category))
      this.router.navigate(['/tasklistOptions', { 'taskIdKey': editedTask.id }]);
    else
      this.router.navigate(['/tasklist', { 'taskIdKey': editedTask.id }]);

  } // updateTask

  attachment=''
  fileUpload(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length < 1) {
      return;
    }
    let file: File = fileList[0];
    this.attachment = file.name
    console.log("Attaching File: ", this.attachment)

    /* For later maybe
    let formData:FormData = new FormData();
    formData.append('uploadFile', file, file.name)
    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });
    this.http.post(`${this.apiEndPoint}`, formData, options)
        .map(res => res.json())
        .catch(error => Observable.throw(error))
        .subscribe(
            data => console.log('success'),
            error => console.log(error)
        );
        */
}   


  cancelEdits() {
    const editedTask = this.taskEditForm.value;
    editedTask.category = this.selectedCategory;
    if (this.infoTab.includes(editedTask.category))
      this.router.navigate(['/tasklistOptions']);
    else
      this.router.navigate(['/tasklist', { 'taskCategory': this.task.category }]);
  } // cancelEdits


  /**
   * Encode a string of text as base64
   * @param data The string of text.
   * @returns The base64 encoded string.
   */
  encodeBase64(data: string) {
    //return btoa(encodeURIComponent(data));
    return encodeURIComponent(data);
  }

  // Called by Button encode
  encodeB64() {
    let encoded_Notes = encodeURIComponent(btoa(this.task.notes));
    this.task.notes = encoded_Notes;
  }

  // Called by Button decode
  decodeB64() {
    let decoded_Notes = atob(decodeURIComponent(this.task.notes));
    this.task.notes = decoded_Notes;
  }

  // EDIT STATUS AND PRIORITY
  onSelectStatus(statusId) {
    this.selectedStatus = null;
    for (var i = 0; i < this.stati.length; i++) {
      if (this.stati[i].id == statusId) {
        this.selectedStatus = this.stati[i].name;
      }
    }
  }

  onSelectPriority(priorityId) {
    this.selectedPriority = null;
    for (var i = 0; i < this.priorities.length; i++) {
      if (this.priorities[i].id == priorityId) {
        this.selectedPriority = this.priorities[i].name;
      }
    }
  }

  onSelectCategory(categoryId) {
    this.selectedCategory = null;
    for (var i = 0; i < this.categories.length; i++) {
      if (this.categories[i].id == categoryId) {
        this.selectedCategory = this.categories[i].name;
      }
    }
  }

  // Upon click on the connect button, the creds are automatically copied to the clipboard
  connect() {
    // Copy the text inside the text field
    //let encodedCreds =  encodeURIComponent(btoa("franco3||||Nikolaus777"));
    this.copyToClipboard(this.task.credos);
  }

  notesToClipboard() {
    this.copyToClipboard(this.task.notes);
  }

  copyToClipboard = (str) => {
    const el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    const selected =
      document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
  };

  ngOnDestroy(): void { 
    console.log("OnDestroy ===", new Date().getMilliseconds()) 
    this.taskEditForm = null
    this.hasDocument  = false
    this.task         = null
  }
  
} // PostEditComponent



