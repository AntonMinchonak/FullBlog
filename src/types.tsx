export interface PostType {
    title: string,
    text: string,
    viewsCount: number,
    tags: string[],
    user: userType | undefined,
    imageUrl: string,
    createdAt: string,
    _id: string,
    userLikes: userType[],
    commentsAmount: number
}


export interface userType {
    fullName: string,
    email?: string,
    passwordHash?: string,
    avatarUrl?: string
    createdAt: string
    _id: string;
    follow: string[]
}

export interface CommentType {
    postId: string
    text: string,
    user: userType | undefined,
    imageUrl: string,
    createdAt: string,
    _id: string,
    userLikes: userType[]
}