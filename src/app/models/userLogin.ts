export class userToken{

    constructor(
        public document: number | any,
        public password: string,
        public saveUser: boolean = false
    ){}

}