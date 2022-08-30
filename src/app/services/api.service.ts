import {HttpClient, HttpRequest, HttpEvent} from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  
postDescription(tasks:any){
    return this.http.post<any>('http://localhost:3000/tasks/', tasks);
  }
getDescription(){
    return this.http.get<any>("http://localhost:3000/tasks/");
  }

editTaskItem(tasks:any,id: number){
return this.http.put<any>("http://localhost:3000/tasks/"+id, tasks);
}

deleteTaskItem(id:number){
  return this.http.delete<any>("http://localhost:3000/tasks/"+id);
}
}
