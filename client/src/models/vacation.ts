export class Vacation {
    public constructor(
        public id: number = 0,
        public description: string = "",
        public destination: string = "",
        public image: string = "",
        public start: string = "",
        public end: string = "",
        public price: number = 0,
        public followed: boolean = false,
    ) { }
}