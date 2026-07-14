// 1. HELPER DELAY (Simulasi Jaringan)
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// 2. MOCK DATABASE (15 Akun Unik)
const USERS = {
  "admin@shop.test": { password: "admin123", user: { id: "u-1", name: "Andi Admin", email: "admin@shop.test", role: "admin" } },
  "editor@shop.test": { password: "editor123", user: { id: "u-2", name: "Eka Editor", email: "editor@shop.test", role: "editor" } },
  "user@shop.test": { password: "user123", user: { id: "u-3", name: "Umar User", email: "user@shop.test", role: "user" } },
  "budi@shop.test": { password: "budi123", user: { id: "u-4", name: "Budi Budiman", email: "budi@shop.test", role: "user" } },
  "citra@shop.test": { password: "citra123", user: { id: "u-5", name: "Citra Lestari", email: "citra@shop.test", role: "editor" } },
  "dewi@shop.test": { password: "dewi123", user: { id: "u-6", name: "Dewi Sartika", email: "dewi@shop.test", role: "user" } },
  "fajar@shop.test": { password: "fajar123", user: { id: "u-7", name: "Fajar Ramadan", email: "fajar@shop.test", role: "user" } },
  "gita@shop.test": { password: "gita123", user: { id: "u-8", name: "Gita Wirjawan", email: "gita@shop.test", role: "admin" } },
  "hendri@shop.test": { password: "hendri123", user: { id: "u-9", name: "Hendri Setiawan", email: "hendri@shop.test", role: "user" } },
  "indah@shop.test": { password: "indah123", user: { id: "u-10", name: "Indah Permata", email: "indah@shop.test", role: "editor" } },
  "joko@shop.test": { password: "joko123", user: { id: "u-11", name: "Joko Widodo", email: "joko@shop.test", role: "user" } },
  "kartika@shop.test": { password: "kartika123", user: { id: "u-12", name: "Kartika Chandra", email: "kartika@shop.test", role: "user" } },
  "lukman@shop.test": { password: "lukman123", user: { id: "u-13", name: "Lukman Hakim", email: "lukman@shop.test", role: "editor" } },
  "megawati@shop.test": { password: "mega123", user: { id: "u-14", name: "Megawati Sukarnoputri", email: "megawati@shop.test", role: "admin" } },
  "naufal@shop.test": { password: "naufal123", user: { id: "u-15", name: "Naufal Rizqi", email: "naufal@shop.test", role: "user" } }
};

// 3. ENDPOINT: REGISTER
export async function registerApi({ name, email, password, role = "user" }) {
  await delay();
  if (!name || !email || !password) {
    throw new Error("Missing fields: Nama, email, dan password wajib diisi!");
  }
  const normalizedEmail = String(email).toLowerCase();
  if (USERS[normalizedEmail]) {
    throw new Error("Registration Failed: Email sudah terdaftar!");
  }
  
  const newId = `u-${Object.keys(USERS).length + 1}`;
  const newUser = { id: newId, name, email: normalizedEmail, role };
  const token = `mock-token-${role}-${btoa(normalizedEmail)}-${Date.now()}`;
  USERS[normalizedEmail] = { password, user: newUser, token };
  
  return { message: "Register berhasil!", token, user: newUser };
}

// 4. ENDPOINT: LOGIN
export async function loginApi({ email, password }) {
  await delay();
  if (!email || !password) {
    throw new Error("Login Gagal: Email dan Password wajib diisi!");
  }
  
  const normalizedEmail = String(email).toLowerCase();
  const entry = USERS[normalizedEmail];
  
  if (!entry || entry.password !== password) {
    throw new Error("Login Gagal: Email atau password salah!");
  }

  const token = entry.token || `mock-token-${entry.user.role}-${btoa(normalizedEmail)}-${Date.now()}`;
  USERS[normalizedEmail].token = token;

  return { token, user: entry.user };
}

// 5. ENDPOINT: LIST USERS (Protected)
export async function fetchUsersApi(token) {
  await delay();
  if (!token || !token.startsWith("mock-token-")) {
    throw new Error("Access Denied: Token tidak valid.");
  }
  return Object.values(USERS).map(entry => entry.user);
}

// 6. ENDPOINT: SINGLE USER (Protected)
export async function fetchSingleUserApi(token, id) {
  await delay();
  if (!token || !token.startsWith("mock-token-")) {
    throw new Error("Access Denied: Token tidak valid.");
  }
  const entry = Object.values(USERS).find(e => e.user.id === id);
  if (!entry) {
    throw new Error("User tidak ditemukan");
  }
  return entry.user;
}

// 7. ENDPOINT: FETCH PROFILE (Protected)
export async function fetchProfileApi(token) {
  await delay();
  if (!token || !token.startsWith("mock-token-")) {
    throw new Error("Unauthorized: Token profil tidak valid.");
  }

  const tokenParts = token.split('-');
  const base64Email = tokenParts[3]; 
  
  if (!base64Email) {
    throw new Error("Unauthorized: Format token rusak.");
  }

  try {
    const targetEmail = atob(base64Email);
    const entry = USERS[targetEmail];

    if (!entry) {
      throw new Error("Profile tidak ditemukan.");
    }
    
    return entry.user;
  } catch (e) {
    throw new Error("Unauthorized: Gagal memproses enkripsi token.");
  }
}

// 8. UTILITY: FORMAT RUPIAH (Digunakan oleh ProductCard)
export function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
}


// 9. MOCK DATA PRODUCTS (Untuk Halaman Products)
const PRODUCTS = [
  { id: 1, name: "Product A", price: 150000, description: "Deskripsi produk A yang sangat menarik." },
  { id: 2, name: "Product B", price: 250000, description: "Deskripsi produk B dengan kualitas premium." },
  { id: 3, name: "Product C", price: 350000, description: "Deskripsi produk C, pilihan terbaik untuk Anda." }
];

// Endpoint untuk mengambil semua produk
export async function fetchProducts() {
  await delay();
  return PRODUCTS;
}

// Endpoint untuk mengambil satu produk berdasarkan ID (jika dibutuhkan)
export async function fetchProduct(id) {
  await delay();
  const product = PRODUCTS.find(p => p.id === Number(id));
  if (!product) {
    throw new Error("Produk tidak ditemukan");
  }
  return product;
}

// 10. MOCK DATA ORDERS (Untuk Halaman Orders)
const ORDERS = [
  { id: "ORD-101", customerName: "Budi Budiman", items: "Product A", total: 150000, status: "Selesai" },
  { id: "ORD-102", customerName: "Citra Lestari", items: "Product B", total: 250000, status: "Diproses" },
  { id: "ORD-103", customerName: "Umar User", items: "Product C", total: 350000, status: "Menunggu Pembayaran" }
];

// Endpoint untuk mengambil seluruh data order
export async function fetchOrders() {
  await delay();
  return ORDERS;
}

// Endpoint untuk mengambil satu data order spesifik (sesuai import 'fetchOrder' di Orders.jsx)
export async function fetchOrder(id) {
  await delay();
  const order = ORDERS.find(o => o.id === id);
  if (!order) {
    throw new Error("Order tidak ditemukan");
  }
  return order;
}