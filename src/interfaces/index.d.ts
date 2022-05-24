export interface ICategory {
  id: number;
  title: string;
}

export interface IPost {
  id: string;
  title: string;
  status: "published" | "draft" | "rejected";
  category: { id: string };
  createdAt: string;
}
