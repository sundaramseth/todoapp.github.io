import { Injectable } from '@angular/core';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import { finalize, from, map, Observable, switchMap } from 'rxjs';
import {
  Firestore, addDoc, collection, collectionData,
  doc, docData, deleteDoc, updateDoc, DocumentReference, setDoc, startAfter
} from '@angular/fire/firestore';
import { ITask } from '../models/task';
import { startAt } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private storage: Storage,private firestore: Firestore) {}

  uploadImage(image: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));
    return uploadTask.pipe(switchMap((result) => getDownloadURL(result.ref)));
  }

  //Add data to firestore
  addTasks(task: ITask) {
    const taskRef = collection(this.firestore, 'tasks'); 
    return addDoc(taskRef, task);
  }


  //Add data to firestore
  addInproTasks(inprogress: any) {
      const taskRef = collection(this.firestore, 'inprogress'); 
      return addDoc(taskRef, inprogress);
   }
  
adddoneTasks(done: any){
      const taskRef = collection(this.firestore, 'done'); 
      return addDoc(taskRef, done);
   }

  //Display data from firestore
getTask(): Observable<ITask[]> {
    const taskRef = collection(this.firestore, 'tasks');
    return collectionData(taskRef, { idField: `id` }) as Observable<ITask[]>;
}

  //Display data from firestore
getInTask(): Observable<ITask[]> {
    const taskRef = collection(this.firestore, 'inprogress')
    return collectionData(taskRef, { idField: `id` }) as Observable<ITask[]>;
}
  
  //Display data from firestore
getdoneTask(): Observable<ITask[]> {
    const taskRef = collection(this.firestore, 'done');
    return collectionData(taskRef, { idField: 'id' }) as Observable<ITask[]>;
}

//Delete Book from firestore
delTask(task: ITask){
  const taskDocRef = doc(this.firestore, `tasks/${task.id}`);
  return deleteDoc(taskDocRef);
}

delTaskIn(inprogress: ITask){
  const taskDocRef = doc(this.firestore, `inprogress/${inprogress.id}`);
  return deleteDoc(taskDocRef);
}

delTaskDone(done: ITask){
  const taskDocRef = doc(this.firestore, `done/${done.id}`);
  return deleteDoc(taskDocRef);
}

// Get book id from firestore
getTaskByID(id: string) {
  const taskRef = doc(this.firestore, `tasks/${id}`);
  return docData(taskRef, { idField: 'id' }) as Observable<ITask>;
}

//Update data to firestore
updateTask(task: ITask) {
  const taskDocRef = doc(this.firestore, `tasks/${task.id}`);
  return setDoc(taskDocRef, task);
}

modifyImage(task: ITask, image: string) {
  const imageDocRef = doc(this.firestore, `tasks/${task.id}`);
  return updateDoc(imageDocRef, { imageURL: image });
}

}
