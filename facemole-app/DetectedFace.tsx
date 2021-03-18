
export default class DetectedFace{
    ID: string;
    x: number;
    y: number;
    height: number;
    width: number;
    givenName: string;

    constructor(ID: string, givenName: string, x: number, y: number, height: number, width: number){
        this.ID = ID;
        this.givenName = givenName;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
}