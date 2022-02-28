import { Post } from "./post.model"
import { User } from "./user.model"

export interface ApiComment {
    comments_id: number
    comments_author: number
    comments_content: string
    comments_post: number
    posts_id?: number
    posts_author?: number
    posts_title?: string
    posts_file?: any
    posts_dateOfPublish?: any
    posts_likes?: number
    posts_unlikes?: number
    posts_numberOfComments?: number
    users_id?: number
    users_lastName?: string
    users_firstName?: string
    users_pwd?: string
    users_mail?: string
    users_birthday?: any
    users_isAdmin?: number
}

export class Comment {
    id: number
    author: User
    content: string
    post: Post

    constructor(id: number, author: User, content: string) {
        this.id = id,
            this.author = author,
            this.content = content
    }

    getApiData(): ApiComment {
        return {
            comments_id: this.id,
            comments_author: this.author.id,
            comments_content: this.content,
            comments_post: this.post.id
        }
    }
}