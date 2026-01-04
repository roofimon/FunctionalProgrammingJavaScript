# รูปแบบการทำ Immutability ใน JavaScript

สรุปแนวคิดและเครื่องมือใน JavaScript สำหรับสร้างคลาสที่ไม่สามารถเปลี่ยนแปลงได้ เปรียบเทียบกับ Scala

---

## ฟีเจอร์ในตัว

### Object.freeze()

ทำให้ property ของ object ไม่สามารถเขียนทับและไม่สามารถกำหนดค่าใหม่ได้

**ข้อจำกัด:**
- ทำได้แค่ระดับตื้น — object ที่ซ้อนอยู่ภายในยังคงเปลี่ยนแปลงได้
- ล้มเหลวแบบเงียบๆ ใน non-strict mode
- ถาวร — ไม่สามารถยกเลิก freeze ได้

**ตัวอย่าง:**

```javascript
// การ freeze พื้นฐาน
const person = Object.freeze({ name: "Alice", age: 30 });
person.name = "Bob";  // ล้มเหลวแบบเงียบๆ
console.log(person.name); // "Alice"

// ข้อจำกัด: freeze แค่ระดับตื้น
const nested = Object.freeze({ data: { value: 1 } });
nested.data.value = 999;  // ใช้งานได้! object ที่ซ้อนอยู่ยังเปลี่ยนแปลงได้
```

---

### Object.seal()

ป้องกันการเพิ่ม/ลบ property แต่ยังอนุญาตให้แก้ไขค่าได้

**ข้อจำกัด:**
- ค่ายังคงเปลี่ยนแปลงได้
- ทำได้แค่ระดับตื้น

**ตัวอย่าง:**

```javascript
const config = Object.seal({ host: "localhost", port: 3000 });
config.port = 8080;     // อนุญาต - แก้ไขได้
config.timeout = 5000;  // ล้มเหลว - เพิ่มไม่ได้
delete config.host;     // ล้มเหลว - ลบไม่ได้
```

---

### Private Fields + Getters

ห่อหุ้ม state พร้อมการเข้าถึงแบบอ่านอย่างเดียว

**ข้อจำกัด:**
- ต้องเขียน boilerplate มาก
- object ที่ซ้อนอยู่รั่วไหล reference ที่เปลี่ยนแปลงได้
- ไม่สามารถ serialize เป็น JSON ได้
- การสืบทอดทำได้ยาก

**ตัวอย่าง:**

```javascript
class ImmutableUser {
  #name;
  #email;

  constructor(name, email) {
    this.#name = name;
    this.#email = email;
  }

  get name() { return this.#name; }
  get email() { return this.#email; }

  withName(newName) {
    return new ImmutableUser(newName, this.#email);
  }
}

const user = new ImmutableUser("Alice", "alice@example.com");
const renamed = user.withName("Bob");
```

---

### Spread Operator

สร้าง object ใหม่พร้อม property ที่แก้ไขแล้ว

**ข้อจำกัด:**
- คัดลอกได้แค่ระดับตื้น
- การอัปเดตที่ซ้อนลึกจะยาวเยิ่นเย้อมาก
- สิ้นเปลือง memory จากการสร้าง object ใหม่

**ตัวอย่าง:**

```javascript
const original = { x: 1, y: 2, z: 3 };
const updated = { ...original, y: 10 };  // { x: 1, y: 10, z: 3 }

// การอัปเดตระดับลึก (ยาวเยิ่นเย้อ)
const state = { user: { profile: { name: "A" } } };
const newState = {
  ...state,
  user: { 
    ...state.user, 
    profile: { 
      ...state.user.profile, 
      name: "B" 
    } 
  }
};
```

---

### Object.defineProperty()

กำหนดค่า property อย่างละเอียด

**ข้อจำกัด:**
- ต้องเขียนมาก (เรียกใช้ทีละ property)
- ทำได้แค่ระดับตื้น

**ตัวอย่าง:**

```javascript
const constants = {};
Object.defineProperty(constants, 'PI', {
  value: 3.14159,
  writable: false,
  configurable: false
});
constants.PI = 0;  // ล้มเหลวแบบเงียบๆ
console.log(constants.PI); // 3.14159
```

---

## ไลบรารี

### Immutable.js

โครงสร้างข้อมูลถาวรพร้อมการแชร์โครงสร้าง

**ข้อจำกัด:**
- ขนาด bundle ประมาณ 60KB
- API แตกต่างจาก JS ดั้งเดิม
- ต้องใช้ `.toJS()` สำหรับการทำงานร่วมกัน
- การ debug แสดงโครงสร้างภายใน

**ตัวอย่าง:**

```javascript
import { Map, List } from 'immutable';

const map1 = Map({ a: 1, b: 2 });
const map2 = map1.set('b', 50);

console.log(map1.get('b')); // 2 (ไม่เปลี่ยนแปลง)
console.log(map2.get('b')); // 50

const list = List([1, 2, 3]);
const newList = list.push(4);  // คืนค่า List ใหม่
```

---

### Immer

เขียน "การเปลี่ยนแปลง" ที่สร้างการอัปเดตแบบ immutable ผ่าน Proxy

**ข้อจำกัด:**
- ไม่รองรับ IE11 (ใช้ Proxy)
- มี overhead ขณะ runtime
- draft object อาจรั่วไหลถ้าใช้ผิดกับ async

**ตัวอย่าง:**

```javascript
import { produce } from 'immer';

const state = { 
  todos: [{ text: "Learn JS", done: false }] 
};

const nextState = produce(state, draft => {
  draft.todos[0].done = true;
  draft.todos.push({ text: "Learn Immer", done: false });
});

console.log(state.todos[0].done);     // false (ไม่เปลี่ยนแปลง)
console.log(nextState.todos[0].done); // true
```

---

## อนาคต: Records & Tuples (Stage 2)

โครงสร้างข้อมูลที่ immutable อย่างลึกคล้าย primitive

**ข้อจำกัด:**
- ยังไม่พร้อมใช้งาน (อาจใช้เวลาหลายปี)
- บรรจุได้เฉพาะ primitive เท่านั้น

**ตัวอย่าง:**

```javascript
// Stage 2 Proposal - ยังไม่พร้อมใช้งาน
const point = #{ x: 10, y: 20 };
const coords = #[1, 2, 3];

point.x = 0;  // TypeError!
point === #{ x: 10, y: 20 }; // true (เปรียบเทียบตามค่า)
```

---

## ตารางเปรียบเทียบ

| วิธีการ | ลึก? | ยาวเยิ่นเย้อ? | ประสิทธิภาพ? | ในตัว? |
|---------|------|---------------|--------------|--------|
| Object.freeze() | ไม่ | ต่ำ | ปานกลาง | ใช่ |
| Object.seal() | ไม่ | ต่ำ | ปานกลาง | ใช่ |
| Private + Getters | ไม่ | สูง | ดี | ใช่ |
| Spread Operator | ไม่ | ปานกลาง | ปานกลาง | ใช่ |
| defineProperty() | ไม่ | สูง | ดี | ใช่ |
| Immutable.js | ใช่ | ปานกลาง | ดี | ไม่ |
| Immer | ใช่ | ต่ำ | ปานกลาง | ไม่ |

---

## เทียบเท่ากับ Scala

| Scala | JavaScript |
|-------|------------|
| `case class` | Class + private fields + getters + copy method |
| `val` | `const` + `Object.freeze()` |
| `List`, `Map` | `Immutable.List`, `Immutable.Map` |
| `.copy(field = value)` | `{ ...obj, field: value }` |

---

**สรุป:** JavaScript ต้องการความมีวินัยมากขึ้นหรือไลบรารีภายนอก เมื่อเทียบกับการรองรับ immutability ในตัวของ Scala

