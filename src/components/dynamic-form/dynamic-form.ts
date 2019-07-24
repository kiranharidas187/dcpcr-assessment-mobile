import { Component, Input, OnChanges, ViewChild, AfterViewChecked, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'dynamic-form',
  templateUrl: 'dynamic-form.html'
})
export class DynamicFormComponent implements OnChanges,AfterViewChecked {
  @ViewChild('firstInput') remarkInput ;

  @Input() formFields: any;
  @Input() form: FormGroup;
  minDate = new Date().toJSON().split('T')[0];

  constructor() {
    console.log('Hello DynamicFormComponent Component');
  }
  ngAfterViewChecked() {
    setTimeout(() => {
      this.remarkInput._element.setFocus();
    }, 500);
  }
  createFormGroup(): any {
    let formGrp = {};
    this.formFields.forEach(formfield => {
      console.log(formfield.visibleIf + " "+ formfield.validation.required)
      if(formfield.visibleIf && formfield.validation.required){
        console.log("create")
        formGrp[formfield.field] = new FormControl(formfield.value || "");
      } else {
        formGrp[formfield.field] = formfield.validation.required ? new FormControl(formfield.value || "", Validators.required) : new FormControl(formfield.value || "");
      }
    });
    return new FormGroup(formGrp)
  }

  ngOnChanges(changes) {
    console.log("innnn")
    const changesCount = (changes && changes['formFields']['currentValue'] && changes['formFields']['currentValue'].length) ? changes['formFields']['currentValue'].length : 0;
    if (changes && changesCount > 0) {
      this.formFields = changes['formFields']['currentValue'];
      this.form = this.form ? this.form : this.createFormGroup();
      console.dir(this.form);
    }
  }

  checkForVisibility(field) {
    if(this.form.valid){
      // console.log("valid form")
    } else {
      // console.log("invalid form")

    }
    if (field.visibleIf) {
      const visibility = eval('"' + this.form['controls'][field.visibleIf[0].field].value + '"' + field.visibleIf[0].operator + '"' + field.visibleIf[0].value + '"');
      if(visibility && field.validation.required) {
        this.form.controls[field.field].setValidators([Validators.required])
      } else if(visibility && field.validation.required) {
        this.form.controls[field.field].setValidators([])
      }
      return visibility
    } else {
      return true
    }
  }

}
