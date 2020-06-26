class BigNum {
  constructor(num, negative = false) {
    this.num = num.toString().replace(/^-*0*/, '').split("");
    this.negative = negative || num[0] === '-';
  }

  get length() {
    return this.num.length;
  }

  plus(num) {
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

  minus(num) {
    if (!this.num.length || !num.length) {
      return this.num.length ? this : new BigNum(num);
    }
    const isLess = this.isLess(new BigNum(num));
    let A = [...(isLess ? num.num : this.num)];
    const B = [
      ..."0".repeat(Math.abs(this.num.length - num.length)).split(""),
      ...(isLess ? this.num : num.num),
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
    return new BigNum('-'.repeat(isLess) + result.reverse().join(""));
  }

  multiply(num) {
    if (!this.num.length || !num.length) {
      return this.num.length ? this : num;
    }
    const isNegative = (this.negative && !num.negative) || (!this.negative && num.negative);
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
      result = result.plus(
        new BigNum(
          results[k].reverse().join("") + "0".repeat(results.length - k - 1)
        )
      );
    }
    result.negative = isNegative;
    return result;
  }

  _wholeDivide(num) {
    if(num === '0') return Infinity;


  }

  divide(num) {
    let A = this.num.join('');
    let B = num.num.join('');
    if (A.length === B.length) {

    }
    let result = ['', ''], rem = '', subStart = 0, subEnd = B.length;
    let current = new BigNum(rem + A.substring(subStart, subEnd));

    if (current.isLess(num)) {
      return [new BigNum('0'), this.num];
    }
    subStart = subEnd - 1;

    const columnDiv = () => {
      const d = current.length > B.length ? current.num[0] + current.num[1] : current.num[0];
      const approx = Math.floor(+d / +B[0]);
      const near = new BigNum(B).multiply(new BigNum(approx));
      let div = current.isLess(near) ? approx - 1 : approx;
      // TODO: might be a problem
      // if (current.isEqual(near)) {
      //   div = approx;
      // } else (current.isLess(near)) {
      //   div = approx - 1;
      // }
      const rem = current.minus(
        div < approx ?
        new BigNum(current).minus(new BigNum(B).multiply(new BigNum(div))) :
        new BigNum(current).minus(near)
      ).toString();
      current = new BigNum(rem + A.substring(++subStart, ++subEnd));
    };
    columnDiv();
  }

  /**
   * true if bigger, false if less
   * @param {BigNum} num 
   */
  isBigger(num) {
    let A = [...this.num];
    let B = [...num.num];
    if (A.length < B.length) {
      return false;
    } else if (A.length > B.length) {
      return true;
    }

    let counter = 1;
    while (A[counter - 1] > B[counter - 1] && counter < A.length + 1) {
      counter++;
    }
    if (counter > 1) {
      return true;
    }
    while (A[counter - 1] < B[counter - 1] && counter < A.length + 1) {
      counter++;
    }
    if (counter > 1) {
      return false;
    }
    while (A[counter - 1] === B[counter - 1] && counter < A.length + 1) {
      counter++;
    }
    if (counter > 1) {
      return A[counter - 1] > B[counter - 1];
    }
    return false;
  }

  /**
   * true if less, false if bigger
   * @param {BigNum} num 
   */
  isLess(num) {
    let A = [...this.num];
    let B = [...num.num];
    if (A.length > B.length) {
      return false;
    } else if (A.length < B.length) {
      return true;
    }

    let counter = 1;
    while (A[counter - 1] < B[counter - 1] && counter < A.length + 1) {
      counter++;
    }
    if (counter > 1) {
      return true;
    }
    while (A[counter - 1] > B[counter - 1] && counter < A.length + 1) {
      counter++;
    }
    if (counter > 1) {
      return false;
    }
    while (A[counter - 1] === B[counter - 1] && counter < A.length + 1) {
      counter++;
    }
    if (counter > 1) {
      return A[counter - 1] < B[counter - 1];
    }
    return false;
  }

  isEqual(num) {
    let A = [...this.num];
    let B = [...num.num];
    if (A.length !== B.length) {
      return false;
    }
    return A.join('') === B.join('');
  }

  toString() {
    return '-'.repeat(this.negative) + this.num.join("");
  }
}
