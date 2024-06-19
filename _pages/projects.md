---
layout: page
title: Projects
permalink: /projects/
description: A growing collection of my projects.
nav: true
nav_order: 3
display_categories: [work, fun]
horizontal: false
---

<!-- pages/projects.md -->
<div class="projects">
{% assign selected_projects = "" | split: "" %}
{% assign all_projects = site.projects | sort: "importance" %}
{% assign iceberg_project = all_projects | where: "title", "Iceberg - Financial Exchange" | first %}
{% assign pong_project = all_projects | where: "title", "Pong AI Test" | first %}
{% assign selected_projects = selected_projects | push: iceberg_project %}
{% assign selected_projects = selected_projects | push: pong_project %}

{% if site.enable_project_categories and page.display_categories %}
  <!-- Display categorized projects -->
  {% for category in page.display_categories %}
  <a id="{{ category }}" href=".#{{ category }}">
    <h2 class="category">{{ category }}</h2>
  </a>
  {% assign categorized_projects = selected_projects | where: "category", category %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in categorized_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endfor %}
{% else %}
<!-- Display projects without categories -->
  <!-- Generate cards for each project -->
{% if page.horizontal %}
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in all_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in selected_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
{% endif %}
</div>
