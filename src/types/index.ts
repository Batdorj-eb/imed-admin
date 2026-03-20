export type Role = "admin" | "editor" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: string;
  isActive: boolean;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  token?: string;
}

export interface ProductFeature {
  id?: number;
  feature: string;
  feature_en: string;
  sort_order?: number;
}

export interface ProductSpecification {
  id?: number;
  spec_key: string;
  spec_value: string;
  sort_order?: number;
}

export interface InformationItem {
  id: number;
  image: string;
  title_mn: string;
  title_en: string;
  description_mn: string;
  description_en: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  brand: string;
  category_id?: string;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  image: string;
  brochure?: string;
  is_featured?: boolean;
  is_new?: boolean;
  features?: ProductFeature[];
  specifications?: ProductSpecification[];
  created_at?: string;
  updated_at?: string;
}

export type InquiryType = "product" | "service";

export interface ProductInquiry {
  id: number;
  organization_name: string;
  phone: string;
  email: string;
  product_name: string;
  product_id: number | null;
  brand: string;
  requirements: string;
  inquiry_type: InquiryType;
  is_read: boolean;
  created_at: string;
}
