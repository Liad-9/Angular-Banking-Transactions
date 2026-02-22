export enum TransactionType {openAccount,deposit,withdraw}
export class BankTransaction {
    constructor(public amount:number,public trnDate:Date=new Date(),asmachta:string,public trnType:TransactionType=TransactionType.deposit,public balance: number){}
    toString=()=>`on ${this.trnDate.toDateString()} a ${TransactionType[this.trnType]} of ${this.amount} NIS`;
}
//let t2:BankTransaction = new BankTransaction(1000,undefined,"opening",TransactionType.openAccount);
//console.log(t2.toString());
