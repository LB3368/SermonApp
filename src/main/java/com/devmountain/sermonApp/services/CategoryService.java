package com.devmountain.sermonApp.services;

import com.devmountain.sermonApp.dtos.CategoryDto;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface CategoryService {
    List<CategoryDto> getAllCategoriesBySermonId(Long sermonId);

    @Transactional
    void addCategory(CategoryDto categoryDto);

    @Transactional
    void deleteCategoryById(Long categoryId);

    @Transactional
    void updateCategoryById(CategoryDto categoryDto);

    Optional<CategoryDto> getCategoryById(Long categoryId);

    List<CategoryDto> getAllCategories();

    void updateCategory(CategoryDto categoryDto);

    void deleteCategory(Long categoryId);
}
