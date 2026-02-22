import { Component, Output } from '@angular/core';
import { BankAccountDetails } from './bank-account-details';
import { TransactionType, BankTransaction } from './bank-transaction'
import { UserCredentials } from './user-credentials';
import * as CryptoJS from 'crypto-js';
const SALT: string = "BIU35816isתשפד";
const USER_CREDENTIALS_KY: string = "USER_CREDENTIALS ";
const TRANSACTIONS_KEY: string = "TRANSACTIONS";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 presenterName: string = "ליעד סמרה";

  transaction?: BankTransaction = undefined;
  accountDetails: BankAccountDetails;
  currentAmount: number = 0;
  currentBalance: number = 0;
  currentTransactionType: number = -1;
  currentTransactionAsmachta: string = "";
  currentTransactionDateS: string = "";
  transactionTypeNames: string[] = [];
  lastActionFail: boolean = false;
  currentDiv: number = 0; 

  transactions: BankTransaction[] = []; 
  showAllTransactions: boolean = false;

  userLoginOk: boolean = false;
  typedUserCredentils: UserCredentials = new UserCredentials();
  defaultUserCredentils: UserCredentials = new UserCredentials("ploni", this.encrptPwd("123456")); 
  // לאחר שינוי סיסמא - 654321
  // plonit
  crntPwd: string = "";
  nwPwd: string = "";
  renwPwd: string = "";

  constructor() {
    this.accountDetails = new BankAccountDetails("plonit almonit", "ta", "female", 129387465);
    for (let typename in TransactionType)
      if (isNaN(Number(typename)))
        this.transactionTypeNames.push(typename);

    this.loadInitUserCredentialsData();
    this.loadTransactions(); 
  }

  changePwd() {
    let noproblem: boolean = false;

    if (this.encrptPwd(this.crntPwd.trim()) != this.defaultUserCredentils.pwd) 
    {
      alert("סיסמא נוכחית שגויה");
      return;
    }
    if (this.nwPwd.trim() != this.renwPwd.trim()) 
    {
      alert(" סיסמא מבוקשת שונה ממבוקשת שוב ");
      return;
    }
    if (this.encrptPwd(this.nwPwd.trim()) == this.defaultUserCredentils.pwd) 
    {
      alert("סיסמא מבוקשת חייבת להיות שונה מנוכחית ");
      return;
    }
    if (this.nwPwd.trim().length < 6) 
    {
      alert("סיסמא מבוקשת קצרה מדי חובה לפחות 6 תווים ");
      return;
    }
    noproblem = true; 
    if (noproblem) {
      this.defaultUserCredentils.pwd = this.encrptPwd(this.nwPwd.trim()); 
      this.saveUserCredentials();
      alert("החלפת סיסמא הצליחה");
      this.logOff();
    }
  }

  encrptPwd(pwd?: string): string { 
    return CryptoJS.SHA3(pwd + SALT, { outputLength: 512 }).toString();
  }

  saveUserCredentials() {
    localStorage.setItem(USER_CREDENTIALS_KY, JSON.stringify(this.defaultUserCredentils));
  }

  cngPwd() {
    this.currentDiv = 2;
  }

  loadInitUserCredentialsData() {
    let rdFromLocalStrg = localStorage.getItem(USER_CREDENTIALS_KY);
    if (rdFromLocalStrg == null) 
      this.saveUserCredentials();
    else {
      try {
        this.defaultUserCredentils = JSON.parse(rdFromLocalStrg); 
      }
      catch {
        this.saveUserCredentials(); 
      }
    }
  }
  toString = (): string => {
    let ezer: string = `${this.transaction} into ${this.accountDetails}`;
    return ezer;
  }
  //toString():string{
  //  return this.title;
  // }
  logIn() {
    console.log(`before enc:${this.typedUserCredentils.pwd}`);
    if (this.typedUserCredentils.eml == this.defaultUserCredentils.eml && this.encrptPwd(this.typedUserCredentils.pwd) == this.defaultUserCredentils.pwd) {
      console.log(`after enc:${this.encrptPwd(this.typedUserCredentils.pwd)}`);
      //this.userLoginOk = true;
      this.currentDiv = 1;
    }
    else
      alert(" שם המשתמש או הסיסמא או הצירוף שגוי")
  }
  logOff() {
    this.currentDiv = 0; 
  }

  clrUsrLoginFlds() {
    this.typedUserCredentils.eml = "";
    this.typedUserCredentils.pwd = "";
  }

  saveAsUser() {
    this.typedUserCredentils.eml = this.typedUserCredentils.eml?.trim();
    this.typedUserCredentils.pwd = this.typedUserCredentils.pwd?.trim();

    if (!this.typedUserCredentils.eml || this.typedUserCredentils.eml.length < 6 || !this.typedUserCredentils.pwd || this.typedUserCredentils.pwd.length < 6) {
      alert("שם משתמש וסיסמא צריכים להיות לפחות שישה תווים");
      return;
    }

    if (this.typedUserCredentils.eml === this.defaultUserCredentils.eml) {
      this.logIn();
    }
    else {
      this.defaultUserCredentils.eml = this.typedUserCredentils.eml;
      this.defaultUserCredentils.pwd = this.encrptPwd(this.typedUserCredentils.pwd);
      this.saveUserCredentials();
      alert("יצירת המשתמש הצליחה");
      this.logIn();
    }
  }

  doTransaction(): void {
    

    this.lastActionFail = false; 
    const currentDate = new Date();
    const transactionDate = new Date(this.currentTransactionDateS);
    const lastTransactionDate = this.transactions.length > 0 ? this.transactions[this.transactions.length - 1].trnDate : null;

    if (
      isNaN(transactionDate.getTime()) || 
      transactionDate > currentDate ||     
      (lastTransactionDate && transactionDate < lastTransactionDate) 
    ) {
      alert("תאריך פעולה לא חוקי. נא להזין תאריך הקטן או שווה לתאריך הנוכחי וכן גדול או שווה לתאריך העסקה האחרונה");
      return;
    }

    if (this.currentAmount < 0) {
      alert("סכום לא חוקי. צריך להיות מעל או שווה לאפס");
      return;
    }

    if (this.currentTransactionType === -1) {
      alert("נא לבחור סוג פעולה");
      return;
    }

    if (this.currentAmount === null) {
      alert("נא להכניס סכום כסף");
      return;
    }

    switch (this.currentTransactionType * 1) {
      case TransactionType.deposit:
        this.currentBalance += this.currentAmount;
        break;
      case TransactionType.withdraw:
        if (this.currentBalance - this.currentAmount < this.accountDetails.limit) {
          this.lastActionFail = true;
          return;
        }
        else
          this.currentBalance -= this.currentAmount;
        break;
      case TransactionType.openAccount:
        if (this.currentAmount !== 0) {
          alert("לא ניתן לפתוח חשבון עם סכום שונה מאפס");
          return;
        }
        this.currentBalance = 0;
        break;

      default:
        alert("לא בחרת סוג פעולה");
        return;
    }
    const newTransaction = new BankTransaction(
      this.currentAmount,
      new Date(this.currentTransactionDateS),
      this.currentTransactionAsmachta,
      +this.currentTransactionType, 
      this.currentBalance
    );
    this.transactions.push(newTransaction);
    this.saveTransactions();
  }

  deleteTransaction(index: number): void {
    
      const deletedTransaction = this.transactions.splice(index, 1)[0];
      
      if (deletedTransaction.trnType === TransactionType.deposit) {
        this.currentBalance -= deletedTransaction.amount;
      } else if (deletedTransaction.trnType === TransactionType.withdraw) {
        this.currentBalance += deletedTransaction.amount;
      }
      this.saveTransactions();
    }
  

  calculateCurrentBalance(): void {
    this.currentBalance = 0; 
    for (const transaction of this.transactions) { 
      if (transaction.trnType === TransactionType.deposit) {
        this.currentBalance += transaction.amount;
      } else if (transaction.trnType === TransactionType.withdraw) {
        this.currentBalance -= transaction.amount;
      }

    }
  }
  saveTransactions(): void {
    const encryptedTransactions = CryptoJS.AES.encrypt(JSON.stringify(this.transactions), SALT).toString();
    localStorage.setItem(TRANSACTIONS_KEY, encryptedTransactions);
    localStorage.setItem('CURRENT_BALANCE', this.currentBalance.toString());
  }

  loadTransactions(): void {
    const encryptedTransactions = localStorage.getItem(TRANSACTIONS_KEY);
    if (encryptedTransactions) { 
      const decryptedTrans = CryptoJS.AES.decrypt(encryptedTransactions, SALT); 
      const decryptedData = decryptedTrans.toString(CryptoJS.enc.Utf8); 
      this.transactions = JSON.parse(decryptedData);
    }
    else {
      this.transactions = [];
    }
    this.calculateCurrentBalance();
  }

}


