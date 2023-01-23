### TIPS Javascript

1. Che một phần của password hoặc số điện thoại

```js
function hashSDT(sdt, numberHide = 3) {
  const newSDT = sdt.slice(-numberHide);
  const hashSDT = newSDT.padStart(sdt.length, "*");
  return hashSDT;
}
console.log(hashSDT("0941017049", 3)); // *******049
```

2. Tạo một list trong khoảng thời gian nhất định

```js
function generateNumber(start, end) {
  return [...new Array(end + 1).keys()].slice(start);
}
console.log(generateNumber(2002, 2005)); // [ 2002, 2003, 2004, 2005 ]
```

3. Làm phẳng mảng đa chiều

```js
function flattenMultidimensionalArrays(arr) {
  return arr.flat(Infinity);
}
const arr = [12, 34, 12, [12, 34, 55, 222, 0, [1, 2], 3, 7, [9]]];
console.log(flattenMultidimensionalArrays(arr));
```

4. FIX lỗi `Cannot read property 'name' of undefined`

C1: Tạo một default value

```js
const found =
  [{ name: "anonystick.com" }].find((i) => i.name === "medium.com") || {};
console.log(found.name);
// undefined
```

C2: Sử dụng Optional chaining

```js
const found = [{ name: "anonystick.com" }].find((i) => i.name === "medium.com");
console.log(found?.name); // sử dụng toán tử ?.
// undefined
```

### Hoán đổi vị trí hai biến

```js
let a = "Hello";
let b = "Tran Tuan Dat";

[a, b] = [b, a];
console.log("a: ", a);
console.log("b: ", b);
// OUTPUT:
// a:  Tran Tuan Dat
// b:  Hello
```

### Nên suy nghĩ về vấn đề performance khi code

- Ta có đề bài như sau:

```js
const users = [
  {
    name: "Ronaldo",
    age: 23,
  },
  {
    name: "Messi",
    age: 14,
  },
  {
    name: "Anoystick",
    age: 22,
  },
];
// Hãy trả ra tên của những người có độ tuổi lớn hơn hoặc bằng 18 tuổi
```

- Đối với đề bài trên, có lập trình viên code như sau:

```js
const valid = users.filter(({ age }) => age >= 18).map(({ name }) => name);
```

=> Tuy nhiên code của ltv trên có vấn đề khi có hàng triệu records, giả sử có 5tr records và có 1tr record thỏa mãn điều kiện (>= 18 tuổi) thì code trên phải chạy tổng cộng 6 triệu lần => Hẹo

- Tối ưu như sau:

```js
const valid = [];
users.forEach(({ age, name }) => {
  if (age >= 18) valid.push(name);
});
console.log(valid);
```

- Hoặc sử dụng reduce

```js
const valid = users.reduce(({ age, name }, curr) => {
  return age >= 18 ? [...result, name] : result;
}, []);
console.log(valid);
```

### Eventloop trong nodejs

1. Một điều cần lưu ý là EventLoop trong Nodejs khác so với EventLoop trong Browser
2. Eventloop là gì?

- Eventloop là một phần quan trọng của hệ thống runtime của Node.js, nó xử lý các sự kiện và callback trong ứng dụng NodeJs của bạn. Khi bạn chạy một chương trình Node.js, nó sẽ tạo ra một event loop và một thread để xử lý các sự kiện và callback.
- Event loop là một vòng lặp vô tận để kiểm tra các sự kiện và thực hiện các callback tương ứng. Nó cũng điều khiển việc thực hiện các tác vụ khác trong chương trình Node.js, như đọc và ghi từ các I/O, gửi và nhận dữ liệu từ mạng, v.v.
- Có hai loại sự kiện mà event loop xử lý: sự kiện đồng bộ và sự kiện bất đồng bộ. Sự kiện đồng bộ được xử lý ngay lập tức trong vòng lặp event loop, trong khi sự kiện bất đồng bộ được đưa vào một hàng đợi và xử lý sau khi các sự kiện đồng bộ đã được xử lý xong.

3. Ví dụ:

```js
setTimeout((_) => {
  console.log(`timeout`);
}, 0);

setImediate((_) => {
  console.log(`immediate`);
});

new Promise((resolve, reject) => {
  resolve();
  console.log(1);
}).then((_) => {
  console.log(`Promise`);
});

process.nextTick((_) => {
  console.log(`next Tick`);
});

console.log(`req.on()`);

// OUPUT:
// 1
// req.on()
// nextTick
// promise
// timeout
// immediate
```

- Giải thích đầu ra của đoạn code trên:

  - Code trên bao gồm: `setTimeout, setImmediate, Promise, process, request.` => Chúng ta có tổng cộng 5 nhiệm vụ (task)

- Trước khi đi vào giải thích cần hiểu khái niệm của: `Microtasks, Macrotasks, và Thread.`
  - Microtasks bao gồm (process.nextTick, promise...)
  - Macrotasks bao gồm (setTimeout, setImmediate, setInterval...)
  - Thread bao gồm luồng chính của một tác vụ của javascript.
- Quy trình cụ thể diễn ra như sau:

  1 - Các tác vụ chính được thực thi đầu tiên.

  2 - Tiếp đến sẽ thực hiện nhiệm vụ trong hàng đợi microtask cho đến khi nó được làm trống, nghĩa là hết.

  3 - Tiếp theo sẽ thực hiện một nhiệm vụ trong tác vụ Macrotask .

  4 - Trong khi check Macrotask thì xem xem có microtask trong Macrotask không? Nếu có thì xử lý luôn.

  5 - Lặp lại 3 và 4.

- Theo quy trình trên thì code được giải thích thứ tự chạy như sau:
  1. Đầu tiên chúng ta gặp setTimeout, tác vụ không đồng bộ, và đó là Macrotasks (đọc lại trên kia) và đi đến hàng đợi Macro.
  2. Đi xuống gặp phải setImmediate, lại là Macrotasks, tiếp tục vào hàng đợi Macro.
  3. Khi gặp phải phương thức Promise thì chú ý Promise là microtask cho nên nó phải thực thi đầu tiên.
     - Nếu để kỹ thì bạn dùng .then() cho nên nó là microtask và được đem vào hàng đợi của microtask
  4. `1` được in ra đầu tiên, Tiếp đến nhìn xuống sẽ thấy process.nextTick là một microtask, nên sẽ in ra tiếp theo.
  5. Nhìn xuống thấy req.on đây là tác vụ luồng chính được thực thi, Sau khi tác vụ luồng chính được thực thi thì nó tiêp tục poll thăm dò và phát hiện .then() của bạn và nó sẽ in ra.
  6. Sau khi luồng chính được thực thi, hãy tiếp tục thăm dò, nhận thấy rằng hàng đợi microtask trống, bắt đầu poll cho hàng đợi Microtask, thấy rằng một trong bước 1 setTimeout có thể được thực thi, di chuyển đến luồng chính để thực thi và xuất 'time out'
  7. Sau khi luồng chính được thực thi, hãy tiếp tục thăm dò, nhận thấy rằng hàng đợi microtask trống, bắt đầu poll cho hàng đợi Microtask, thấy rằng quá trình ở bước 2 setImmediate có thể được thực thi, di chuyển đến luồng chính để thực thi và xuất immediate
  8. Sau khi luồng chính được thực thi, hàng đợi tác vụ trống và chương trình kết thúc.

### Ứng dụng design pattern

Xem xét chức năng phân quyền sau:

```js
function checkAuth(data) {
  if (data.role !== "admin") {
    console.log("Khong phai admin, co the la lua dao");
    return false;
  }
  if (data.grade < 1) {
    console.log("Chua du level quan ly :D ");
    return false;
  }
  if (data.job !== "FE") {
    console.log("Khong phai lam viec tai front-end");
    return false;
  }
  if (data.type !== "eat dog") {
    console.log("Bo nay khong an thit cho");
    return false;
  }
}
```

=> Code trên không hợp lý vì nếu có thêm rule khác thì sẽ if else đến chết

=> Áp dụng design pattern như sau:

```js
// list job
const jobList = ["FE", "BE"];

// function
var strategies = {
  checkRole: function (value) {
    return value === "admin";
  },
  checkGrade: function (value) {
    return value >= 1;
  },
  checkJob: function (value) {
    return jobList.includes(value);
  },
  checkEatType: function (value) {
    return value === "eat Dog";
  },
};

var Validator = function () {
  this.cache = [];

  // add su kien
  this.add = function (value, method) {
    this.cache.push(function () {
      return strategies[method](value);
    });
  };

  // check
  this.check = function () {
    for (let i = 0; i < this.cache.length; i++) {
      let valiFn = this.cache[i];
      var data = valiFn(); // check tai day
      if (!data) {
        return false;
      }
    }
    return true;
  };
};
```

Tại thời điểm này, các điều kiện mà dự án 1 cần để xác minh quyền là: Người dùng có phải là Admin không? Phải cấp 3 trở lên mới được chỉnh sửa bài....

```js
var compose1 = function () {
  var validator = new Validator();
  const data1 = {
    role: "admin",
    grade: 3,
  };
  validator.add(data1.role, "checkRole");
  validator.add(data1.grade, "checkGrade");
  const result = validator.check();
  return result;
};

//console.log(compose1())
```

Tương tụ ở dự án khác, thì kiểm tra như sau: Người dùng có phải là Admin không? Và đồng thời làm ở BE (Back-End) hay không?

```js
var compose2 = function () {
  var validator = new Validator();
  const data2 = {
    role: "admin",
    job: "BE",
  };
  validator.add(data2.role, "checkRole");
  validator.add(data2.job, "checkJob");
  const result = validator.check();
  return result;
};

console.log(compose2());
```

### Thêm thuộc tính vào Object theo điều kiện cho trước

```js
const MANU = true;
const player = {
  name: "cr7",
  age: 35,
  ...(MANU && { club: "manu" }),
};
console.log(player);
```

### Điều kiện lồng nhau

- Khi viết code tránh tạo ra những code blocks lồng nhau quá nhiều tầng dẫn đến việc đọc code khó khăn hơn
- Hãy xem xét 2 đoạn code sau và đưa ra nhận xét:

```js
// C1
function supply(fruit, quantity) {
  const redFruits = ["apple", "strawberry", "cherry", "cranberries"];
  // 1: kiểm tra xem có thật tồn tại hay không?
  if (fruit) {
    // 2: nằm trong danh sách mảng hay không?
    if (redFruits.includes(fruit)) {
      console.log("Đã tìm thấy một loại trái cây lạ");
      // 3: Số lượng lớn hơn 10 không?
      if (quantity > 10) {
        console.log("Có thể đặt hàng số lượng lớn");
      }
    }
  } else {
    throw new Error("Không phải trái cây");
  }
}

// C2
function supply(fruit, quantity) {
  const redFruits = ["apple", "strawberry", "cherry", "cranberries"];
  if (!fruit) throw new Error("Không phải trái cây"); // 1: kiểm tra xem có thật tồn tại hay không?
  if (!redFruits.includes(fruit)) return; // // 2: nằm trong danh sách mảng hay không? return

  console.log("Đã tìm thấy một loại trái cây lạ");

  // 3: Số lượng lớn hơn 10 không?
  if (quantity > 10) {
    console.log("Có thể đặt hàng số lượng lớn");
  }
}
```

=> Chúng ta thấy C2 code nhìn sạch đẹp hơn rõ ràng :B

### Check datatype

1. String

- Một chuỗi thì luôn là một chuỗi, tuy nhiên khi tạo chuỗi bằng cách sử dụng `new String` thì chuỗi này lại ở dạng object

```js
function isString(value) {
  return typeof value === "string" || value instanceof String;
}
```

2. Number

```js
function isNumber(value) {
  return typeof value === "number" && isFinite(value);
}
```

3. Array

```js
function isArray(value) {
  return value && typeof value === "object" && value.constructor === Array;
}
```

4. Function

```js
function isFunction(value) {
  return typeof value === "function";
}
```

5. Object

```js
function isObject(value) {
  return value && typeof value === "object" && value.constructor === Object;
}
```

6. Check null và undefined

- Thật ra trong hầu hết các trường hợp chúng ta không cần kiểm tra giá trị null và undefined vì chúng đều là giá trị giả

```js
// Returns if a value is null
function isNull(value) {
  return value === null;
}
// Returns if a value is undefined
function isUndefined(value) {
  return typeof value === "undefined";
}
```

7. Boolean

```js
function isBoolean(value) {
  return typeof value === "boolean";
}
```

8. Regex

```js
// Returns if a value is a regexp
function isRegExp(value) {
  return value && typeof value === "object" && value.constructor === RegExp;
}
```

9. Exception

```js
function isError(value) {
  return value instanceof Error && typeof value.message !== "undefined";
}
```

10. Date

```js
function isDate(value) {
  return value instanceof Date;
}
```

11. Symbol

```js
// Returns if a Symbol
function isSymbol(value) {
  return typeof value === "symbol";
}
```
