import { Component, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TodoComponent } from './todo/todo.component';
import { ITask } from './models/task';
import {CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem, } from '@angular/cdk/drag-drop';
import {MatTableDataSource} from '@angular/material/table';
import { Observable } from 'rxjs';
import { FirebaseService } from './services/firebase.service';
import { Firestore, collection, } from '@angular/fire/firestore';
import { __values } from 'tslib';
import { validateContextObject } from '@firebase/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'todoapp';


  tasks: ITask[] = [];
  inprogress: ITask[] = [];
  done: ITask[] = [];



  updateIndex!: any;
  isEditEnable :boolean = false;
  imageInfos?: Observable<any>;

constructor(private dilog : MatDialog, private api: FirebaseService,private store:Firestore ){

  
 }

 ngOnInit() {
  this.getAllTask();
  this.getAllInprogress();
  this.getDonetask();
}
 

addInprogress(event: CdkDragDrop<ITask[]>){
  const data = Object.assign({},event.container.data);
  console.log(data);
  this.api.addInproTasks(data);

}

adddone(event: CdkDragDrop<ITask[]>){
  const dondata = Object.assign({}, event.container.data);
  this.api.adddoneTasks(dondata);
}


getAllTask(){
  this.api.getTask().subscribe((res: ITask[]) => {
    this.tasks = res;
  });
}

getAllInprogress(){
  this.api.getInTask().subscribe((res: ITask[]) => {
console.log(res);
  });
}

getDonetask(){
  this.api.getdoneTask().subscribe((res: ITask[]) => {
    console.log(res);
  });
}

 openDialog() {
  this.dilog.open(TodoComponent, {
    width:'30%'
  }).afterClosed().subscribe(val => {
    if (val === 'save'){
      this.api.getTask().subscribe((res: ITask[]) => {
        this.tasks = res;
      });
    }
  })
}


editTasks(task: ITask){
  this.dilog.open(TodoComponent,{
    width:'30%',
    data: task
  }).afterClosed().subscribe(val => {
    if(val === 'update'){
      this.getAllTask();
    }
  });
}

deleteTask(task: ITask){
  if(confirm("Are You sure you want to delete this record ?") == true){
    this.api.delTask(task).then(() => console.log("sucessfull deleted"));
  }
}

deleteInproTask(inprogress:ITask, i:number){
  this.inprogress.splice(i,1);
  if(confirm("Are You sure you want to delete this record ?") == true){
    this.api.delTaskIn(inprogress).then(() => console.log("sucessfull deleted"));
  }
}

deleteDoneTask(done:ITask, i:number){
  this.done.splice(i,1);
  if(confirm("Are You sure you want to delete this record ?") == true){
    this.api.delTaskDone(done).then(() => console.log("sucessfull deleted"));
  }
}


drop(event: CdkDragDrop<ITask[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
  }
}


}
