let DnaPoint = class {
    constructor(config, parent) {
      this.config = config;
      this._parent = parent;
      this._x = undefined;
      this._y = undefined;
    }
  
    get parent() {
      return this._parent;
    }
  
    set parent(val) {
      this._parent = val;
    }
  
    get x() {
      return this._x;
    }
  
    set x(val) {
      this._x = val;
    }
  
    get y() {
      return this._y;
    }
  
    set y(val) {
      this._y = val;
    }
  
    clone() {
      let clone = new DnaPoint(this.config, this._parent);
      clone.parent = this._parent;
      clone.x = this._x;
      clone.y = this._y;
      return clone;
    }
  
    mutate() {
      if (willMutate(this.config.point.MovePointMaxMutationRate)) {
        this._x = random(0, img.width);
        this._y = random(0, img.height);
        this._parent.dirty = true;
        //console.log("point move max");
      }
  
      if (willMutate(this.config.point.MovePointMidMutationRate)) {
        this._x = min( max(0, this._x + random(-this.config.point.MovePointRangeMid, this.config.point.MovePointRangeMid)), img.width );
        this._y = min( max(0, this._y + random(-this.config.point.MovePointRangeMid, this.config.point.MovePointRangeMid)), img.height );
        this._parent.dirty = true;
        //console.log("point move mid");
      }
  
      if (willMutate(this.config.point.MovePointMinMutationRate)) {
        this._x = min( max(0, this._x + random(-this.config.point.MovePointRangeMin, this.config.point.MovePointRangeMin)), img.width );
        this._y = min( max(0, this._y + random(-this.config.point.MovePointRangeMin, this.config.point.MovePointRangeMin)), img.height );
        this._parent.dirty = true;
        //console.log("point move min");
      }
    }
  }