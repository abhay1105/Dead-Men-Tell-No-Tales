class Flag {
    constructor(image, x, y) {
        this.image = image;
        this.x = x;
        this.y = y;
    }
    show() {
        image(image, this.x, this.y);
    }
}
