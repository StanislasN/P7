import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { ApiComment, Comment } from '../model/comment.model';
import { Post } from '../model/post.model';
import { User } from '../model/user.model';
import { AppConfigService } from '../_service/app-config.service';
import { AuthService } from '../_service/auth.service';
import { CommentService } from '../_service/comment.service';
import { PostService } from '../_service/post.service';
import { SnackBarComponent } from '../_ui/snack-bar/snack-bar.component';

@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.scss']
})
export class PostFeedComponent implements OnInit {

  @ViewChild('inputPhoto') inputPhoto

  //isAdmin = false
  userConnected = false
  createAPost: FormGroup
  createAComment: FormGroup
  posts: Array<Post> = []
  

  constructor(
    public appConfigService: AppConfigService,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    public datepipe: DatePipe,
    private postService: PostService,
    private router: Router,
    private commentService: CommentService,
    private snackBar: MatSnackBar) { }



  ngOnInit() {
    this.createAPost = this.formBuilder.group({
      title: [''],
      photo: ['']
    });

    this.createAComment = this.formBuilder.group({
      content: [''],
    });
    this.initForm()

    this.userConnected = this.authService.loggedInUser.users_lastName
  }

  async initForm() {
    this.posts = await this.postService.getAllPost()
    this.posts.reverse()
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.createAPost.get('photo').setValue(file);
    }
  }

  async onSubmitNewPost() {
    const formValue = this.createAPost.value

    let date = formValue['dateOfPublish']
    const today = new Date()
    const dateOfPostPublish = this.datepipe.transform(today, 'yyyy-MM-dd');

    const newPost: Post = new Post(
      0,
      new User(this.authService.loggedInUser.users_id),
      formValue['title'],
      formValue['photo'],
      dateOfPostPublish,
      []
    )

    const apiData = newPost.getApiData()
    const formData = new FormData();
    for (let [key, value] of Object.entries(apiData)) {
      formData.append(key, value)
    }

    const result: Post = await this.postService.createAPost(formData)
    if (result) {
      result.author = this.authService.currentUser
      this.posts.unshift(result)
      this.createAPost.reset()
      this.inputPhoto.nativeElement.value = ""
    } else {
      this.snackBar.openFromComponent(SnackBarComponent, {
        data: 'Il y a eu un problème à la création du post',
        duration: 2000
      });
    }
  }

  async onSubmitNewComment(postId) {
    const formValue = this.createAComment.value
    const commentValue: ApiComment = {
      comments_id: 0,
      comments_author: this.authService.loggedInUser.users_id,
      comments_content: formValue.content,
      comments_post: postId
    }
    const result: Comment = await this.commentService.createAComment(commentValue)
    if (result) {
      result.author = new User(this.authService.loggedInUser.users_id)
      result.author.firstName = this.authService.loggedInUser.users_firstName
      result.author.lastName = this.authService.loggedInUser.users_lastName
      this.posts.find(e => e.id === postId).comments.push(result)
    }
  }


  async deletePost(postId) {
    const result = await this.postService.deletePost(postId)
    if (result) {
      const indexOf = this.posts.findIndex(e => postId === e.id)
      this.posts.splice(indexOf, 1)
    } else {
      this.snackBar.openFromComponent(SnackBarComponent, {
        data: 'Il y a eu un problème à la suppression du commentaire',
        duration: 2000
      });
    }
  }

  async deleteComment(commentId, postId) {
    const result = await this.commentService.deleteComment(commentId)
    if (result) {
      const targetPost = this.posts.find(e => postId === e.id)
      const indexOf = targetPost.comments.findIndex(e => commentId === e.id)
      targetPost.comments.splice(indexOf, 1)
    } else {
      this.snackBar.openFromComponent(SnackBarComponent, {
        data: 'Il y a eu un problème à la suppression du commentaire',
        duration: 2000
      });
    }
  }

}
