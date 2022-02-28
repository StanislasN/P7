import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { ApiComment, Comment } from '../model/comment.model';
import { User } from '../model/user.model';
import { AppConfigService } from './app-config.service';
import { AxiosClientService } from './axios-client.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  baseComments: any;

  constructor(
    private axios: AxiosClientService,
    private appConfig: AppConfigService,
    public datepipe: DatePipe,
  ) {
    this.baseComments = `${this.appConfig.config.baseComments}`
  }
  async getAllComment(): Promise<Array<Comment>> {
    const data: Array<ApiComment> = await this.axios.get({ path: this.baseComments });
    return data.map(
      (e) => {
        const user = new User(
          e.users_id,
          e.users_lastName,
          e.users_firstName,
          e.users_mail,
          e.users_pwd,
          e.users_birthday,
          e.users_isAdmin
        )
        return new Comment(
          e.comments_id,
          user,
          e.comments_content,
        )
      }
    )
  }

  async createAComment(postData: any): Promise<Comment> {
    const data = await this.axios.post({
      path: this.baseComments,
      params: postData
    })
    const newComment = new Comment(data[0].comments_id, null, data[0].comments_content)
    return newComment
  }

  async deleteComment(commentId) {
    const data = await this.axios.delete({
      path: `${this.baseComments}/${commentId}`
    });
    return data;
  }
}