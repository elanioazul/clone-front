import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories.service';
import { TagsService } from 'src/app/services/tags.service';
import { Tag } from 'src/app/types/tag';
import { switchMap } from 'rxjs/operators';
import { Image } from 'src/app/types/image';
import { ImageService } from 'src/app/services/image.service';
import { Category } from 'src/app/types/category';

@Component({
  selector: 'app-image-card',
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.scss']
})
export class ImageCardComponent implements OnInit {

  @Input() image: Image;

  categories$: Observable<[]>;
  tags: Tag[];
  defaultCategory = { title: '' };
  inputTitle: String = '';

  constructor(
    private categoriesService: CategoriesService,
    private tagsService: TagsService,
    private imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.image['isSelected'] = {
      categories: false,
      tags: false,
    };
    this.image['title'] = this.image['name']
    this.categories$ = this.categoriesService.getCategories();
    this.tagsService.getTags().subscribe((tags: Tag[]) => this.tags = tags);
  }

  toggleSelectCategories(image: Image) {
    image['isSelected'].categories = !image['isSelected'].categories;
    image['isSelected'].tags = false;
  }

  toggleSelectTags(image: Image) {
    image['isSelected'].tags = !image['isSelected'].tags;
    image['isSelected'].categories = false;
  }

  updateTitle(title: String) {
    this.image['name'] = title;
    this.updateImage();
  }

  selectCategory(image: Image, category: Category) {
    if (category.title) {
      image.category = category;
    } else {
      image.category = null;
    }
    this.updateImage();
  }

  selectTag(tag: Tag, image: Image) {
    this.image.tags.push(tag);
    this.updateImage();
  }

  unSelectTag(tag: Tag, image: Image) {
    const imageList = this.image.tags.filter((t: Tag) => t.id !== tag.id);
    image.tags = imageList;
    this.updateImage();
  }

  addTag(tag: Tag) {
    this.tagsService.addTag(tag)
      .pipe(
        switchMap(_ => this.tagsService.getTags())
      )
      .subscribe((tags: Tag[]) => this.tags = tags);
  }

  private updateImage() {
    this.imageService.updateImage(this.image).subscribe(res => {
      if (!res.category) {
        res.category = this.defaultCategory
      }
    })
  }

}
