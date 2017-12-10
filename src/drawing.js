let DnaDrawing = class {
    constructor(config) {
      this.config = config;
      this.polygons = [];
      this._dirty = false;
    }
  
    set dirty(val) {
      this._dirty = val;
    }
  
    get dirty() {
      return this._dirty;
    }
  
    get totalPoints() {
      let total = 0;
      for (let polygon of this.polygons) {
        total += polygon.points.length;
      }
      return total;
    }
    
    clone() {
      let newDrawing = new DnaDrawing(this.config);
      for (let polygon of this.polygons) {
        let clonedPolygon = polygon.clone();
        clonedPolygon.parent = newDrawing;
        newDrawing.polygons.push(clonedPolygon);
      }
      return newDrawing;
    }
  
    init() {
      for (let i = 0; i < config.drawing.PolygonsMin; i++) {
        this.addPolygon();
      }
      this.dirty = true;
    }
  
    addPolygon() {
      if (this.polygons.length < this.config.drawing.PolygonsMax) {
        let newPolygon = new DnaPolygon(this.config, this);
        newPolygon.init();
        this.polygons.push(newPolygon);
        this.dirty = true;
        //console.log("drawing add polygon -> " + this.polygons.length);
      }
    }
  
    removePolygon() {
      let len = this.polygons.length;
      //console.log("drawing polygons len " + len);
      if (len > this.config.drawing.PolygonsMin) {
        let index = getRandomInt(0, len);
        this.polygons.splice(index, 1);
        this.dirty = true;
        //console.log("drawing remove polygon -> " + this.polygons.length);
      }
    }
  
    mutate() {
      if (willMutate(this.config.drawing.AddPolygonMutationRate)) {
        this.addPolygon();
      }
  
      if (willMutate(this.config.drawing.RemovePolygonMutationRate)) {
        this.removePolygon();
      }
  
      for (let polygon of this.polygons) {
        polygon.mutate();
      }
    }
  
    render(cnvs) {
      cnvs.background(255);
      for (let polygon of this.polygons) {
        polygon.render(cnvs);
      }
    }
  }