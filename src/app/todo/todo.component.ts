import { Component, Inject, OnInit } from '@angular/core';
import { ITask } from '.././models/task';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { FirebaseService } from '../services/firebase.service';
import { NgForm } from '@angular/forms';
import { finalize, from, map, Observable, switchMap } from 'rxjs';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {


  task: ITask = {
    id:'',description: '', taskdescription: '', complex: '', imageURL: '', done: false,
  };

  actionBtn : string = "Add";
  updateIndex!: any;
  isEditEnable :boolean = false;

constructor(private api: FirebaseService,
  private dilogRef: MatDialogRef<TodoComponent>,
  @Inject(MAT_DIALOG_DATA) public editTasks:any) { }

  ngOnInit(): void {
  if(this.editTasks){
     this.actionBtn = "Update";
      this.api.getTaskByID(this.editTasks.id).subscribe(res => {
      this.task = res;
    });
  }

}

async onSubmit(form: NgForm) {   
  if(!this.editTasks){
  console.log(form.value);
  this.api.addTasks(form.value).then(() => form.reset());
  this.dilogRef.close('update');
  console.log("Task Added sucsesfully!");
  }
  else{
    this.updateTasks();
  }
}

updateTasks(){
  this.api.updateTask(this.task)
  .then(() => { 
    console.log("task udated sucessfullly"); 
    this.dilogRef.close('update');
  });
}


//.then(url)=>
  //{
  //  this.Firestore.collection('tasks').doc(this.task.id).update("imageURL")
 // }

 

uploadFile(event: any, task:ITask) {
  this.api
  .uploadImage(event.target.files[0], `images/${task.id}`)
  .pipe(
    switchMap((imageURL) =>
      this.api.modifyImage(
        task,
        imageURL
      )
    )
  )
  .subscribe();
  console.log('image uploaded');
}

}