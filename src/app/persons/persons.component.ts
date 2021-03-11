import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Person} from './person';
import {HttpClient} from '@angular/common/http';
import {merge, Observable} from 'rxjs';
import {map, startWith, switchMap} from 'rxjs/operators';
import {PersonServiceService} from '../service/person-service.service';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})
export class PersonsComponent implements OnInit, AfterViewInit, AfterViewChecked  {
  isEditing = false;
  person!: Person;
  persons: Person[] = [];
  displayedColumns: string[] = ['name', 'age', 'gender', 'document', 'actions']; // , ];
  public data: any;

  constructor(private service: PersonServiceService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    // this.getPersons();
  }

  ngAfterViewInit(): void{
    this.onInit();
  }

  onInit(): void{
    merge().pipe(
      startWith({}),
      // @ts-ignore
      switchMap((value, index) => {
        return this.service.gets();
      }),
      map(data => {
        // console.log(data);
        // @ts-ignore
        return data;
      })
    ).subscribe(data => {
      this.data = data;
    });
  }

  // getPersons(): Observable<any> {
  //   // this.http.get('https://randomapi.com/api/897c862b04d8643877316d942e9d70f2').subscribe((data: any) => {
  //   //   const resultPersons = data.results[0];
  //   //   resultPersons.map((item: Person) => {
  //   //     this.persons.push(item);
  //   //   });
  //   //   // console.log(this.persons);
  //   // });
  //   // @ts-ignore
  //
  // }

  onCreatePerson(): void {
    // const person: Person = {id: '', base64: '', age: 0, gender: '', name: '', document: ''};
    // this.data.push(person);

    // this.openCloseDialog();
    this.isEditing = true;

    this.person = {id: '', base64: '', age: 0, gender: '', name: '', document: ''};
  }

  openCloseDialog(): void{
      this.isEditing = !this.isEditing;
  }

  onCreatePersonAccept(): void {
    this.openCloseDialog();
  }

  onCreatePersonCancel(): void {
    this.openCloseDialog();
  }

  onEdit(person: Person): void {
    this.isEditing = true;

    this.person = person;
  }

  onDelete(person: Person): void {
    this.service.delete(person);
    this.onInit();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  onSaved(value: Person): void {


    if (value !== null){
      this.fileToBase64(value.document).then(result => {
        value.base64 = result;

        this.service.update(value);

        this.onInit();
      });
    }

    this.isEditing = false;
  }

  // Convert file to base64 string
  fileToBase64 = (file: File) => {
    return new Promise(resolve => {
      const reader = new FileReader();

      // tslint:disable-next-line:only-arrow-functions typedef
      reader.onload = function(event){
        // @ts-ignore
        resolve(event.target.result);
      };

      reader.readAsDataURL(file);
    });
  }
}
