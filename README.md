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
  lastName: string;;
  image: string | ICustomImage
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

### Relative Date Internationalization In JavaScript

1. EX

```js
// Tạo instance của đối tượng
const english = new Intl.RelativeTimeFormat("en-us");
const spanish = new Intl.RelativeTimeFormat("es-es");
const inferred = new Intl.RelativeTimeFormat(undefined);

// Mỗi instance nhận 2 đối sô, đầu tiên là khoảng thời gian, thứ hai là loại khoảng thời gian
english.format(-2, "days");
// 2 days ago
spanish.format(10, "hours");
// dentro de 10 horas
```

2. Configuration Options

- Chúng ta có hai cách chính để làm thay đổi đầu ra, đối số thứ 2 có giá trị mặc định là `{ style: 'long' }`
- Cách 1: Truyền style trong đối số thứ 2

```js
const long = new Intl.RelativeTimeFormat("en-us", { style: "long" });
const short = new Intl.RelativeTimeFormat("en-us", { style: "short" });
const narrow = new Intl.RelativeTimeFormat("en-us", { style: "narrow" });

long.format(10, "hours");
// in 10 hours
short.format(10, "hours");
// in 10 hr.
narrow.format(10, "hours");
// in 10 hr.
```

- Cách thứ hai là truyền đối số thứ 2 chứa một thuộc tính là `numberic`, mặc định là `always`

```js
const always = new Intl.RelativeTimeFormat("en-us", { numeric: "always" });
const auto = new Intl.RelativeTimeFormat("en-us", { numeric: "auto" });

always.format(0, "hours");
// in 0 hours
auto.format(0, "hours");
// this hour
```

3. Bắt đầu tạo một trình hiển thị ngày giờ thực sự

```js
const formatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto", // Đặt cái này thành auto để nó in ra "yesterday" thay vì "1 day ago"
});

const DIVISIONS = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
];
// Tiếp theo là tạo ra một function trả ra định dạng của ngày đó so với ngày hiện tại, đơn vị sẽ là khoảng lớn nhất được tính
function formatTimeAgo(date) {
  let duration = (date - new Date()) / 1000;

  for (let i = 0; i <= DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }
}
```

### Extends interface from a html element

```js
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  showIcon: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, showIcon, ...props }) => {
  return (
    <button {...props}>
      {title}
      {showIcon && <Icon />}
    </button>
  );
};

<Button
  title="Click me"
  onClick={() => {}} {/* You have access to the <button/> props */}
/>
```

### Index Signatures

- Giả sử có hai Object như sau:

```js
const salary1 = {
  baseSalary: 100_000,
  yearlyBonus: 20_000
};

const salary2 = {
  contractSalary: 110_000
};

function totalSalary(salaryObject: ???) {
  let total = 0;
  for (const name in salaryObject) {
    total += salaryObject[name];
  }
  return total;
}
totalSalary(salary1); // => 120_000
totalSalary(salary2); // => 110_000

// Ta thấy rằng trong từng object đều có cấu trúc giống nhau, tuy nhiên để sử dụng type trong typescript thì ta cần biết trước key của nó thuộc loại gì, đây là lúc sử dụng signalture trong ts

function totalSalary(salaryObject: { [key: string]: number }) {
  let total = 0;
  for (const name in salaryObject) {
    total += salaryObject[name];
  }
  return total;
}

totalSalary(salary1); // => 120_000
totalSalary(salary2); // => 110_000

// { [key: string]: number } chính là index signature
```

- VÍ DỤ 2

```js
interface Options {
  [key: string]: string | number | boolean;
  timeout: number;
}

const options: Options = {
  timeout: 1000,
  timeoutMessage: "The request timed out!",
  isFileUpload: false,
};
```

- `Index signature vs Record<Keys, Type>`

```js
const object1: Record<string, string> = { prop: "Value" }; // OK
const object2: { [key: string]: string } = { prop: "Value" }; // OK
```

```js
type SpecificSalary = Record<"yearlySalary" | "yearlyBonus", number>;

const salary1: SpecificSalary = {
  yearlySalary: 120_000,
  yearlyBonus: 10_000,
}; // OK
```

### Tuple Types

- Đây là một loại khác của Array, nó cho ta biết có bao nhiêu phần tử trong một mảng và define ra từng kiểu của phần tử đó theo vị trí

```js
function doSomething(pair: [string, number]) {
  const a = pair[0];

const a: string
  const b = pair[1];

const b: number
  // ...
}

doSomething(["hello", 42]);
```

```js
type Either2dOr3d = [number, number, number?];

function setCoordinate(coord: Either2dOr3d) {
  const [x, y, z] = coord;  // z: number | undefined
  console.log(`Provided coordinates had ${coord.length} dimensions`); // (property) length: 2 | 3
}
```

- Sử dụng rest

```js
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];
```

# Phần 3: ReactJs

### useId hook (React 18)

```js
function EmailForm() {
  return (
    <>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" />
    </>
  );
}
```

- Theo dõi code trên, mặc dù nó hoạt động. Thế nhưng nếu bạn cố gắng hiển thị biểu mẫu này trên cùng một trang nhiều lần thì cũng sẽ có nhiều phần tử bị trùng id. Điều này là không tốt bởi mỗi thành phần cần có id riêng biệt, hơn nữa khi click vào tất cả các label nó sẽ chỉ focus vào ô input đầu tiên do tất cả các input đều có id giống nhau. Để fix hãy sử dụng hook sau:

```js
function EmailForm() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Email</label>
      <input id={id} type="email" />
    </>
  );
}
```

=> Với việc sử dụng hook `useID` bạn sẽ sử dụng biểu mẫu này bao nhiêu lần tùy thích trên cùng một trang bởi vì nó sẽ tạo ra các id không trùng lặp. các ids được tạo bởi `useId` có dạng như sau: `:r1:, :r2: etc`

- Một điều cần lưu ý là khi sử dụng `useId` nó sẽ tạo ra bộ chọn không hợp lệ khi sử dụng phương thức query selector. Điều này là có chủ đích vì React không muốn bạn select element bằng việc sử dụng `querySelector`. Thay vào đó bạn nên sử dụng useRef để thay thế.

- Chỉ sử dụng hook này một lần trong một component. Điều này giúp nâng cao hiệu suất và giúp tận dụng được những lợi ích của hook này

```js
function LogInForm() {
  const id = useId();
  return (
    <>
      <div>
        <label htmlFor={`${id}-email`}>Email</label>
        <input id={`${id}-email`} type="email" />
      </div>
      <div>
        <label htmlFor={`${id}-password`}>Password</label>
        <input id={`${id}-password`} type="password" />
      </div>
    </>
  );
}
```

### Cấu trúc thư mục khi triển khai ứng dụng react

- Tùy vào quy mô ứng dụng mà sử dụng cấu trúc phù hợp, không phải cứ cấu trúc phức tạp nhất lại là tốt nhất cho mọi dự án!

1. Simple Folder Structure

![Beginer](./imgs/beginner.png)

- `hooks`: Chứa mọi hook tùy chỉnh cho dự án của bạn
- `components`: Chứa mọi thành phần đơn lẻ, khi dự án của bạn chứa hơn 10-15 thành phần thì thư mục này rất khó xử lý, đó là lý do tại sao trong tất cả các cấu trúc thư mục khác, các thành phần thường được trải rộng trong nhiều thư mục và có nhiều cấu trúc hơn. Tuy nhiên với các thư mục nhỏ thì không cần thiết phải phức tạp như thế.
- `__tests__`: Tất cả code được test

* Ưu điểm: Dễ thực hiện đối với beginer
* Nhược điểm: Không giúp gì nhiều cho dự án của bạn, Khi dự án có nhiều thành phần thì các folder sẽ chứa nhiều tệp dẫn tới khó quản lý.

2. Intermediate Folder Structure (Cấu trúc thư mục trung gian)

![Intermediate](./imgs/intermediate.png)

- Sự thay đổi lớn nhất giữa cấu trúc đơn giản và cấu trúc này là chúng tôi hiện đang chia dự án của mình thành các trang gói gọn cho tất cả các logic cho các trang cụ thể vào một vị trí duy nhất. Điều này là thực sự hữu ích cho các dự án lớn hơn, bạn hoàn toàn có thể tìm kiếm các logic liên quan của page trong một thư mục duy nhất thay vì phải tìm kiếm trên nhiều thư mục và sàng lọc các tệp không liên quan để tìm kiếm thứ bạn muốn.

- `pages`: Chứa toàn bộ các trang trong dự án của bạn, bên trong các thư mục cụ thể của trang đó phải là một tệp gốc của trang này (index.js), bên cạnh là những tệp chỉ áp dụng cho trang đó. Trong ví dụ trên chúng ta có trang `Login` chứa một file gốc là `index.js`, một component gọi là `LoginForm`, custom hook là `useLogin`. component và hook này chỉ được sử dụng trong trang Login nên nó được lưu trữ tại folder này chứ không phải ở compoent và hook ở global.

- `components`: Trong cấu trúc này thì thư mục component sẽ được chia thành các thư mục con. Trong ví dụ trên chúng ta có thư mục `ui` chứa tất cả các thành phần giao diện người dùng như button, modals, cards, etc. Chúng ta cũng có một folder form cho các điều khiển cụ thể của biểu mẫu như checkbox, inputs, date pickers, etc. Bạn cũng có thể custom và chia nhỏ thư mục component sao cho phù hợp với dự án của bạn. Nhưng lý tưởng cho thư mục này là nó không nên quá lớn vì nhiều thành phần phức tạp hơn sẽ được lưu trữ trong `pages folder`

- `hooks`: Nơi lưu trữ các hook global được sử dụng trong nhiều trang. Điều này là do các hook cụ thể của từng page đã được lưu trữ trong chính folder của page đó

- `assets`: Nơi chứa tất cả các hình ảnh, css files, font files, etc. Khá nhiều thứ không liên quan đến code sẽ được lưu trữ trong thư mục này.

- `context`: Lưu trữ toàn bộ tệp `context` được sử dụng trên nhiều trang. Nếu sử dụng một kho lưu trữ khác như redux thì có thể thay thế bằng thư mục `redux`

- `data`: Folder này tương tự như thư mục `assets`, chứa các file json được sử dụng trong code (VD như store item, theme information), Thư mục này cũng có thể lưu trữ các biến hằng toàn cục (VD biến môi trường)

- `utils`: Folder này sẽ chứa toàn bộ các function utils (VD như bộ định dạng, ...). (Nên chỉ lưu trữ các pure function)

* Ưu điểm: Các tệp đều có thư mục riêng, điều này giúp các component, hooks global có ít code hơn
* Nhược điểm: Khi ứng dụng phát triển lớn hơn thì nhiều trang sẽ sử dụng cùng một tính năng. Khi điều này xảy ra bạn sẽ phải di chuyển code của bạn ra khỏi `pages folder` và chuyển đến các folder khác trong ứng dụng, điều này làm các thư mục khác bị phình to ra.

3. Advanced Folder Structure

![Advanced](./imgs/advanced.png)

- `features`: Thư mục này hoạt động giống thư mục `pages` trong `Intermediate Folder Structure`. Nhưng thay vì nhóm theo trang thì ở đây nó nhóm theo tính năng.

- `pages`: Bây giờ trong folder này chỉ chứa một tệp trên mỗi trang vì tất các logic cho tính năng trên các trang đều nằm trong thư mục `features`. Điều này có nghĩa là các tệp trong thư mục `pages` thực sự khá đơn giản vì chúng chỉ gắn kết một vài tính năng, component chung lại với nhau

- `layouts`: Đây là nơi chứa tất cả các cách hiển thị(Gọi chung là layout) trong ứng dụng của bạn, nếu ứng dụng của bạn chỉ có một layout thì folder này không cần thiết, và bạn có thể đặt các thành phần layout của bạn trong thư mục `components`

- `lib`: Chứa những `facades` cho các thư viện khác nhau mà bạn sử dụng. Ví dụ bạn sử dụng thư viện `axios` thì bạn sẽ tạo một tệp riêng cho thư viện axios đó. Điều này có nghĩa là khi muốn sử dụng axios thì thay vì import trực tiếp axios từ thư viện thì bạn sẽ import từ file này.

- `services`: Thư mục này chứa tất cả các mã của bạn để giao tiếp với bất kì API bên ngoài nào,

### Ví dụ về folder structure

```js
└── src/
    ├── features/
    │   │   # the todo "feature" contains everything related to todos
    │   ├── todos/
    │   │   │   # this is used to export the relevant modules aka the public API (more on that in a bit)
    │   │   ├── index.js
    │   │   ├── create-todo-form/
    │   │   ├── edit-todo-modal/
    │   │   ├── todo-form/
    │   │   └── todo-list/
    │   │       │   # the public API of the component (exports the todo-list component and hook)
    │   │       ├── index.js
    │   │       ├── todo-item.component.js
    │   │       ├── todo-list.component.js
    │   │       ├── todo-list.context.js
    │   │       ├── todo-list.test.js
    │   │       └── use-todo-list.js
    │   ├── projects/
    │   │   ├── index.js
    │   │   ├── create-project-form/
    │   │   └── project-list/
    │   ├── ui/
    │   │   ├── index.js
    │   │   ├── button/
    │   │   ├── card/
    │   │   ├── checkbox/
    │   │   ├── header/
    │   │   ├── footer/
    │   │   ├── modal/
    │   │   └── text-field/
    │   └── users/
    │       ├── index.js
    │       ├── login/
    │       ├── signup/
    │       └── use-auth.js
    └── pages/
        │   # all that's left in the pages folder are simple JS files
        │   # each file represents a page (like Next.js)
        ├── create-project.js
        ├── create-todo.js
        ├── index.js
        ├── login.js
        ├── privacy.js
        ├── project.js
        ├── signup.js
        └── terms.js

// Thu gọn

└── src/
    ├── features/
    │   ├── todos/
    │   ├── projects/
    │   ├── ui/
    │   └── users/
    └── pages/
        ├── create-project.js
        ├── create-todo.js
        ├── index.js
        ├── login.js
        ├── privacy.js
        ├── project.js
        ├── signup.js
        └── terms.js
```

### Một số những tips

- Trong mỗi thư mục cần có một file index. File này làm nhiệm vụ duy nhất là export toàn bộ file trong cấu trúc để những nơi khác dễ import

Ví dụ:

```js
└── src/
    ├── features/
    │   ├── todos/
    │   │   │   # this is used to export the relevant modules aka the public API
    │   │   ├── index.js
    │   │   ├── create-todo-form/
    │   │   ├── edit-todo-modal/
    │   │   ├── todo-form/
    │   │   └── todo-list/
    │   │       │   # the public API of the component (exports the todo-list component and hook)
    │   │       ├── index.js
    │   │       ├── todo-item.component.js
    │   │       ├── todo-list.component.js
    │   │       ├── todo-list.context.js
    │   │       ├── todo-list.test.js
    │   │       └── use-todo-list.js
    │   ├── projects/
    │   ├── ui/
    │   └── users/
    └── pages/

// Trong features/todo/todo-list
export { TodoList } from "./todo-list.component";
export { useTodoList } from "./use-todo-list";

// Trong feature/todo/index.js
export * from "./create-todo-form";
export * from "./todo-list";

// Thay vì import như này
import { TodoList } from "@features/todo/todo-list/todo-list.component";
// Chúng ta chỉ cần làm như này
import { TodoList } from "@features/todo";
```

- Một số quy tắc đặt tên:
  - kebab-case
  - PascalCase
  - camelCase

=> Trong các quy tắc đặt tên trên, nên sử dụng quy tắc kebab-case, bởi nếu sử dụng 2 quy tắc đặt tên bên dưới khi sử dụng Macbook sẽ gặp vấn đề bởi Unix không phân biệt chữ hoa chữ thường => MyComponent.js với myComponent.js là giống nhau. Vì thế git sẽ không nhận thay đổi về tên tệp (Nếu ta đổi tên tệp).

### Vấn đề mà các junior gặp phải khi sử dụng useState hook

1. Duplicate State

- Dưới đây là một ví dụ hiển thị một danh sách các items, người dùng có thể mở một item bằng cách click vào nút open tương ứng để mở một modal

![State 1](./imgs/state1.webp)

```js
// Đây là code có vấn đề
import { useState } from "react";

// const items = [
//   {
//     id: "item-1",
//     text: "Item 1",
//   },
//   ...
// ]

function DuplicateState({ items }) {
  const [selectedItem, setSelectedItem] = useState();

  const onClickItem = (item) => {
    setSelectedItem(item);
  };

  return (
    <>
      {selectedItem && <Modal item={selectedItem} />}
      <ul>
        {items.map((row) => (
          <li key={row.id}>
            {row.text}
            <button onClick={() => onClickItem(row)}>Open</button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

=> Ta thấy vấn đề ở đây là toàn bộ item sẽ được lưu vào state (selectedItem), Thử suy nghĩ rằng: Khi người dùng open modal, sau đó bên trong modal này lại có một form dùng để cập nhật thông tin của item đó, nếu người dùng cập nhật và bấm submit thì thông tin mới của item này sẽ được lưu trữ trên cơ sở dữ liệu, sau đó ở phía frontend sẽ gọi lại một api và render lại thông tin của item đó trên màn hình(List được re-render), Tuy nhiên lúc này thông tin hiển thị trên màn hình về item đang chọn vẫn hiển thị thông tin cũ do ta đang lưu toàn bộ thông tin của item này trước đó vào state. Bug này có thể gây khó chịu trong một số tình huống phức tạp hơn. Vậy giải pháp ở đây là gì?

- Để giải quyết vấn đề này, chúng ta có thể biến `selectedItem` thành sync (Đồng bộ) và chỉ lưu trữ id của nó khi người dùng click open thôi. Cách làm khá đơn giản như sau:

```js
// const items = [
//   {
//     id: "item-1",
//     text: "Item 1",
//   },
//   ...
// ]

function DuplicateState({ items }) {
  const [selectedItemId, setSelectedItemId] = useState();
  const selectedItem = items.find(({ id }) => id === selectedItemId);

  const onClickItem = (itemId) => {
    setSelectedItemId(itemId);
  };

  return (
    <>
      {selectedItem && <Modal item={selectedItem} />}
      <ul>
        {items.map((row) => (
          <li key={row.id}>
            {row.text}
            <button onClick={() => onClickItem(row.id)}>Open</button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

2. Updating State Via useEffect (Cập nhật trạng thái thông qua useEffect)

- Ta sẽ sử dụng cùng với ví dụ ở phần trước, tuy nhiên code có thay đổi một chút như sau:

```js
import { useEffect, useState } from "react";

// const items = [
//   {
//     id: "item-1",
//     text: "Item 1",
//   },
//   ...
// ]

function DuplicateState({ items }) {
  const [selectedItem, setSelectedItem] = useState();

  useEffect(() => {
    if (selectedItem) {
      setSelectedItem(items.find(({ id }) => id === selectedItem.id));
    }
  }, [items]);

  const onClickItem = (item) => {
    setSelectedItem(item);
  };

  return (
    <>
      {selectedItem && <Modal item={selectedItem} />}
      <ul>
        {items.map((row) => (
          <li key={row.id}>
            {row.text}
            <button onClick={() => onClickItem(row)}>Open</button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

=> Có thể thấy code trên đã không cập nhật biến selectedItem bằng mã sync nữa, thay vào đó nó đang sử dụng useEffect để cập nhật biến selectedItem. Mã này trông có vẻ hoạt động tốt. Vậy vấn đề ở đây là gì?

- Thứ nhất việc sử dụng useEffect làm cho code khó đọc hơn, nên tránh sử dụng useEffect càng ít càng tốt!
- Thứ hai, việc cập nhật state trong một useEffect gây ra việc render bổ sung, nó không phải là một vấn đề lớn, tuy nhiên vẫn cần được xem xét.
- Thứ ba, useEffect không chạy vào đúng thời điểm, nó luôn được chạy trong lần hiển thị đầu tiên! Để giải quyết vấn đề này ta làm như sau:

```js
function DuplicateState({ items }) {
  const [selectedItem, setSelectedItem] = useState();
  const firstRender = useRef(true);

  useEffect(() => {
    // Tránh lần đầu tiên code chạy vào đây
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSelectedItem(items.find(({ id }) => id === selectedItem.id));
  }, [items]);
```

- Cách này không hay lắm, giải pháp tốt nhất là sử dụng sync như đã trình bày ở phần trước.

3. Contradicting State (Mâu thuẫn state)

- Vấn đề xảy ra khi làm việc với nhiều state liên quan đến nhau, bạn có thể dễ dàng tạo ra một state không được phép

```js
export function ContradictingState() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetchData()
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setData(null);
        setError(error);
      });
  }, []);
```

- Trong ví dụ trên chúng ta có thể dễ dàng rơi vào trạng thái mâu thuẫn state khi không cẩn thận, nếu trong trường hợp fetch data bị lỗi (catch) mà bạn quên setError thành false thì loading sẽ quay liên tục (Đây là state không được phép trong component của chúng ta)

=> Giải pháp: Khi trong một component có nhiều biến state phụ thuộc vào nhau thay vì sử dụng `state` thì lúc này nên nghĩ tới việc sử dụng `useReducer`

```js
const initialState = {
  data: [],
  error: null,
  isLoading: false
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH":
      return {
        ...state,
        error: null,
        isLoading: true
      };
    case "SUCCESS":
      return {
        ...state,
        error: null,
        isLoading: false,
        data: action.data
      };
    case "ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    default:
      throw new Error(`action "${action.type}" not implemented`);
  }
}

export function NonContradictingState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "FETCH" });
    fetchData()
      .then((data) => {
        dispatch({ type: "SUCCESS", data });
      })
      .catch((error) => {
        dispatch({ type: "ERROR", error });
      });
  }, []);

```

=> Nhìn ví dụ trên chúng ta có thể thấy ngay lập tức 3 hành động và 4 trạng thái thành phần có thể (“FETCH”, “SUCCESS”, “ERROR”, và init state)

4. Deeply Nested State (State lồng nhau sâu)

- Khi chúng ta có một state chứa một deeply nested object thì việc cập nhật chúng sau một hành động nào đó quả là đáng sợ bởi trông chúng sẽ như thế này:

```js
function NestedComments() {
  const [comments, setComments] = useState([
    {
      id: "1",
      text: "Comment 1",
      children: [
        {
          id: "11",
          text: "Comment 1 1"
        },
        {
          id: "12",
          text: "Comment 1 2"
        }
      ]
    },
    {
      id: "2",
      text: "Comment 2"
    },
    {
      id: "3",
      text: "Comment 3",
      children: [
        {
          id: "31",
          text: "Comment 3 1",
          children: [
            {
              id: "311",
              text: "Comment 3 1 1"
            }
          ]
        }
      ]
    }
  ]);

  const updateComment = (id, text) => {
    setComments([
      ...comments.slice(0, 2),
      {
        ...comments[2],
        children: [
          {
            ...comments[2].children[0],
            children: [
              {
                ...comments[2].children[0].children[0],
                text: "New comment 311"
              }
            ]
          }
        ]
      }
    ]);
  };
```

=> Giải pháp: Thay vì làm việc với các state lồng sâu nhau, nên sử dụng các cấu trúc `flat` sẽ dễ dàng hơn nhiều!

```js
function FlatCommentsRoot() {
  const [comments, setComments] = useState([
    {
      id: "1",
      text: "Comment 1",
      children: ["11", "12"],
    },
    {
      id: "11",
      text: "Comment 1 1"
    },
    {
      id: "12",
      text: "Comment 1 2"
    },
    {
      id: "2",
      text: "Comment 2",
    },
    {
      id: "3",
      text: "Comment 3",
      children: ["31"],
    },
    {
      id: "31",
      text: "Comment 3 1",
      children: ["311"]
    },
    {
      id: "311",
      text: "Comment 3 1 1"
    }
  ]);

  const updateComment = (id, text) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id !== id) {
        return comment;
      }
      return {
        ...comment,
        text
      };
    });
    setComments(updatedComments);
  };
```

###
