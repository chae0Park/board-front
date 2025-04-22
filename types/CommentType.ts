export interface Comment {
    id: string;
    _id?: string;
    profileImage?: string | null; // 프로필 이미지
    userId?: string; // 사용자 ID (User 모델과 참조)
    content: string; // 댓글 내용
    author?: string;
    createdAt?: string; // 작성일
    updatedAt?: Date | null; // 수정일 (nullable)
    like?: number; // 좋아요 수
    likedBy?: string[]; // 좋아요를 누른 사용자들의 ID (User 모델과 참조)
    postId?: string; // 게시물 ID (Post 모델과 참조)
    parentId: string | null; // 부모 댓글 ID (Comment 모델과 참조, 댓글이 아닌 경우 null)
    replies?: ReplyType[];
  }


  export interface ReplyType {
    key: string;
    _id: string; 
    author: string; 
    profileImage: string; 
    timestamp: string; 
    createdAt: string;
    content: string; 
  }