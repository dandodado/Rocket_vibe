// 우주선 클래스
class Ship {
  constructor(x, y, w, h) {
    this.pos = createVector(x, y); // 위치
    this.vel = createVector(0, 0); // 속도
    this.acc = createVector(0, 0); // 가속도
    this.angle = 0; // 회전 각도
    this.angularVel = 0; // 각속도
    this.angularAcc = 0; // 각가속도
    this.w = w; // 너비
    this.h = h; // 높이
    this.thrusterForce = 0.1; // 추진체 힘 크기
    this.rotationForce = 0.005; // 회전 힘 크기
    this.maxSpeed = 5; // 최대 속도
    this.damping = 0.98; // 공기 저항 (마찰)
    this.angularDamping = 0.95; // 각운동 마찰
  }

  applyForce(force) {
    this.acc.add(force); // 힘을 가속도에 더함
  }

  applyTorque(torque) {
    this.angularAcc += torque; // 토크를 각가속도에 더함
  }

  // 왼쪽 추진체 작동
  applyForceLeftThruster() {
    let force = p5.Vector.fromAngle(this.angle - HALF_PI); // 우주선 방향으로 위로 향하는 힘
    force.mult(this.thrusterForce);
    this.applyForce(force);

    // 오른쪽으로 회전하는 토크 적용
    this.applyTorque(this.rotationForce);
  }

  // 오른쪽 추진체 작동
  applyForceRightThruster() {
    let force = p5.Vector.fromAngle(this.angle - HALF_PI); // 우주선 방향으로 위로 향하는 힘
    force.mult(this.thrusterForce);
    this.applyForce(force);

    // 왼쪽으로 회전하는 토크 적용
    this.applyTorque(-this.rotationForce);
  }

  update() {
    this.vel.add(this.acc); // 속도에 가속도 더함
    this.vel.mult(this.damping); // 속도 감쇠 (마찰)
    this.vel.limit(this.maxSpeed); // 속도 제한
    this.pos.add(this.vel); // 위치에 속도 더함

    this.angularVel += this.angularAcc; // 각속도에 각가속도 더함
    this.angularVel *= this.angularDamping; // 각속도 감쇠
    this.angle += this.angularVel; // 각도에 각속도 더함

    this.acc.mult(0); // 가속도 초기화
    this.angularAcc = 0; // 각가속도 초기화
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);

    // 몸체 (사각형)
    rectMode(CENTER);
    fill(150, 150, 150);
    stroke(200);
    strokeWeight(2);
    rect(0, 0, this.w, this.h);

    // 왼쪽 추진체
    fill(100, 100, 100);
    rect(-this.w / 2 - 10, 0, 20, this.h / 1.5);
    triangle(
      -this.w / 2 - 10, -this.h / 3,
      -this.w / 2 - 10, this.h / 3,
      -this.w / 2 - 25, 0
    );

    // 오른쪽 추진체
    fill(100, 100, 100);
    rect(this.w / 2 + 10, 0, 20, this.h / 1.5);
    triangle(
      this.w / 2 + 10, -this.h / 3,
      this.w / 2 + 10, this.h / 3,
      this.w / 2 + 25, 0
    );

    // 조종석 또는 창문
    fill(50, 50, 100);
    ellipse(0, -this.h / 4, this.w / 3, this.h / 3);


    pop();
  }
}