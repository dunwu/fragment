(function (jQuery) {

  jQuery.fn.starfieldTagCloud = function (options) {
    // PRIVATE VARIABLES
    var defaults = {
      interval: 50,             // interval between animation frames
      xPos: .5,                // x pos of where our tags 'fall' from
      yPos: .5,                // y pos of where our tags 'fall' from
      gravity: -10,            // force of gravity acting to drag items towards the screen - changing negive / positive changes direction of the 'fall'
      hoverGravityFactor: -1,   // gravity amount when user hovers over the tag cloud - works a multiplier of opts.gravity
      gravityVector: [0, 0, 1],   // 3D vector direction of gravity
      range: [-200, 300]         // range to fall between - the lower the number the closer to the screen
    };

    var opts = jQuery.extend(defaults, options);

    var particles = [];
    var springs = [];

    var starField3D = function (scene, camera, width, height) {
      var i, p1, p2, dt = 0.1;

      var this3D = this;

      function renderParticles() {
        particles = jQuery.particlePhysics.updateParticles(particles, jQuery.particlePhysics.physical, springs, dt, 1);

        this3D.pointsArray.length = 0;

        for (i = 0; i < particles.length; i++) {
          // Display a particle at particles[i].p

          // if out of z-range stick it back at the other end
          if (particles[i].p.z < opts.range[0]) {
            randomize2DPos(particles[i], width, height);
            particles[i].p.z = opts.range[1];
          }

          if (particles[i].p.z > opts.range[1]) {
            randomize2DPos(particles[i], width, height);
            particles[i].p.z = opts.range[0];
          }

          this3D.pointsArray.push(this3D.make3DPoint(particles[i].p.x, particles[i].p.y, particles[i].p.z));
        }

        scene.renderCamera(camera);
      }

      renderParticles();
      window.setInterval(renderParticles, opts.interval);
    };


    starField3D.prototype = new jQuery.engine3D.displayObject3D();

    return this.each(function () {

      jQuery.particlePhysics.setGravityVector(opts.gravityVector[0], opts.gravityVector[1], opts.gravityVector[2]);

      jQuery.particlePhysics.setGravity(opts.gravity);

      var jCloud = jQuery(this);

      jCloud.mouseover(function () {
        jQuery.particlePhysics.setGravity(opts.gravity * opts.hoverGravityFactor);
      });

      jCloud.mouseout(function () {
        jQuery.particlePhysics.setGravity(opts.gravity);
      });

      var jCloudItems = jCloud.find('li');

      jCloud.css({
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        position: 'relative'
      });

      jCloud.wrapInner('<div />');

      jCloud.find('ul').css({padding: 0, margin: 0, 'list-style': 'none'});

      jCloud.find('>div').css({
        top: (opts.yPos * 100) + '%',
        left: (opts.xPos * 100) + '%',
        position: 'relative',
        margin: 0,
        padding: 0,
        width: 0,
        height: 0,
        overflow: 'visible'
      });

      jCloudItems.css({
        position: 'relative',
        overflow: 'visible',
        display: 'block',
        margin: 0,
        padding: 0,
        position: 'absolute'
      });

      jCloudItems.wrapInner('<div />');

      var jCloudItemDivs = jCloudItems.find('>div');


      jCloudItemDivs.css({
        'white-space': 'nowrap',
        margin: 0,
        padding: 0
      });

      setupParticles(jCloudItems, jCloud.width(), jCloud.height(), opts.range);


      var scene = new jQuery.engine3D.scene3D();

      var camera = new jQuery.engine3D.camera3D();
      camera.init(0, 0, 0, 300);

      var item = new jQuery.engine3D.object3D(jCloud);

      var starField3DObj = new starField3D(scene, camera, jCloud.width(), jCloud.height());

      item.addChild(starField3DObj);

      scene.addToScene(item);
      scene.renderCamera(camera);

    });

    function setupParticles(jParticles, xRange, yRange, zRange) {
      var i;

      particles = [];
      springs = [];

      jParticles.each(function (i) {
        particles[i] = {m: 1, fixed: false, v: {x: 0, y: 0, z: 0}, p: {}};

        randomize2DPos(particles[i], xRange, yRange);
        particles[i].p.z = ((zRange[1] - zRange[0]) * Math.random()) - ((zRange[0] + zRange[1]) / 2);
      });
    }

    function randomize2DPos(particle, xRange, yRange) {
      particle.p.x = (xRange * Math.random()) - (xRange / 2);
      particle.p.y = (yRange * Math.random()) - (yRange / 2);
    }
  };

})(jQuery);