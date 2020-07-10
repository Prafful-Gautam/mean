import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validators';
import { Subscription } from 'rxjs';
import {AuthService} from '../../auth/auth.service';


@Component({
  selector: 'app-post-creat',
  templateUrl: './post-creat.component.html',
  styleUrls: ['./post-creat.component.css']
})
export class PostCreatComponent implements OnInit, OnDestroy {

  posts:Post[];
  postId:string;
  post:Post;
  imagePreview:string;
  form:FormGroup;
  isLoading = false;
  $authSubs: Subscription;
  mode = 'create';
  constructor(public postService: PostService, private active: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.$authSubs = this.authService.userAuthStatus().subscribe(res => {
      this.isLoading = false;
      console.log(res);
    })
    this.form = new FormGroup({
      title: new FormControl(null, {validators:[Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators:[Validators.required]}),
      image: new FormControl(null, {validators:[Validators.required], asyncValidators: [mimeType]})
      
    })
    this.active.paramMap.subscribe((param: ParamMap) => {
      if(param.has('postId')){
        this.mode = 'edit';
        this.postId = param.get('postId');
        this.postService.getPost(this.postId).subscribe(res =>{
          this.post = {
             id: res._id,
             title: res.title, 
             content: res.content, 
             imagePath: res.imagePath,
             creator: res.creator,
            };

          this.form.setValue({
            title: this.post.title,
            content:this.post.content,
            image:this.post.imagePath
          })
        });
        
      } else{
        this.mode = 'create';
        this.postId = null;
      }
      
    })
  }
  onImagePick(event:Event){
    const pic = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      image: pic
    })
    this.form.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string
    }
    reader.readAsDataURL(pic);
  }
  onAddPost(){
    // if(this.form.invalid){
    //   console.log('create mode')
    //   return
    // }
    this.isLoading = true;
    
    if(this.mode === 'create'){
     
      const post: Post = {
        id: null,
        title: this.form.value.title,
        content: this.form.value.content,
        imagePath: null,
        creator: null
      }
      
      this.postService.addPost(
        this.form.value.title, 
        this.form.value.content,
        this.form.value.image
        );
    }else
    this.postService.updatePost(
      this.postId, this.form.value.title, this.form.value.content, this.form.value.image)
  
   this.form.reset();
  }

  ngOnDestroy() {
    this.$authSubs.unsubscribe();
  }
}
