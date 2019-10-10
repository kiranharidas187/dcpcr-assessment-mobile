import { Component, Input } from '@angular/core';
import { TextToSpeechProvider } from '../../providers/text-to-speech/text-to-speech';
import { Events } from 'ionic-angular';

/**
 * Generated class for the QuestionHeadingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'question-heading',
  templateUrl: 'question-heading.html'
})
export class QuestionHeadingComponent {

  text: string;
  @Input()data ;
  @Input()inputIndex;
  showQuestionNumber = false;

  play = false;
  constructor(private textToSpeech : TextToSpeechProvider,private events :Events) {
    console.log('Hello QuestionHeadingComponent Component');
    this.text = 'Hello World';
    this.events.subscribe('speech' , data =>{
      this.play = false;
    })
  }

  playQuestion(question , options , type){
    this.play = true;
    this.textToSpeech.speechFromText({text:question}).then(success =>{
    
      let url = options.length > 0 ?   this.addOptionsToUrl(options , type) :
      this.play = false;
      }).catch(error =>{
        
        console.log(JSON.stringify(error));
      });
  }
  addOptionsToUrl(options , type : string) {
  let url =  type === 'multiSelect' ? 'you can select multiple options ' : 'select one option form following ';
  this.textToSpeech.speechFromText({text:url}).then( async success =>{

      // options.forEach( async (option,optionIndex) =>{
        for( let i  =0 ; i < options.length ;i++){
       let  url = 'option '+ (i+1) + options[i]['label'];
        await this.textToSpeech.speechFromText({text:url}).then( success =>{ 
          //  this.play = false 
          //  console.log("true") : this.play = true;

          console.log( options.length + '    '+i)

        }).catch(
          error =>{
            this.play = false ;
          }
        );
        // options.lenght  == (i+1) ? this.play = false  : this.play = true
        

      }
      this.play = false;
    }).catch(error =>{
      this.play = false ;

      console.log(JSON.stringify(error));
    });
    
  }
  pauseQuestion(){
    this.textToSpeech.stopSpeech();
    this.play = false;

  }
}
