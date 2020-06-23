class BigNum {
  constructor(num) {
    this.num = num.toString().split("");
  }

  get length() {
    return this.num.length;
  }

  sum(num) {
    if (!this.num.length || !num.length) {
      return this.num.length ? this : new BigNum(num);
    }
    const isThisBigger = this.num.length > num.length;
    const A = isThisBigger ? this.num : num.num;
    const B = [
      ..."0".repeat(Math.abs(this.num.length - num.length)).split(""),
      ...(isThisBigger ? num.num : this.num),
    ];
    const result = [];
    let add = 0;
    for (let i = A.length - 1; i >= 0; i--) {
      const res = +A[i] + +B[i] + add;
      add = ~~(res / 10);
      result.push(res % 10);
    }
    if (add > 0) result.push(add);
    return new BigNum(result.reverse().join(""));
  }

  subtract(num) {
    if (!this.num.length || !num.length) {
      return this.num.length ? this : new BigNum(num);
    }
    const A = [...this.num];
    const B = [
      ..."0".repeat(Math.abs(this.num.length - num.length)).split(""),
      ...num.num,
    ];
    const result = [];
    for (let i = A.length - 1; i >= 0; i--) {
      let first = +A[i],
        second = +B[i];
      if (first < second) {
        let counter = i - 1;
        while (+A[counter] === 0) {
          A[counter--] = "9";
        }
        if (+A[counter] > 0) {
          A[counter] = A[counter] - 1 + "";
        }
        first += 10;
      }
      const res = first - second;
      result.push(res % 10);
    }
    return new BigNum(result.reverse().join(""));
  }

  multiply(num) {
    if (!this.num.length || !num.length) {
      return this.num.length ? this : new BigNum(num);
    }
    const isThisBigger = this.num.length > num.length;
    const A = (isThisBigger ? this : num).num;
    const B = (isThisBigger ? num : this).num;
    const results = "0"
      .repeat(B.length)
      .split("")
      .map((x) => []);
    let result = new BigNum("");
    for (let i = B.length - 1; i >= 0; i--) {
      const base = +B[i];
      let add = 0;
      for (let j = A.length - 1; j >= 0; j--) {
        const res = +A[j] * base + add;
        add = ~~(res / 10);
        results[i].push(res % 10);
      }
      if (add > 0) results[i].push(add);
    }
    for (let k = 0; k < results.length; k++) {
      result = result.sum(
        new BigNum(
          results[k].reverse().join("") + "0".repeat(results.length - k - 1)
        )
      );
    }
    return result;
  }

  toString() {
    return this.num.join("");
  }
}
