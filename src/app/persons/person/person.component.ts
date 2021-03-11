import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Person} from '../person';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  // @ts-ignore
  public form: FormGroup = null;
  @Input()
  item: Person | null = null;

  @Output()
  personToEmit = new EventEmitter<Person>();

  constructor( private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: ['', []],
      name: ['', [Validators.required, Validators.minLength(4)]],
      age: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      document: ['', [Validators.required]],
      base64: ['', []]
    });

    this.setValue();
  }

  private setValue(): void{
    if (this.item === null){
      return;
    }

    this.form.controls.id.setValue(this.item.id);
    this.form.controls.name.setValue(this.item.name);
    this.form.controls.age.setValue(this.item.age);
    this.form.controls.gender.setValue(this.item.gender);
    this.form.controls.document.setValue(this.item.document);
    this.form.controls.base64.setValue(this.item.base64);

    this.form.markAllAsTouched();

  }

  onSave(): void {
    this.personToEmit.emit(this.form.value);
  }

  // archivo(t: any): void {
  //   console.log(t);
  //   this.fileToBase64('', '', t).then(result => {
  //     console.log(result);
  //   });
  // }


  getImage(): any {
    return this.item?.base64;
  }

  onCancel(): void {
    // @ts-ignore
    this.personToEmit.emit(null);
  }
}
