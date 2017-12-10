let DnaPolygon = class {
    constructor(config, parent) {
      this.config = config;
      this._parent = parent;
  
      this.brush = new DnaBrush(this.config, this._parent);
      this.points = [];
    }
  
    set parent(val) {
      this._parent = val;
      // Update parent of child elements (brush and points)
      this.brush.parent = val;
      for (let point of this.points) {
        point.parent = val;
      }
    }
  
    get parent() {
      return this._parent;
    }

    init() {
      this.brush.r = random(this.config.brush.RedRangeMin, this.config.brush.RedRangeMax);
      this.brush.g = random(this.config.brush.GreenRangeMin, this.config.brush.GreenRangeMax);
      this.brush.b = random(this.config.brush.BlueRangeMin, this.config.brush.BlueRangeMax);
      this.brush.a = random(this.config.brush.AlphaRangeMin, this.config.brush.AlphaRangeMax);
  
      origin = {x: random(0, img.width), y: random(0, img.height)};

      for (let i = 0; i < this.config.polygon.PointsPerPolygonMin; i++) {
        point = new DnaPoint(this.config, this._parent);
        point.x = min(max(0, origin.x + random(-30, 30)), img.width);
        point.y = min(max(0, origin.y + random(-30, 30)), img.height);
        this.points.push(point);
      }
    }

    clone() {
      let clone = new DnaPolygon(this.config, this.parent);
      clone.brush = this.brush.clone();
      for (let p of this.points) {
        clone.points.push(p.clone());
      }
      return clone;
    }
  
    mutate() {
      if (willMutate(this.config.polygon.AddPointMutationRate)) {
        this.addPoint();
      }
      if (willMutate(this.config.polygon.RemovePointMutationRate)) {
        this.removePoint();
      }
  
      this.brush.mutate();
      for (let point of this.points) {
        point.mutate();
      }
    }
  
    addPoint() {
      if (this.points.length < this.config.polygon.PointsPerPolygonMax) {
        if (this.parent.totalPoints < this.config.drawing.PointsMax) {
          let newPoint = new DnaPoint(this.config, this._parent);
          let index = getRandomInt(1, this.points.length-1);
  
          let prev = this.points[index-1];
          let next = this.points[index];
  
          newPoint.x = (prev.x + next.x)/2;
          newPoint.y = (prev.y + next.y)/2;
          this.points.splice(index, 0, newPoint);
          this.parent.dirty = true;
          //console.log("polygon add point");
        }
      }
    }
  
    removePoint() {
      if (this.points.length > this.config.polygon.PointsPerPolygonMin) {                  
        if (this.parent.totalPoints > this.config.drawing.PointsMin) {          
          let index = getRandomInt(0, this.points.length);
          this.points.splice(index, 1);
          this.parent.dirty = true;
          //console.log("polygon remove point");
        }
      }
    }
  
    toString() {
      return `Polygon{points: ${this.points}}`
    }
  
    render(cnvs) {
      cnvs.push();
      cnvs.fill(this.brush.color);
      cnvs.noStroke();
      cnvs.beginShape();
      for (let p of this.points) {
        cnvs.vertex(p.x, p.y);
      }
      cnvs.endShape(CLOSE);
      cnvs.pop();
    }
  }