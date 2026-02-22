const activeBank:string="Big Bank INC";

export class BankAccountDetails
{
    bankName:string=activeBank;
    limit:number=-2000;
    constructor(public owner :string, public addr:string, public gender:string,public tz:number ){}
    toString=():string=>{ 
        return `Account of: ${(this.gender.toLowerCase()[0]=='m')?"Mr.":"Mrs."} ${this.owner} ${this.tz} @ ${this.bankName}`;
     }
}


