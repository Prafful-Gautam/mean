import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
 totalPost = 10;
 postPerPage = 2;
 currentPage = 1;
 pageSizeOptions = [1,2,5,10];
 post: Post[] = [];
 userId: string;
 isLoading = false
 authStatus = false;
  private postSubs: Subscription;
  private authSubs: Subscription;
  constructor(public postService: PostService, private authService:AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postService.getPosts(this.postPerPage, this.currentPage);
  
    this.postSubs = this.postService.getPostUpdateListner()
      .subscribe((posts: Post[]) => {
        this.post = posts
        this.isLoading = false
        console.log(posts)
      })
      this.authStatus = this.authService.getIsUserAuth();
    
     this.authSubs = this.authService.userAuthStatus().subscribe(auth => {
        this.authStatus = auth;
        this.userId = this.authService.getUserId();
        console.log('=============>'+this.authStatus)
      })  
  }

  onPageChange(event:PageEvent){
    this.currentPage = event.pageIndex + 1;
    this.postPerPage = event.pageSize;
    this.postService.getPosts(this.postPerPage, this.currentPage)
  }
  onDelete(postId:string){
    
   this.postService.deletePost(postId);
   this.isLoading = false
  }
  ngOnDestroy(){
    this.postSubs.unsubscribe();
    this.authSubs.unsubscribe();
  }

}
