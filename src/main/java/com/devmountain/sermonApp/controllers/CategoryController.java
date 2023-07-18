package com.devmountain.sermonApp.controllers;

import com.devmountain.sermonApp.dtos.CategoryDto;
import com.devmountain.sermonApp.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/category/{categoryId}")
    public List<CategoryDto> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/{categoryId}")
    public Optional<CategoryDto> getCategory(@PathVariable Long categoryId) {
        return categoryService.getCategoryById(categoryId);
    }

    @PostMapping
    public void addCategory(@RequestBody CategoryDto categoryDto) {
        categoryService.addCategory(categoryDto);
    }

    @PutMapping("/{categoryId}")
    public void updateCategory(@RequestBody CategoryDto categoryDto, @PathVariable Long categoryId) {
        categoryDto.setId(categoryId);
        categoryService.updateCategory(categoryDto);
    }

    @DeleteMapping("/{categoryId}")
    public void deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
    }
}
