import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthenticationService } from '../../services/auth.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  YOU_URL         = "https://you.com/code";
  PERPLX_URL      = "https://www.perplexity.ai/";
  PHIND_URL       = "https://www.phind.com/";
  //PRAYER_URL      = "https://www.islamicfinder.org/prayer-widget/4219934/shafi/5/0/15.0/15.0";
  PRAYER_URL      = "https://www.youtube.com/watch?v=GqcksSpS7xE&list=PLqdPePyJvnhiNvSoMCNRw8kOr04Sd1j9d&index=1";
  WEATHER_ULR     = "https://www.theweather.com/wimages/fotoae73c90e1ca41c89cfc0885757138340.png";
  HACKERNOON_URL  = "https://hackernoon.com/";
  FIDELITY_URL    = "https://login.fidelity.com/ftgw/Fas/Fidelity/RtlCust/Login/Init";
  METROCITY_URL   = "https://olb.metrocitybank.com/login/";
  BOFA_URL        = "https://www.bankofamerica.com/";
  SAFA_URL        = "https://assafanet.bankassafa.com/client/login/auth/";
  BINANCE_URL     = "https://www.binance.us/login?return_to=aHR0cHM6Ly9iaW5hbmNlLnVzLw==";
  METROPCS_URL    = "https://www.metrobyt-mobile.com/my-account/sign-in";
  YAHOO_URL       = "https://finance.yahoo.com";
  GMAIL_URL       = "https://mail.google.com/mail/u/0/#inbox";
  DICE_URL        = "https://www.dice.com/";
  QURAN_URL       = "https://www.alim.org/quran/mushaf/page/257/";
  YOUTUBE_URL     = "https://www.youtube.com/";
  MARKET_CALENDAR = "https://www.marketwatch.com/economy-politics/calendar";
  OUJDA_URL       = "https://www.timeanddate.com/worldclock/morocco/oujda";
  RCM_URL         = "https://roswellmasjid.org/";


  // IMPORTANT, TO BE ABLE TO LOAD THESE.. FILES NEED TO BE WITHIN THE BASE CODE
  // OTHERWISE THE WEB SERVER CONSIDER THEM PART OF THE FILE SYSTEM AND DOES NOT 
  // ALLOW YOU TO LOAD THEM FOR SECURITY REAONS
  AWS_URL         = "../../../assets/AWSCertification.pdf";
  HUSNA_URL       = "../../../assets/Husna.PNG";
  

  TODAY_DATE;
  TIME_STAMP;

  IFRAME;
  iDocument;
  URL;

  URL_BY_RADIO_MAP: Map<string, string> = new Map<string, string>();


  constructor(private authService: AuthenticationService) {

    this.URL_BY_RADIO_MAP.set('husna', this.HUSNA_URL);
    this.URL_BY_RADIO_MAP.set('you', this.YOU_URL);
    this.URL_BY_RADIO_MAP.set('perplex', this.PERPLX_URL);
    this.URL_BY_RADIO_MAP.set('phind', this.PHIND_URL);
    this.URL_BY_RADIO_MAP.set('prayer', this.PRAYER_URL);
    this.URL_BY_RADIO_MAP.set('weather', this.WEATHER_ULR);
    this.URL_BY_RADIO_MAP.set('hacker', this.HACKERNOON_URL);
    this.URL_BY_RADIO_MAP.set('fidelity', this.FIDELITY_URL);
    this.URL_BY_RADIO_MAP.set('metrocity', this.METROCITY_URL);
    this.URL_BY_RADIO_MAP.set('bofa', this.BOFA_URL);
    this.URL_BY_RADIO_MAP.set('safa', this.SAFA_URL);
    this.URL_BY_RADIO_MAP.set('binance', this.BINANCE_URL);
    this.URL_BY_RADIO_MAP.set('metropcs', this.METROPCS_URL);
    this.URL_BY_RADIO_MAP.set('yahoo', this.YAHOO_URL);
    this.URL_BY_RADIO_MAP.set('gmail', this.GMAIL_URL);
    this.URL_BY_RADIO_MAP.set('dice', this.DICE_URL);
    this.URL_BY_RADIO_MAP.set('quran', this.QURAN_URL);
    this.URL_BY_RADIO_MAP.set('youtube', this.YOUTUBE_URL);
    this.URL_BY_RADIO_MAP.set('markets', this.MARKET_CALENDAR);
    this.URL_BY_RADIO_MAP.set('oujda', this.OUJDA_URL);
    this.URL_BY_RADIO_MAP.set('rcm', this.RCM_URL);
    this.URL_BY_RADIO_MAP.set('aws', this.AWS_URL);
    
    
  }

  ngOnInit() {

    this.TODAY_DATE = new Date().toLocaleDateString();
    this.TIME_STAMP = new Date().toLocaleTimeString();

    let noticeFrame:any = document.getElementById("notice");
    let noticeFrameDoc = noticeFrame.contentWindow.document;
    
    let msg = `<center><div style="color:Blue"><u><h2 >Message Board</h2></u></div>
                <div style="color:red"><p><h3>Client & Server outside Docker! MongoDB in Docker! 
                <br>Refactoring, Add loading of PDFs 
                <br>Naming convention for versions
                <br>Naming Convention for Docker images and containers
                </h3></div</center>`
    
    noticeFrameDoc.body.innerHTML = msg
 
    this.IFRAME = document.getElementById("aiFrame");
    //this.IFRAME = document.getElementsByTagName("iframe")[0];
    this.iDocument = this.IFRAME.contentWindow.document;
    this.chill(1000000);
    
    this.IFRAME.contentWindow.location.replace(this.HUSNA_URL);
  }

  chill(momento) {
    this.iDocument.body.innerHTML = "<br><br><center><h1>Your Default AI Search Engine Page is Loading..</h1></center>";
    while (momento > 0) {
      momento--;
    }
  }

  check(event) {
    console.log('Radio Selected: ' + event);
    this.IFRAME.style.display = '';
    if (event) {
      //this.IFRAME.contentWindow.parent.scrollTo(0,0); // scrolls all the way UP
      //this.IFRAME.contentWindow.parent.scrollTo(0, document.body.scrollHeight);  scrolls all the way DOWN
      this.IFRAME.contentWindow.parent.scrollTo(0, 500);
      this.IFRAME.contentWindow.location.replace(this.URL_BY_RADIO_MAP.get(event));
    }
  }


}


