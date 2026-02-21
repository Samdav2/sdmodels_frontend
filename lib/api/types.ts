/**
 * TypeScript types for API responses
 */

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  user_type: 'buyer' | 'creator' | 'admin';
  is_verified: boolean;
  is_verified_creator: boolean;
  avatar_url: string | null;
  bio: string | null;
  location?: string | null;
  website?: string | null;
  total_sales: number;
  total_models: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface Model {
  id: number;
  title: string;
  description: string;
  price: number;
  is_free: boolean;
  category: string;
  tags: string[];
  file_url: string;
  thumbnail_url: string;
  preview_images: string[];
  file_size: number;
  file_formats: string[];
  poly_count: number;
  vertex_count: number;
  texture_resolution: string | null;
  has_animations: boolean;
  has_rigging: boolean;
  has_materials: boolean;
  has_textures: boolean;
  creator?: User;
  creator_id?: number;
  views: number;
  likes: number;
  downloads: number;
  rating: number;
  rating_count: number;
  status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  is_published?: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  author: User;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  comment_count: number;
  read_time: number;
  status: 'draft' | 'published';
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Community {
  id: number;
  name: string;
  description: string;
  icon: string;
  banner_gradient: string;
  category: string;
  creator: User;
  member_count: number;
  post_count: number;
  status: 'active' | 'inactive';
  is_private: boolean;
  require_approval: boolean;
  rules: string[];
  created_at: string;
  updated_at: string;
}

export interface CommunityPost {
  id: number;
  author: User;
  content: string;
  image_url: string | null;
  model_url: string | null;
  reactions: Record<string, number>;
  comment_count: number;
  share_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: number;
  owner: User;
  name: string;
  description: string | null;
  is_public: boolean;
  model_count: number;
  views: number;
  followers: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  buyer: User;
  seller: User;
  model: Model;
  amount: number;
  platform_fee: number;
  seller_amount: number;
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id: string;
  created_at: string;
  completed_at: string | null;
}

export interface CartItem {
  id: number;
  model: Model;
  added_at: string;
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Comment {
  id: number;
  user: User;
  content: string;
  likes: number;
  replies: Comment[];
  created_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  detail: string;
  status_code: number;
}
