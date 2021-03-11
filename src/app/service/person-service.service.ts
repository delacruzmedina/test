import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {observable, Observable, of} from 'rxjs';
import {Person} from '../persons/person';
import {map} from 'rxjs/operators';
import {Md5} from 'md5-typescript';

@Injectable({
  providedIn: 'root'
})
export class PersonServiceService {

  constructor(private http: HttpClient) { }

  // @ts-ignore
  gets(): Observable<any[]>{
    // @ts-ignore
    const persons = JSON.parse(localStorage.getItem('persons'));

    // @ts-ignore
    if (persons.length === 0){
      // @ts-ignore
      return this.http.get<any[]>('https://randomapi.com/api/897c862b04d8643877316d942e9d70f2')
        .pipe(
          map((next: any[]) => {
            // @ts-ignore
            const [values] = next.results;
            localStorage.setItem('persons', JSON.stringify(values));
            return values;
          })
        );
    }else{
      // @ts-ignore
      return of(persons);

    }
  }

  delete(person: Person): void{
    const storage = localStorage.getItem('persons');

    if (storage != null){
      const persons = JSON.parse(storage);
      const filter = persons.filter((p: { id: string; }) => p.id !== person.id);


      localStorage.setItem('persons', JSON.stringify(filter));


      // console.log(persons, index);
    }
  }

  register(person: Person): void{

  }

  update(person: Person): void{
    const storage = localStorage.getItem('persons');
    if (storage != null) {
      const persons = JSON.parse(storage);
      const filter = persons.filter((p: { id: string; }) => p.id === person.id);

      if (filter.length > 0){
        filter[0].name = person.name;
        filter[0].age = person.age;
        filter[0].gender = person.gender;
        filter[0].base64 = person.base64;
      }else{
        person.id = Md5.init(person.name);
        person.document = null;

        console.log(person);

        persons.push(person);
      }

      // localStorage.setItem(person.id, person.base64);
      localStorage.setItem('persons', JSON.stringify(persons));
    }
  }
}
