import { ApiComment, Comment } from "./comment.model"
import { User } from "./user.model"

export interface ApiPost {
    posts_id: number,
    posts_author: number,
    posts_title: string,
    posts_file: any,
    posts_dateOfPublish: any,
    users_id?: number
    users_lastName?: string
    users_firstName?: string
    users_pwd?: string
    users_mail?: string
    users_birthday?: any
    users_isAdmin?: number
    comments?: Array<ApiComment>
}

export class Post {
    id: number
    author: User
    title: string
    file: any
    dateOfPublish: any
    comments: Array<Comment>

    constructor(id: number, author: User, title: string, file: any, dateOfPublish: any, comments: Array<Comment>) {
        this.id = id,
            this.author = author,
            this.title = title,
            this.dateOfPublish = dateOfPublish,
            this.file = file,
            this.comments = comments
    }

    getApiData(): ApiPost {
        return {
            posts_id: this.id,
            posts_author: this.author.id,
            posts_title: this.title,
            posts_file: this.file,
            posts_dateOfPublish: this.dateOfPublish
        }
    }
}