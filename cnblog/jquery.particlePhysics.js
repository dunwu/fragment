(function (jQuery) {

  jQuery.particlePhysics = {};

  var gravityVector = {x: 0, y: 0, z: -1};

  jQuery.particlePhysics.setGravityVector = function (x, y, z) {
    gravityVector.x = x;
    gravityVector.y = y;
    gravityVector.z = z;
  };

  jQuery.particlePhysics.calculateForces = function (particles, phys, springs) {
    var i, p1, p2, len, dx, dy, dz;
    ;
    var down = gravityVector;
    var zero = {x: 0, y: 0, z: 0};
    var f = {};

    for (i = 0; i < particles.length; i++) {
      particles[i].f = zero;

      if (particles[i].fixed)
        continue;

      /* Gravitation */
      particles[i].f.x += phys.gravitational * particles[i].m * down.x;
      particles[i].f.y += phys.gravitational * particles[i].m * down.y;
      particles[i].f.z += phys.gravitational * particles[i].m * down.z;

      /* Viscous drag */
      particles[i].f.x -= phys.viscousdrag * particles[i].v.x;
      particles[i].f.y -= phys.viscousdrag * particles[i].v.y;
      particles[i].f.z -= phys.viscousdrag * particles[i].v.z;
    }

    /* Handle the spring interaction */
    for (i = 0; i < springs.length; i++) {
      p1 = springs[i].from;
      p2 = springs[i].to;
      dx = particles[p1].p.x - particles[p2].p.x;
      dy = particles[p1].p.y - particles[p2].p.y;
      dz = particles[p1].p.z - particles[p2].p.z;

      // get the length of the spring
      len = Math.sqrt((dx * dx) + (dy * dy) + (dz * dz));

      f.x = springs[i].springconstant * (len - springs[i].restlength);
      f.x += springs[i].dampingconstant * (particles[p1].v.x - particles[p2].v.x) * dx / len;
      f.x *= -(dx / len);
      f.y = springs[i].springconstant * (len - springs[i].restlength);
      f.y += springs[i].dampingconstant * (particles[p1].v.y - particles[p2].v.y) * dy / len;
      f.y *= -(dy / len);
      f.z = springs[i].springconstant * (len - springs[i].restlength);
      f.z += springs[i].dampingconstant * (particles[p1].v.z - particles[p2].v.z) * dz / len;
      f.z *= -(dz / len);

      if (!particles[p1].fixed) {
        particles[p1].f.x += f.x;
        particles[p1].f.y += f.y;
        particles[p1].f.z += f.z;
      }

      if (!particles[p2].fixed) {
        particles[p2].f.x -= f.x;
        particles[p2].f.y -= f.y;
        particles[p2].f.z -= f.z;
      }
    }

    return particles;
  };

  /*
     Perform one step of the solver
  */
  jQuery.particlePhysics.updateParticles = function (
    particles,
    phys,
    springs,
    dt,
    method) {
    var i;
    var ptmp = [];
    var deriv = [];

    particles = jQuery.particlePhysics.calculateForces(particles, phys, springs);

    deriv = jQuery.particlePhysics.calculateDerivatives(particles);

    switch (method) {
      case 0:										// Euler

        for (i = 0; i < particles.length; i++) {
          particles[i].p.x += deriv[i].dpdt.x * dt;
          particles[i].p.y += deriv[i].dpdt.y * dt;
          particles[i].p.z += deriv[i].dpdt.z * dt;
          particles[i].v.x += deriv[i].dvdt.x * dt;
          particles[i].v.y += deriv[i].dvdt.y * dt;
          particles[i].v.z += deriv[i].dvdt.z * dt;
        }
        break;

      case 1:										// Midpoint

        ptmp = [];

        for (i = 0; i < particles.length; i++) {
          ptmp[i] = particles[i];

          ptmp[i].p.x += deriv[i].dpdt.x * dt / 2;
          ptmp[i].p.y += deriv[i].dpdt.y * dt / 2;
          ptmp[i].p.z += deriv[i].dpdt.z * dt / 2;
          ptmp[i].p.x += deriv[i].dvdt.x * dt / 2;
          ptmp[i].p.y += deriv[i].dvdt.y * dt / 2;
          ptmp[i].p.z += deriv[i].dvdt.z * dt / 2;
        }

        ptmp = jQuery.particlePhysics.calculateForces(ptmp, phys, springs);
        deriv = jQuery.particlePhysics.calculateDerivatives(ptmp);

        for (i = 0; i < particles.length; i++) {
          particles[i].p.x += deriv[i].dpdt.x * dt;
          particles[i].p.y += deriv[i].dpdt.y * dt;
          particles[i].p.z += deriv[i].dpdt.z * dt;
          particles[i].v.x += deriv[i].dvdt.x * dt;
          particles[i].v.y += deriv[i].dvdt.y * dt;
          particles[i].v.z += deriv[i].dvdt.z * dt;
        }


        break;
    }

    return particles;
  };

  /*
     Calculate the derivatives
     dp/dt = v
     dv/dt = f / m
  */
  jQuery.particlePhysics.calculateDerivatives = function (particles) {
    var i;
    var derivatives = [];

    for (i = 0; i < particles.length; i++) {
      derivatives[i] = {};
      derivatives[i].dpdt = {};
      derivatives[i].dvdt = {};

      derivatives[i].dpdt.x = particles[i].v.x;
      derivatives[i].dpdt.y = particles[i].v.y;
      derivatives[i].dpdt.z = particles[i].v.z;

      derivatives[i].dvdt.x = particles[i].f.x / particles[i].m;
      derivatives[i].dvdt.y = particles[i].f.y / particles[i].m;
      derivatives[i].dvdt.z = particles[i].f.z / particles[i].m;
    }

    return derivatives;
  };

  jQuery.particlePhysics.setGravity = function (val) {
    jQuery.particlePhysics.physical.gravitational = val;
  };

  jQuery.particlePhysics.particles = [];
  jQuery.particlePhysics.springs = [];
  jQuery.particlePhysics.physical = {gravitational: 10, viscousdrag: 0.1};

})(jQuery);