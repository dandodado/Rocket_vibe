// 추진체 불꽃 입자 클래스
class Particle {
  constructor(x, y, side) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-0.5, 0.5) * side, random(1, 3)); // 아래로 퍼지는 불꽃
    this.acc = createVector(0, 0.05); // 중력과 비슷한 아래 방향 가속도
    this.lifespan = 255; // 투명도로 수명 표현
    this.col = color(255, 100, 0, this.lifespan); // 주황색 불꽃
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifespan -= 5; // 수명 감소
    this.col = color(255, random(50, 150), 0, this.lifespan); // 색상 업데이트
  }

  display() {
    noStroke();
    fill(this.col);
    ellipse(this.pos.x, this.pos.y, random(4, 8), random(4, 8)); // 크기가 변하는 불꽃 입자
  }

  isFinished() {
    return this.lifespan < 0; // 수명이 다했는지 확인
  }
}