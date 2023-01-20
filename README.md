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

###
