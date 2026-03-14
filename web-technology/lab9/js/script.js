class Device {
  constructor(name, brand, price) {
    this.name = name;
    this.brand = brand;
    this.price = price;
  }

  info() {
    return `${this.brand} ${this.name} — ${this.price} тг`;
  }
}

class Phone extends Device {
  constructor(name, brand, price, camera) {
    super(name, brand, price);
    this.camera = camera;
  }

  info() {
    return `${super.info()} | Камера: ${this.camera} МП`;
  }
}

class Laptop extends Device {
  constructor(name, brand, price, cpu) {
    super(name, brand, price);
    this.cpu = cpu;
  }

  info() {
    return `${super.info()} | Процессор: ${this.cpu}`;
  }
}

class Tablet extends Device {
  constructor(name, brand, price, screenSize) {
    super(name, brand, price);
    this.screenSize = screenSize;
  }

  info() {
    return `${super.info()} | Экран: ${this.screenSize}"`;
  }
}

fetch("./devices.json")
  .then((response) => response.json())
  .then((data) => {
    const container = document.getElementById("device-list");

    data.forEach((item) => {
      let device;

      switch (item.type) {
        case "Phone":
          device = new Phone(item.name, item.brand, item.price, item.camera);
          break;
        case "Laptop":
          device = new Laptop(item.name, item.brand, item.price, item.cpu);
          break;
        case "Tablet":
          device = new Tablet(
            item.name,
            item.brand,
            item.price,
            item.screenSize
          );
          break;
        default:
          return;
      }

      const card = document.createElement("div");
      card.className = "device-card";
      card.innerHTML = `
        <h2>${device.brand}</h2>
        <p><strong>Модель:</strong> ${device.name}</p>
        <p><strong>Описание:</strong> ${device.info()}</p>
      `;
      container.appendChild(card);
    });
  })
  .catch((err) => {
    console.error("Ошибка загрузки", err);
  });
