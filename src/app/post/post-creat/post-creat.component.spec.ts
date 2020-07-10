import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCreatComponent } from './post-creat.component';

describe('PostCreatComponent', () => {
  let component: PostCreatComponent;
  let fixture: ComponentFixture<PostCreatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostCreatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCreatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
