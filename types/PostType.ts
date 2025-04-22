// types/PostType.ts

export interface Post {
  score?: number;
  id: string;
  _id: string;
  userId?: string;
  profileImage?: string | null;
  title: string;
  content: string;
  author: string;
  createdAt?: string | null;
  updatedAt?: string | null;  
  files?: string[];
  views?: number;
  like?: number;
  likedBy?: string[];
  comments?: string[];
}

export interface Top3Props {
  post: {
      id: string;
      _id: string;
      profileImage: string | null;
      author: string;
      createdAt: string | null;
      title: string;
      content: string;
      comments: string[];
      like: number;
      views: number;
  } | null;
}

export type CalculateScoreData = {
  like?: number;
  comments?: string[];
  views?: number;
}




