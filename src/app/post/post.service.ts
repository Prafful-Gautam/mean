import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {
private posts: Post[] = []
private updatedPost = new Subject<Post[]>();
  constructor(public http: HttpClient, private router:Router) { }

  getPosts(pageSize:number, page:number){
    const query = `?pageSize=${pageSize}&page=${page}`;
    return this.http.get<{message:string, posts:any}>(
      'http://localhost:3000/app/posts' + query)
      .pipe(map((postData) => {
        return postData.posts.map(post =>{
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          }

        })
      }))
      .subscribe((transformedPost) => {
        this.posts = transformedPost;
        console.log(this.posts);
        this.updatedPost.next([...this.posts]);
      });
  }

  getPostUpdateListner(){
    return this.updatedPost.asObservable();
  }
  addPost(title:string, content:string, image:File){
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content",content);
    postData.append("image", image, title)
    this.http.post<{message:string, post:Post}>("http://localhost:3000/app/posts", postData)
      .subscribe(responseData => {
        const post:Post = {
          id: responseData.post.id, 
          title: responseData.post.title, 
          content: responseData.post.content,
          imagePath: responseData.post.imagePath,
          creator: null
        };
        this.posts.push(post);
        this.updatedPost.next([...this.posts]);
        this.router.navigate(['/']);
      });
 
  }

  getPost(id:string){
    return this.http.get<{_id:string, title:string, content:string, imagePath:string, creator: string}>('http://localhost:3000/app/posts/'+id);
  }
  updatePost(id:string, title:string, content:string, image: File|string){
    //const post:Post = {id: id, title: title, content: content, imagePath:null}
    let postData: Post|FormData
    if(typeof image === 'object'){
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image)
    }else{
      postData = {id: id, title: title, content: content, imagePath: image, creator: null}
    }
    this.http.put("http://localhost:3000/app/posts/" + id, postData)
      .subscribe((response) => {
        console.log(response);
        const updatePosts = [...this.posts];
        const oldPostIndex = updatePosts.findIndex(p => p.id === id);
        const post = {id: id, title: title, content: content, imagePath: "", creator: null}
        updatePosts[oldPostIndex] = post;
        this.posts = updatePosts;
        this.updatedPost.next([...this.posts]);
        this.router.navigate(['/']);
      },
      err => console.log('==================>',err));
  }

  deletePost(postId){
    return this.http.delete(`http://localhost:3000/app/posts/${postId}`)
      .subscribe(() => {
        const postUpdate = this.posts.filter((post) => post.id !== postId);
        this.posts = postUpdate;
        this.updatedPost.next([...this.posts]);
      })
  }
}
