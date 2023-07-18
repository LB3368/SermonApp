package com.devmountain.sermonApp.services;

import com.devmountain.sermonApp.dtos.CategoryDto;
import com.devmountain.sermonApp.entities.Category;
import com.devmountain.sermonApp.entities.Sermon;
import com.devmountain.sermonApp.repositories.CategoryRepository;
import com.devmountain.sermonApp.repositories.SermonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService{
    @Autowired
    private SermonRepository sermonRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<CategoryDto> getAllCategoriesBySermonId(Long sermonId) {
        Optional<Sermon> sermonOptional = sermonRepository.findById(sermonId);
        if (sermonOptional.isPresent()) {
            List<Category> categoryList = categoryRepository.findAllBySermonsEquals(sermonOptional.get());
            return categoryList.stream().map(category -> new CategoryDto(category)).collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    @Override
    @Transactional
    public void addCategory(CategoryDto categoryDto) {
        //Optional<Category> categoryOptional = categoryRepository.findById(categoryDto.getId());
        Category category = new Category(categoryDto);
        categoryRepository.saveAndFlush(category);
    }

    @Override
    @Transactional
    public void deleteCategoryById(Long categoryId) {
        Optional<Category> categoryOptional = categoryRepository.findById(categoryId);
        categoryOptional.ifPresent(categoryRepository::delete);
    }

    @Override
    @Transactional
    public void updateCategoryById(CategoryDto categoryDto) {
        Optional<Category> categoryOptional = categoryRepository.findById(categoryDto.getId());
        categoryOptional.ifPresent(category -> {
            category.setId(categoryDto.getId());
            categoryRepository.saveAndFlush(category);
        });
    }

    @Override
    public Optional<CategoryDto> getCategoryById(Long categoryId) {
        Optional<Category> categoryOptional = categoryRepository.findById(categoryId);
        if (categoryOptional.isPresent()) {
            return Optional.of(new CategoryDto(categoryOptional.get()));
        }
        return Optional.empty();
    }

    @Override
    public List<CategoryDto> getAllCategories() {
        List<Category> categoryList = categoryRepository.findAll();
        return categoryList.stream().map(CategoryDto::new).collect(Collectors.toList());
    }

    @Override
    public void updateCategory(CategoryDto categoryDto) {
        Optional<Category>categoryOptional = categoryRepository.findById(categoryDto.getId());
        categoryOptional.ifPresent(category -> {
            category.setName(categoryDto.getName());
            categoryRepository.saveAndFlush(category);
        });
    }

    @Override
    @Transactional
    public void deleteCategory(Long categoryId) {
        categoryRepository.deleteById(categoryId);
    }
}
