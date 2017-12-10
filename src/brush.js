let DnaBrush = class {
    constructor(config, parent) {
      this.config = config;
      this._parent = parent;
      this._r = 0;
      this._g = 0;
      this._b = 0;
      this._a = 0;
    }
   
    set parent(val) {
      this._parent = val;
    }

    get parent() {
      return this._parent;
    }
  
    set r(val) {
      this._r = val;
    }
  
    set g(val) {
      this._g = val;
    }
  
    set b(val) {
      this._b = val;
    }
  
    set a(val) {
      this._a = val;
    }
  
    get color() {
      return color(this._r, this._g, this._b, this._a);
    }
  
    clone() {
      let clone = new DnaBrush(this.config, this._parent);
      clone.r = this._r;
      clone.g = this._g;
      clone.b = this._b;
      clone.a = this._a;
      return clone;
    }
  
    mutate() {
      if (willMutate(this.config.brush.RedMutationRate)) {
        this._r = random(config.brush.RedRangeMin, config.brush.RedRangeMax);
        this._parent.dirty = true;
        //console.log("brush red");
      }
  
      if (willMutate(this.config.brush.GreenMutationRate)) {
        this._g = random(config.brush.GreenRangeMin, config.brush.GreenRangeMax);
        this._parent.dirty = true;
        //console.log("brush green");
      }
  
      if (willMutate(this.config.brush.BlueMutationRate)) {
        this._b = random(config.brush.BlueRangeMin, config.brush.BlueRangeMax);
        this._parent.dirty = true;
        //console.log("brush blue");
      }
  
      if (willMutate(this.config.brush.AlphaMutationRate)) {
        this._a = random(config.brush.AlphaRangeMin, config.brush.AlphaRangeMax);
        this._parent.dirty = true;
        //console.log("brush alpha");
      }
    }
  }