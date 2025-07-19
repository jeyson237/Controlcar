import { renderRegisterForm } from './components/formRegister.js';
import { renderCarList } from './components/listCars.js';
import { renderDashboard } from './components/panelDashboard.js';

const appView = document.getElementById('app-view');
const navBtns = document.querySelectorAll('.nav-btn');

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const view = btn.getAttribute('data-view');
    loadView(view);
  });
});

function loadView(view) {
  switch (view) {
    case 'register':
      appView.innerHTML = renderRegisterForm();
      bindFormEvents();
      break;
    case 'list':
      const cars = JSON.parse(localStorage.getItem('cars') || '[]');
      appView.innerHTML = renderCarList(cars);
      bindListEvents();
      break;
    case 'dashboard':
      const allCars = JSON.parse(localStorage.getItem('cars') || '[]');
      appView.innerHTML = renderDashboard(allCars);
      break;
  }
}

function bindFormEvents() {
  const form = document.getElementById('carForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const car = {
      id: Date.now(),
      photo: await toBase64(document.getElementById('carPhoto').files[0]),
      plate: document.getElementById('carPlate').value.trim(),
      brand: document.getElementById('carBrand').value.trim(),
      model: document.getElementById('carModel').value.trim(),
      year: document.getElementById('carYear').value.trim(),
      status: document.getElementById('carStatus').value,
      rentalHistory: []
    };

    if (!car.plate || !car.brand || !car.model || !car.year) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const cars = JSON.parse(localStorage.getItem('cars') || '[]');
    cars.push(car);
    localStorage.setItem('cars', JSON.stringify(cars));

    alert("Vehículo registrado correctamente.");
    form.reset();
  });
}

function bindListEvents() {
  document.getElementById('filterStatus').addEventListener('change', (e) => {
    const selected = e.target.value;
    const allCars = JSON.parse(localStorage.getItem('cars') || '[]');
    const filtered = selected === "todos" ? allCars : allCars.filter(car => car.status === selected);
    document.getElementById('carListContainer').innerHTML = filtered.map(renderCarCard).join("");
    attachEditDeleteListeners();
  });

  attachEditDeleteListeners();
}

function attachEditDeleteListeners() {
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      let cars = JSON.parse(localStorage.getItem('cars') || '[]');
      cars = cars.filter(car => car.id != id);
      localStorage.setItem('cars', JSON.stringify(cars));
      loadView('list');
    });
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      alert("Función de edición aún no implementada.");
    });
  });

  document.querySelectorAll('.rent-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      let cars = JSON.parse(localStorage.getItem('cars') || '[]');
      const car = cars.find(c => c.id == id);
      car.status = 'alquilado';
      car.rentalHistory = car.rentalHistory || [];
      car.rentalHistory.push({ rentedAt: new Date().toISOString().split('T')[0], returnedAt: null });
      localStorage.setItem('cars', JSON.stringify(cars));
      loadView('list');
    });
  });

  document.querySelectorAll('.return-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      let cars = JSON.parse(localStorage.getItem('cars') || '[]');
      const car = cars.find(c => c.id == id);
      car.status = 'disponible';
      if (car.rentalHistory && car.rentalHistory.length > 0) {
        const lastRental = car.rentalHistory[car.rentalHistory.length - 1];
        if (!lastRental.returnedAt) {
          lastRental.returnedAt = new Date().toISOString().split('T')[0];
        }
      }
      localStorage.setItem('cars', JSON.stringify(cars));
      loadView('list');
    });
  });
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function renderCarCard(car) {
  const isDisponible = car.status === 'disponible';
  const isAlquilado = car.status === 'alquilado';

  return \`
    <div class="border p-4 rounded shadow">
      <img src="\${car.photo || 'https://via.placeholder.com/300x200'}" class="w-full h-40 object-cover rounded mb-2" />
      <p><strong>Placa:</strong> \${car.plate}</p>
      <p><strong>Marca:</strong> \${car.brand}</p>
      <p><strong>Modelo:</strong> \${car.model}</p>
      <p><strong>Año:</strong> \${car.year}</p>
      <p><strong>Estado:</strong> \${car.status}</p>
      <div class="flex gap-2 mt-2 flex-wrap">
        \${isDisponible ? \`<button class="rent-btn bg-green-600 text-white px-2 py-1 rounded" data-id="\${car.id}">Alquilar</button>\` : ''}
        \${isAlquilado ? \`<button class="return-btn bg-blue-600 text-white px-2 py-1 rounded" data-id="\${car.id}">Devolver</button>\` : ''}
        <button class="edit-btn bg-yellow-500 text-white px-2 py-1 rounded" data-id="\${car.id}">Editar</button>
        <button class="delete-btn bg-red-600 text-white px-2 py-1 rounded" data-id="\${car.id}">Eliminar</button>
      </div>
    </div>
  \`;
}

loadView('register');
