# Phần 1: Javascript

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

# Phần 2: Typescript

### Using type predicates

```ts
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

- Trong ví dụ trên, `pet is Fish` chính là `type predicate`

```ts
// Both calls to 'swim' and 'fly' are now okay.
let pet = getSmallPet();

if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

### Discriminated unions (Phân biệt unions)

```ts
// - Kiểu dữ liệu Shape có thể là hình tròn hoặc hình vuông, nếu là hình tròn thì có thuộc tính bán kính, và hình vuông có thêm thuộc tính chiều dài cạnh
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}

function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2; // Lỗi do shape chưa được xác định là loại hình nào (Object is possibly 'undefined'.)
}

// Để sửa code có thể làm như sau
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius! ** 2;  // non-null assertion
  }
}

// Tuy nhiên làm cách trên không hợp lý lắm do chúng ta đang buộc typescript hiểu rằng thuộc tính radius không bao giờ là null, vì thể nó có thể xảy ra lỗi sau này khi thay đổi code

// ---------------------------------------------------
// Cách tốt nhất có thể làm như sau: Tách riêng hai kiểu loại hình có các thuộc tính là bắt buộc chứ không phải option nữa
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
```

### Exhaustiveness checking

- Kiểu `never` có thể được gán cho bất kì loại nào tuy nhiên bất kì loại nào không thể gán cho kiểu `never` (Trừ khi nó là chính nó), Khi sử dụng if else hoặc bất kì câu lệnh điều kiện nào để check type thì sau lệnh đó, kiểu của union sẽ bị giảm trường hợp đi

```ts
type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

- Nếu thêm kiểu vào shape thì typescript sẽ báo lỗi

```ts
interface Triangle {
  kind: "triangle";
  sideLength: number;
}

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default: // Type 'Triangle' is not assignable to type 'never'.
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

### Specifying Type Arguments

- Lưu ý luôn sử dụng ít type arg nhất có thể (Không sử dụng nhiều dạng như này: `<U, V, ...>`)

```ts
// Viết function để kết hợp hai mảng
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}

// Bình thường nó sẽ xuất hiện lỗi khi đầu vào không khớp với kiểu được chỉ định
const arr = combine([1, 2, 3], ["hello"]); // Type 'string' is not assignable to type 'number'.

// Nếu định làm như trên thì cần chỉ định kiểu theo cách thủ công như sau:
const arr = combine<string | number>([1, 2, 3], ["hello"]);
```

NOTE: Khi viết một hàm cho một callback, không bao giờ được viết một tham số dạng tùy chọn trừ khi bạn có ý định gọi hàm mà không chuyền đối số

### Function Overloads

- Giống cách viết, quy tắc trong java

### Typescript Mistakes Every Junior Developer should Avoid | clean-code

- Sử dụng unknown thay vì sử dụng any. Thực chất, việc sử dụng any là tắt type checking => Giả sử trong một object không có thuộc tính age nhưng ta vẫn có thể sử dụng object.age (Không hợp lý tý nào, code typescript mà dùng như JS thế này)

```ts
interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  age: number;
}

interface IAdminUser extends IUser {
  token: string;
  addNewUser: () => void;
}

function isAdminUser(object: unknown): object is IAdminUser {
  if (object !== null && typeof object === "object") {
    return "token" in object;
  }
  return false;
}

async function fetchUser() {
  const response = await fetch("/api/v1/user/1");
  // BAD
  const badUser = await response.json();
  // GOOD
  const goodUser: unknown = await response.json();
  if (isAdminUser(goodUser)) {
  }
}
```

- NÊN sử dụng `satisfiles`
  - Quan sát ví dụ sau:

```ts
interface ICustomImage {
  data: string;
  width: number;
  height: number;
}

const myCustomImage = {
  data: "base64",
  width: 200,
  height: 150,
};

type UserImage = string | ICustomImage;

interface IUser {
  id: number;
  firstName: string;
  lastName: string;
}

// BAD
const badUser: IUser = {
  id: 1,
  firstName: "ALEX",
  lastName: "BREAK",
  image: "image-url",
};
// - Không nên sử dụng vì trong này có thuộc tính là image có `type` là `string | ICustomImage` nên khi chọc vào thuộc tính này nó không thực sự biết là biến này đang có kiểu như  thế nào nên sẽ không gợi ý chính xác các thuộc tính của nó.

// GOOD
const goodUser = {
  id: 1,
  firstName: "ALEX",
  lastName: "BREAK",
  image: "image-url",
} satisfies IUser;

// - Khi sử dụng như trên thì sau khi gán giá trị cho goodUser rồi nó mới tiến hành so sánh kiểu và tự động ép kiểu sao cho phù hợp nhất với unions
```

### Vấn đề sử dụng enum

```ts
// BAD
enum BadState {
  InProgress,
  Success,
  Fail,
}

BadState.InProgress; // (enum member) BadState.InProgress = 0
BadState.Success; // (enum member) BadState.InProgress = 1
BadState.Fail; // (enum member) BadState.InProgress = 2

const badCheckState = (state: BadState) => {
  // CODE
};
badCheckState(100);

// => Lý do dẫn đến code trên bad là bởi enum tự động convert các giá trị sang dạng number nên tham số của nó cũng được ép sang kiểu là number

// GOOD
type GoodState = "InProgress" | "Success" | "Fail";

enum GoodState2 {
  InProgress = "InProgress",
  Success = "Success",
  Fail = "Fail",
}

const goodState = (state: GoodState) => {
  // CODE
};
```

- Sử dụng các tiện ích có sẵn trong typescript
  - Partial
  - Record

```ts
// PRODUCT
interface IProduct {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  rating: number;
}
// Khi cập nhật thì không được cập nhật id và chỉ cập nhật một số trường thôi
interface IUpdateProduct {
  title?: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  rating?: number;
}
// Điều sau đây cho kết quả tương tự với IUpdateProduct
function updateProduct(
  productId: IProduct["id"],
  updateProduct: Partial<Omit<IProduct, "id">>
) {
  // Update
}

// RECORDS
type Properties = "red" | "green" | "blue";
type RGB = [red: number, green: number, blue: number];
const color: Record<Propeties, RGB | string> = {
  red: [255, 0, 0],
  green: "green",
  blue: "blue",
};
```

### `in` keyword

- Từ khóa `in` được sử dụng để xác định một thuộc tính có trong một object hay không

### Generator functions

- Sử dụng `Generator functions` giúp không chạy hết các đoạn code trong thân hàm khi gọi

```ts
function* generatorFunction() {
  console.log("BEFORE 1");
  yield 1;
  console.log("AFTER 1");
  console.log("BEFORE 2");
  yield 2;
  console.log("AFTER 2");
  console.log("BEFORE 3");
  yield 3;
  console.log("AFTER 3");
}

const generator = generatorFunction();
generator.next(); // Nó trả ra một object dạng {value: any, done: boolean} giá trị chính là giá trị viết sau yield, done là đã chạy hết đoạn code trong thân hàm hay chưa
// BEFORE 1
generator.next();
// AFTER 1
// BEFORE 2
generator.next();
```

- Tạo một hàm có chức năng tự động generate ra `id` tăng dần

```ts
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id;
    id++;
  }
}
const generatorId = idGenerator();
console.log(generatorId.next);
console.log(generatorId.next);
console.log(generatorId.next);
```

### Dynamic Module Javascript

- Sử dụng chức năng này khi chỉ muốn sử dụng các đoạn code module khi thực sự cần thiết => Giúp giảm size module của bạn

```ts
document.addEventListener("click", async () => {
  const { default: printModule } = await import("./module.js"); // Không cần quan tâm function được import kia có ý nghĩa gì, quan tâm vào cú pháp import()
  printModule();
});
```

### Tạo custom event trong js

```js
const myEvent = new Event("myCustomEvent");
document.addEventListener("myCustomEvent", (e) => {
  console.log(e);
});
document.dispatchEvent(myEvent);
```

- Các option khi tạo event

```js
{
  isTrusted: false;
  bubbles: false;
  cancelBubble: false;
  cancelable: false;
  composed: false;
  currentTarget: null;
  defaultPrevented: false;
  eventPhase: 0;
  path: [document, window];
  returnValue: true;
  srcElement: document;
  target: document;
  timeStamp: 54.69999998807907;
  type: "myCustomEvent";
}
```

- `isTrusted` chỉ đề cập tới sự kiện có được kích hoạt bởi tương tác của người dùng hay bởi mã javascript hay không. Ví dụ khi người dùng click vào một button => Sự kiện xảy ra thì đặt thuộc tính isTrusted là true, đặt là false nếu sự kiện được kích hoạt bằng javascript
- `target` chính là phần tử thực hiện `dispatchEvent`
- `timeStamp` là khoảng thời gian kể từ khi sự kiện được xảy ra
- `type` chỉ là tên của sự kiện

```js
const myEvent = new Event("myCustomEvent", {
  bubbles: true,
  cancelable: true,
  composed: true,
});
```

- Full ví dụ custom event trong js

```ts
const button = document.querySelector("button");

button.addEventListener("custom:doubleClick", (e) => {
  console.log("Double Click", e.detail.timeBetweenClicks);
});

const MAX_DOUBLE_CLICK_TIME = 500;
let lastClick = 0;
button.addEventListener("click", (e) => {
  const timeBetweenClicks = e.timeStamp - lastClick;
  if (timeBetweenClicks > MAX_DOUBLE_CLICK_TIME) {
    lastClick = e.timeStamp;
    return;
  }

  const doubleClickEvent = new CustomEvent("custom:doubleClick", {
    bubbles: true,
    cancelable: true,
    composed: true,
    detail: {
      timeBetweenClicks,
    },
  });
  e.target.dispatchEvent(doubleClickEvent);
  lastClick = 0;
});
```

- Lưu ý về quy ước đặt tên: Sử dụng `custom:event_name` hoặc `custom` có thể thay bằng tên dự án của bạn

### Tránh sử dụng `!`

- Vấn đề khi sử dụng `!` là nó luôn convert toàn bộ giá trị thành boolean
- Giả sử khi kiểm tra một người dùng có tồn tại hay không thì đoạn code dưới đây hoạt động như nhau, lý do là user có thể nhận các giá trị là null, undefined

```js
!null // true
!undefined // true
!{ name: "Kyle" } // false

null == null // true
undefined == null // true
{ name: "Kyle" } == null // false
```

- Tuy nhiên toán tử này sẽ hẹo nếu sử dụng trong trường hợp check number như sau:

```js
!0; // true
!1; // false

0 == null; // false
1 == null; // false
```

### Kĩ thuật debounce và throttle trong js

- Kĩ thuật debounce là kĩ thuật giúp tránh việc thực hiện một công việc nào đó nhiều lần, công việc sẽ chỉ được thực hiện nếu hành động đó kết thúc sau một khoảng thời gian

```js
function debounce(cb, delay = 250) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}
const updateOptions = debounce((query) => {
  console.log(query);
}, 1000);

const input = document.querySelector("input");
input.addEventListener("input", function (e) {
  updateOptions(e.target.value);
});
```

- Throttle
  - Giống như debonce, throttle cũng được sử dụng để giới hạn số lần một function được gọi, tuy nhiên nó hoạt động khác debounce. throttle sẽ thực hiện gọi function sau khi một khoảng delay kết thúc miễn là quá trình kích hoạt chức năng vẫn đang diễn ra (Sau delays giây nó thực hiện gọi lại)
  - Có hai cách code throttle tùy vào mục đích sử dụng.

CÁCH 1:

```js
function throttle(cb, delay = 250) {
  let shouldWait = false;

  return (...args) => {
    if (shouldWait) return;

    cb(...args);
    shouldWait = true;
    setTimeout(() => {
      shouldWait = false;
    }, delay);
  };
}
// Mô tả function throttle trên như sau: Giả sử người dùng nhập vào ô input cứ sau khoảng thời gian 300ms và delay = 1000ms
// Type S - Call throttled function with S
// Type a - Do nothing: 700ms left to wait
// Type m - Do nothing: 400ms left to wait
// Type a - Do nothing: 100ms left to wait
// Delay is over - Nothing happens
// Type n - Call throttled function with Saman
// No more typing
// Delay is over - Nothing happens
```

CÁCH 2

```js
function throttle(cb, delay = 1000) {
  let shouldWait = false;
  let waitingArgs;
  const timeoutFunc = () => {
    if (waitingArgs == null) {
      shouldWait = false;
    } else {
      cb(...waitingArgs);
      waitingArgs = null;
      setTimeout(timeoutFunc, delay);
    }
  };

  return (...args) => {
    if (shouldWait) {
      waitingArgs = args;
      return;
    }

    cb(...args);
    shouldWait = true;
    setTimeout(timeoutFunc, delay);
  };
}
// Mô tả function throttle trên như sau: Giả sử người dùng nhập vào ô input cứ sau khoảng thời gian 300ms và delay = 1000ms
// Type S - Call throttled function with S
// Type a - Save Sa to waiting args: 700ms left to wait
// Type m - Save Sam to waiting args: 400ms left to wait
// Type a - Save Sama to waiting args: 100ms left to wait
// Delay is over - Call throttled function with Sama
// Type n - Save Saman to waiting args: 700ms left to wait
// No more typing
// Delay is over - Call throttled function with Saman
```

FULL VÍ DỤ

```js
function throttle(cb, delay = 250) {
  let shouldWait = false;

  return (...args) => {
    if (shouldWait) return;

    cb(...args);
    shouldWait = true;
    setTimeout(() => {
      shouldWait = false;
    }, delay);
  };
}

const input = document.querySelector("input");
const updateOptions = throttle((query) => {
  console.log("Excute");
}, 500);

input.addEventListener("input", (e) => {
  updateOptions(e.target.value);
});
```

=> Sự khác biệt duy nhất giữa hai cách trên là ở cách viết thứ nhất, function sẽ chỉ được gọi khi người dùng đang thực hiện trigger, còn ở cách thứ 2, function sẽ luôn luôn được gọi sau khoảng thời gian delay (Dù ở lần cuối cùng không thực hiện trigger thì sau khoảng thời gian delay nó vẫn được thực hiện lần cuối cùng)

- Kĩ thuật throttle thường được sử dụng trong resize, drag and drop, scrolling, hoặc bất kì nghiệp vụ nào phù hợp

### Null Vs Undefined

- Một function return về undefined hoặc null thì có nghĩa nó không có giá trị trả về, cả `null` và `undefined` đều có ý nghĩa là không có giá trị, nhưng thông điệp mà nó muốn truyền tải lại khác.
- `Null` có nghĩa là không có giá trị và một biến có giá trị này khi và chỉ khi lập trình viên set cho nó là `null`
- `Undefined` được hiểu là không có giá trị nào vì chưa có giá trị nào được đặt
  - Ví dụ tạo một biến và không gán giá trị thì nó sẽ là undefined

```js
let a;

console.log(a);
// undefined
```

=> Để truyền tải rằng một biến không còn bất kì thông tin hữu ích nào nữa thì đặt nó là `undefined`. Khi kết quả trả của một số hành động không có giá trị thì đặt là `null`
