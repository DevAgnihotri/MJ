/*
 * Kontra.js v4.0.1 (Custom Build on 2018-08-21) | MIT
 * Build: https://straker.github.io/kontra/download?files=gameLoop+keyboard+sprite+store
 * Modified to use ES modules
 */

// Create the global kontra object
window.kontra = window.kontra || {
  init(t) {
    var n = this.canvas = document.getElementById(t) || t || document.querySelector("canvas");
    this.context = n.getContext("2d");
  },
  _noop: new Function,
  _tick: new Function
};

// Game loop implementation
window.kontra.gameLoop = function(e) {
  let t, n, a, r, o = (e = e || {}).fps || 60, i = 0, p = 1e3 / o, c = 1 / o,
    s = !1 === e.clearCanvas ? window.kontra._noop : function() {
      window.kontra.context.clearRect(0, 0, window.kontra.canvas.width, window.kontra.canvas.height)
    };

  function d() {
    if (n = requestAnimationFrame(d), a = performance.now(), r = a - t, t = a, !(r > 1e3)) {
      for (window.kontra._tick(), i += r; i >= p;) m.update(c), i -= p;
      s(), m.render()
    }
  }

  let m = {
    update: e.update,
    render: e.render,
    isStopped: !0,
    start() {
      t = performance.now(), this.isStopped = !1, requestAnimationFrame(d)
    },
    stop() {
      this.isStopped = !0, cancelAnimationFrame(n)
    }
  };
  
  return m
};

// Keyboard implementation
!function(){
  let n = {}, t = {}, e = {
    13:"enter", 27:"esc", 32:"space", 37:"left", 38:"up", 39:"right", 40:"down"
  };
  
  for (let n = 0; n < 26; n++) e[65 + n] = (10 + n).toString(36);
  for (let i = 0; i < 10; i++) e[48 + i] = "" + i;
  
  addEventListener("keydown", function(i) {
    let c = e[i.which];
    t[c] = !0, n[c] && n[c](i)
  });
  
  addEventListener("keyup", function(n) {
    t[e[n.which]] = !1
  });
  
  addEventListener("blur", function() {
    t = {}
  });
  
  window.kontra.keys = {
    bind(t, e) {
      [].concat(t).map(function(t) {
        n[t] = e
      })
    },
    unbind(t, e) {
      [].concat(t).map(function(t) {
        n[t] = e
      })
    },
    pressed: n => !!t[n]
  }
}();

// Sprite implementation
!function(){
  class t {
    constructor(t, i) {
      this._x = t || 0, this._y = i || 0
    }
    
    add(t, i) {
      this.x += (t.x || 0) * (i || 1), this.y += (t.y || 0) * (i || 1)
    }
    
    clamp(t, i, h, s) {
      this._c = !0, this._a = t, this._b = i, this._d = h, this._e = s
    }
    
    get x() {
      return this._x
    }
    
    get y() {
      return this._y
    }
    
    set x(t) {
      this._x = this._c ? Math.min(Math.max(this._a, t), this._d) : t
    }
    
    set y(t) {
      this._y = this._c ? Math.min(Math.max(this._b, t), this._e) : t
    }
  }
  
  window.kontra.vector = ((i, h) => new t(i, h)), window.kontra.vector.prototype = t.prototype;
  
  class i {
    init(t, i, h, s) {
      for (i in t = t || {}, 
        this.position = window.kontra.vector(t.x, t.y), 
        this.velocity = window.kontra.vector(t.dx, t.dy), 
        this.acceleration = window.kontra.vector(t.ddx, t.ddy), 
        this.width = this.height = 0, 
        this.context = window.kontra.context, 
      t) this[i] = t[i];
      
      if (h = t.image) this.image = h, this.width = h.width, this.height = h.height;
      else if (h = t.animations) {
        for (i in h) this.animations[i] = h[i].clone(), s = s || h[i];
        this._ca = s, this.width = s.width, this.height = s.height
      }
      
      return this
    }
    
    get x() {
      return this.position.x
    }
    
    get y() {
      return this.position.y
    }
    
    get dx() {
      return this.velocity.x
    }
    
    get dy() {
      return this.velocity.y
    }
    
    get ddx() {
      return this.acceleration.x
    }
    
    get ddy() {
      return this.acceleration.y
    }
    
    set x(t) {
      this.position.x = t
    }
    
    set y(t) {
      this.position.y = t
    }
    
    set dx(t) {
      this.velocity.x = t
    }
    
    set dy(t) {
      this.velocity.y = t
    }
    
    set ddx(t) {
      this.acceleration.x = t
    }
    
    set ddy(t) {
      this.acceleration.y = t
    }
    
    isAlive() {
      return this.ttl > 0
    }
    
    collidesWith(t) {
      return this.x < t.x + t.width && 
             this.x + this.width > t.x && 
             this.y < t.y + t.height && 
             this.y + this.height > t.y
    }
    
    update(t) {
      this.advance(t)
    }
    
    render() {
      this.draw()
    }
    
    playAnimation(t) {
      this._ca = this.animations[t], this._ca.loop || this._ca.reset()
    }
    
    advance(t) {
      this.velocity.add(this.acceleration, t), 
      this.position.add(this.velocity, t), 
      this.ttl--, this._ca && this._ca.update(t)
    }
    
    draw() {
      this.image ? 
        this.context.drawImage(this.image, this.x, this.y) : 
        this._ca ? 
          this._ca.render(this) : 
          (this.context.fillStyle = this.color, 
          this.context.fillRect(this.x, this.y, this.width, this.height))
    }
  }
  
  window.kontra.sprite = (t => (new i).init(t)), window.kontra.sprite.prototype = i.prototype
}();

// Store implementation
window.kontra.store = {
  set(t, e) {
    void 0 === e ? localStorage.removeItem(t) : localStorage.setItem(t, JSON.stringify(e))
  },
  get(t) {
    let e = localStorage.getItem(t);
    try {
      e = JSON.parse(e)
    } catch(t) {}
    return e
  }
};
