import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestMethod, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Employee } from './employee.model';
@Injectable()
export class EmployeeService {
  selectedEmployee: Employee;
  employeeList: Employee[];
  constructor(private http:Http) { }
  PostEmployee(emp: Employee){
    var body = JSON.stringify(emp);
    var headerOption = new Headers({'Content-type':'application/json'});
    var requestOptions = new RequestOptions({method:RequestMethod.Post, headers:headerOption});
    return this.http.post('http://localhost:53752/api/Employees',body,requestOptions).map(x=>x.json());
  }
  PutEmployee(id: number, emp: Employee){
    var body = JSON.stringify(emp);
    var header = new Headers({'Content-type':'application/json'});
    var requestOptions = new RequestOptions({method:RequestMethod.Put, headers:header});
    return this.http.put('http://localhost:53752/api/Employees/'+id,body,requestOptions).map(x=>x.json());
  }
  DeleteEmployee(id: number){
    return this.http.delete('http://localhost:53752/api/Employees/'+id).map(x=>x.json());
  }
  GetEmployees(){
    this.http.get('http://localhost:53752/api/Employees').map((data: Response)=>{
      return data.json() as Employee[];
    }).toPromise().then(x=>{this.employeeList = x});
  }
}
