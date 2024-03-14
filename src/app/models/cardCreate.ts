export class CardCreate{

    constructor(
        public title: string,
        public desc: string | any,
        public type: string | any,
        public duration: number | any,
        public stars: number | any
    ){}

}