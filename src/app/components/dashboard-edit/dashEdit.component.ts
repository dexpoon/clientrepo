import { TaskCategories } from '../common/containers';
import { AuthenticationService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IAsset } from '../dashboard/asset';
import { clone } from 'lodash';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Status, Priority, TaskStati, TaskPriorities } from '../common/containers'
import { timeout } from 'q';
import { CHILL_TIME_OUT, CHILL } from '../common/config';
import { Logger } from 'angular2-logger/core';
import { AssetService } from '../../services/asset.service';
import { IPortfolio } from '../dashboard/IPortfolio';

@Component({
  selector: 'app-post-edit',
  templateUrl: './dashEdit.component.html',
  styleUrls: ['./../common/component.css']
})
export class DashEditComponent implements OnInit {
  pageTitleEng = 'Dashboard Editing Console';
  userFullname: string;
  asset: IAsset;
  editddate:string;
  hideId:boolean = true;

assetEditForm = new FormGroup({
    id :                new FormControl('', Validators.required),
    symbol :            new FormControl('', Validators.required),
    count_owned :       new FormControl('', Validators.required),
    staked :            new FormControl('', Validators.required),
    wallet :            new FormControl('', Validators.required),
    notes:              new FormControl('')
  });

constructor(  private router: Router,
              private authService: AuthenticationService,
              private activatedRoute: ActivatedRoute,
              private assetService: AssetService,
              private logger: Logger,
              private location: Location) { }

ngOnInit() {
    this.userFullname = this.authService.getUserFullName();
    this.activatedRoute.params.subscribe(params => {
    this.asset = new IAsset("", "", "", 0);
     this.asset.id            = params['assetIdKey'];
     this.asset.symbol        = params['assetSymbolKey'];
     this.asset.wallet        = params['assetWalletKey'];
     this.userFullname        = params['usernameKey'];
     this.asset.staked        = (params['assetStakedKey'] !== 'undefined')? params['assetStakedKey']: 0;
     this.asset.count_owned   = (params['assetCountKey']  !== 'undefined')? params['assetCountKey']: 0;
     this.asset.notes         = (params['assetNotesKey']  !== 'undefined')? params['assetNotesKey']: '';
     this.asset.url           = (params['assetURL']       !== 'undefined')? params['assetURL']: '';
     this.asset.costbasis     = (params['assetCBasis']    !== 'undefined')? params['assetCBasis']: '';      
     this.asset.credos        = (params['assetCredos']    !== 'undefined')? params['assetCredos']: ''; 
    
    });

    //************ MAYBE NOT NEEDED *****************************/
    // MongoDB will store \n as <br> html add on
    // we need to reconvert <br> to \n to preserve the formatting
    //this.logger.info('NGINIT BEFORE ' + this.asset.notes);
    //this.asset.notes       = this.asset.notes.replace(/<br>/g, '\n');
    //this.logger.info('NGINIT AFTER ' + this.asset.notes);
    this.asset = this.formatPostLoad(this.asset);
  } // ngOnInit

  // Before Storing
  formatPreStore(asset):IAsset {
        // MongoDB will store \n as <br> html add on
        // to keep the formatting.
        // - needs to be converted to ~ because - is used in the parameter list
        asset.notes = asset.notes.replace(/-/g, "~");
        asset.notes = asset.notes.replace(/\n/g, '<br>');
        asset.notes = asset.notes.replace(/\//g, "<>");
        return asset;
  }

  // For Display
  formatPostLoad(asset): IAsset{
      asset.notes     = asset.notes.replace(/<br>/g, '\n');
      asset.notes = asset.notes.replace(/~/g, "-");
      asset.notes = asset.notes.replace(/<>/g, "/");
      return asset;
  }

  updateAsset(asset) {
    const editedAsset       = this.formatPreStore(this.assetEditForm.value);
    editedAsset.notes       = this.encodeBase64(editedAsset.notes);

    this.assetService.updateAsset(editedAsset).
    subscribe( data => {
      if (data.success) {
        this.assetEditForm.setErrors({ failedUpdate: false , msg: data.msg });
        if(IPortfolio.isFiat(editedAsset.id))
            this.router.navigate(['/fiat']);
        else 
        if(IPortfolio.isCrypto(editedAsset.id))
            this.router.navigate(['/crypto']);
        else 
        if(IPortfolio.isStock(editedAsset.id))
            this.router.navigate(['/stocks']);
        else {    
          this.assetEditForm.setErrors({ failedUpdate: true , msg: "Unknown Asset! Check DB"});
          this.router.navigate(['/assetEdit']);
        }
      }else {
        this.assetEditForm.setErrors({ failedUpdate: true , msg: data.msg});
        this.router.navigate(['/assetEdit']);
      }
    });

    CHILL(CHILL_TIME_OUT);  // block for 300 ms to allow the update to be available before
                            // the loadAll on the next screen

    if(IPortfolio.isFiat(editedAsset.id))
        this.router.navigate(['/fiat']);
    else 
    if(IPortfolio.isCrypto(editedAsset.id))
        this.router.navigate(['/crypto']);
    else
    if(IPortfolio.isStock(editedAsset.id))
        this.router.navigate(['/stocks']);
                  
  } // updateAsset

  
  cancelEdits() {
    const editedAsset      = this.assetEditForm.value;
    if(IPortfolio.isFiat(editedAsset.id))
      this.router.navigate(['/fiat']);
    else 
    if(IPortfolio.isCrypto(editedAsset.id))
      this.router.navigate(['/crypto']);
    else
    if(IPortfolio.isStock(editedAsset.id))
      this.router.navigate(['/stocks']);
    else {
      this.assetEditForm.setErrors({ failedUpdate: true , msg: "Unknown Asset! Check DB"});
      this.router.navigate(['/assetEdit']);
    }

  } // cancelEdits


/**
 * Encode a string of text as base64
 * @param data The string of text.
 * @returns The base64 encoded string.
 */
 encodeBase64(data: string) {
  //return btoa(encodeURIComponent(data));
  return encodeURIComponent(data);
}


  // Upon click on the connect button, the creds are automatically copied to the clipboard
  connect() {
    // console.log(`Attempting to Connect to address $(this.task.address)`);
    // Copy the text inside the text field
    //let encodedCreds =  encodeURIComponent(btoa("franco3||||Nikolaus777"));
    this.copyToClipboard(this.asset.credos);
  }

  copyToClipboard = (str) => {
    const el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    const selected =
      document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
  };


} // PostEditComponent
