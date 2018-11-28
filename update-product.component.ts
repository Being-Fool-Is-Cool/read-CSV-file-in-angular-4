import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { FileUtil } from './file.util';
import { Constants } from './uploadcsv.constants';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {

  @ViewChild('fileImportInput')
  fileImportInput: any;
  csvRecords = [];

  constructor( private _router: Router, private _fileUtil: FileUtil) { }

  ngOnInit() {
  }

  fileChangeListener($event): void {

    var text = [];
    var target = $event.target || $event.srcElement;
    var files = target.files; 

    if(Constants.validateHeaderAndRecordLengthFlag){
      if(!this._fileUtil.isCSVFile(files[0])){
        alert("Please import valid .csv file.");
        this.fileReset();
      }
    }

    var input = $event.target;
    var reader = new FileReader();
    reader.readAsText(input.files[0]);

    reader.onload = (data) => {
      let csvData = reader.result;
      let csvRecordsArray = csvData.split(/\r\n|\n/);

      var headerLength = -1;
      if(Constants.isHeaderPresentFlag){
        let headersRow = this._fileUtil.getHeaderArray(csvRecordsArray, Constants.tokenDelimeter);
        headerLength = headersRow.length; 
      }
      
      this.csvRecords = this._fileUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray, 
          headerLength, Constants.validateHeaderAndRecordLengthFlag, Constants.tokenDelimeter);
      
      if(this.csvRecords == null){
        //If control reached here it means csv file contains error, reset file.
        this.fileReset();
      }    
    }

    reader.onerror = function () {
      alert('Unable to read ' + input.files[0]);
    };
  };

  fileReset(){
    this.fileImportInput.nativeElement.value = "";
    this.csvRecords = [];
  }

}
