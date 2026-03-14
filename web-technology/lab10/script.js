// MODEL
class CounterModel {
  constructor() {
    this.count = 0;
  }
  inc() { this.count++; }
  dec() { this.count--; }
  getValue() { return this.count; }
}

// VIEW
class CounterView {
  constructor() {
    this.counterEl = document.getElementById('counter');
    this.incBtn = document.getElementById('inc');
    this.decBtn = document.getElementById('dec');
  }
  render(value) {
    this.counterEl.textContent = value;
  }
}

// CONTROLLER
class CounterController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.incBtn.addEventListener('click', () => {
      this.model.inc();
      this.view.render(this.model.getValue());
    });

    this.view.decBtn.addEventListener('click', () => {
      this.model.dec();
      this.view.render(this.model.getValue());
    });

    this.view.render(this.model.getValue());
  }
}

new CounterController(new CounterModel(), new CounterView());

// MODEL
class CalcModel {
  calculate(a, b, op) {
    a = Number(a); b = Number(b);
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b !== 0 ? a / b : "Error";
    }
  }
}

// VIEW
class CalcView {
  constructor() {
    this.a = document.getElementById("a");
    this.b = document.getElementById("b");
    this.buttons = document.querySelectorAll("button[data-op]");
    this.result = document.getElementById("result");
  }

  render(value) {
    this.result.textContent = value;
  }
}

// CONTROLLER
class CalcController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const r = this.model.calculate(
          this.view.a.value,
          this.view.b.value,
          btn.dataset.op
        );
        this.view.render(r);
      });
    });
  }
}

new CalcController(new CalcModel(), new CalcView());

// MODEL
class TodoModel {
  constructor() {
    this.items = JSON.parse(localStorage.getItem("todos") || "[]");
    this.filter = "all";
  }

  save() {
    localStorage.setItem("todos", JSON.stringify(this.items));
  }

  add(text) {
    this.items.push({ id: Date.now(), text, done: false });
    this.save();
  }

  toggle(id) {
    const item = this.items.find(i => i.id === id);
    item.done = !item.done;
    this.save();
  }

  delete(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
  }

  setFilter(f) {
    this.filter = f;
  }

  getFiltered() {
    if (this.filter === "active")  return this.items.filter(i => !i.done);
    if (this.filter === "done")    return this.items.filter(i => i.done);
    return this.items;
  }
}

// VIEW
class TodoView {
  constructor() {
    this.input = document.getElementById("todo-input");
    this.addBtn = document.getElementById("add");
    this.list = document.getElementById("todo-list");
    this.filterBtns = document.querySelectorAll("button[data-filter]");
  }

  render(items) {
    this.list.innerHTML = "";

    items.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        <input type="checkbox" data-id="${item.id}" ${item.done ? "checked" : ""}>
        <span>${item.text}</span>
        <button data-del="${item.id}">X</button>
      `;
      this.list.appendChild(li);
    });
  }
}

// CONTROLLER
class TodoController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Add
    this.view.addBtn.addEventListener("click", () => {
      const text = this.view.input.value.trim();
      if (text) {
        this.model.add(text);
        this.view.input.value = "";
        this.update();
      }
    });

    // Toggle / Delete
    this.view.list.addEventListener("click", e => {
      if (e.target.dataset.id) {
        this.model.toggle(Number(e.target.dataset.id));
        this.update();
      }
      if (e.target.dataset.del) {
        this.model.delete(Number(e.target.dataset.del));
        this.update();
      }
    });

    // Filters
    this.view.filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.model.setFilter(btn.dataset.filter);
        this.update();
      });
    });

    this.update();
  }

  update() {
    this.view.render(this.model.getFiltered());
  }
}

new TodoController(new TodoModel(), new TodoView());
