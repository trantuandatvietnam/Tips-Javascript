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
