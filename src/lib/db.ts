import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { Product, User, Category } from "@/types";

const DATA_DIR = join(process.cwd(), "data");

function readJson<T>(filename: string): T {
  const filePath = join(DATA_DIR, filename);
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function writeJson<T>(filename: string, data: T): void {
  const filePath = join(DATA_DIR, filename);
  writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function getProducts(): Product[] {
  return readJson<{ products: Product[] }>("products.json").products;
}

export function getProduct(id: string): Product | undefined {
  return getProducts().find((p) => String(p.id) === id);
}

export function createProduct(product: Product): Product {
  const data = readJson<{ products: Product[] }>("products.json");
  data.products.push(product);
  writeJson("products.json", data);
  return product;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const data = readJson<{ products: Product[] }>("products.json");
  const index = data.products.findIndex((p) => String(p.id) === id);
  if (index === -1) return null;
  data.products[index] = { ...data.products[index], ...updates };
  writeJson("products.json", data);
  return data.products[index];
}

export function deleteProduct(id: string): boolean {
  const data = readJson<{ products: Product[] }>("products.json");
  const index = data.products.findIndex((p) => String(p.id) === id);
  if (index === -1) return false;
  data.products.splice(index, 1);
  writeJson("products.json", data);
  return true;
}

export function getCategories(): Category[] {
  return readJson<{ categories: Category[] }>("categories.json").categories;
}

export function getUsers(): User[] {
  return readJson<{ users: User[] }>("users.json").users;
}

export function getUser(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email === email);
}

export function createUser(user: User): User {
  const data = readJson<{ users: User[] }>("users.json");
  data.users.push(user);
  writeJson("users.json", data);
  return user;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const data = readJson<{ users: User[] }>("users.json");
  const index = data.users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  data.users[index] = { ...data.users[index], ...updates };
  writeJson("users.json", data);
  return data.users[index];
}

export function deleteUser(id: string): boolean {
  const data = readJson<{ users: User[] }>("users.json");
  const index = data.users.findIndex((u) => u.id === id);
  if (index === -1) return false;
  data.users.splice(index, 1);
  writeJson("users.json", data);
  return true;
}
