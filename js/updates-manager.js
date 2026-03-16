/* =======================================
   UPDATES MANAGER (Blog Logic)
   Handles JSON fetching, searching & filtering
   ======================================= */

class UpdatesManager {
    constructor() {
        this.posts = [];
        this.currentCategory = 'all';
        this.searchQuery = '';
        
        // DOM Elements
        this.grid = document.getElementById('updatesGrid');
        this.searchInput = document.getElementById('searchInput');
        this.filterContainer = document.getElementById('categoryFilters');
        this.resultsCount = document.getElementById('resultsCount');
        this.noResults = document.getElementById('noResults');
    }

    async init() {
        await this.loadPosts();
        this.setupEventListeners();
    }

    // 1. Fetch Data
    async loadPosts() {
        try {
            const response = await fetch('posts.json');
            const data = await response.json();
            this.posts = data.posts;
            
            this.renderFilters();
            this.renderPosts();
        } catch (error) {
            console.error('Error loading posts:', error);
            this.grid.innerHTML = `<div class="alert alert-danger w-100">System Error: Could not load updates.</div>`;
        }
    }

    // 2. Generate Filter Buttons
    renderFilters() {
        // Get unique categories
        const categories = ['all', ...new Set(this.posts.map(post => post.category))];
        
        // Generate HTML buttons
        this.filterContainer.innerHTML = categories.map(cat => `
            <button class="btn btn-outline-secondary btn-sm rounded-0 text-uppercase ${cat === 'all' ? 'active-filter' : ''}" 
                    onclick="updatesManager.filterByCategory('${cat}', this)">
                ${cat}
            </button>
        `).join('');
    }

    // 3. Render Cards (Using your Service/Project Card Design)
    renderPosts() {
        let filtered = this.posts;

        // Apply Category Filter
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(post => post.category === this.currentCategory);
        }

        // Apply Search Filter
        if (this.searchQuery) {
            const term = this.searchQuery.toLowerCase();
            filtered = filtered.filter(post => 
                post.title.toLowerCase().includes(term) || 
                post.excerpt.toLowerCase().includes(term) ||
                post.tags.some(tag => tag.toLowerCase().includes(term))
            );
        }

        // Update UI
        this.resultsCount.textContent = `Showing ${filtered.length} updates`;
        
        if (filtered.length === 0) {
            this.grid.innerHTML = '';
            this.noResults.classList.remove('d-none');
        } else {
            this.noResults.classList.add('d-none');
            this.grid.innerHTML = filtered.map(post => `
                <div class="col-lg-4 col-md-6" data-aos="fade-up">
                    <div class="card h-100 bg-dark text-white border-0 shadow-sm" style="overflow:hidden;">
                        <div class="position-relative" style="height: 240px; overflow: hidden;">
                            <img src="${post.image}" class="img-fluid w-100 h-100" 
                                 style="object-fit: cover; transition: transform 0.5s ease;"
                                 onmouseover="this.style.transform='scale(1.1)'" 
                                 onmouseout="this.style.transform='scale(1)'"
                                 alt="${post.title}">
                            <div class="position-absolute top-0 end-0 bg-danger text-white px-3 py-1 small fw-bold" 
                                 style="clip-path: polygon(10% 0, 100% 0, 100% 100%, 0% 100%);">
                                ${post.category}
                            </div>
                        </div>
                        
                        <div class="card-body p-4 border-bottom border-danger border-3">
                            <small class="text-secondary d-block mb-2">
                                <i class="bi bi-calendar3 me-2"></i>${new Date(post.date).toLocaleDateString()}
                            </small>
                            <h5 class="card-title text-uppercase fw-bold mb-3" style="font-family: 'Rajdhani', sans-serif;">
                                <a href="${post.url}" class="text-white text-decoration-none hover-red">${post.title}</a>
                            </h5>
                            <p class="card-text text-secondary small mb-4">${post.excerpt}</p>
                            
                            <a href="${post.url}" class="btn btn-outline-light btn-sm rounded-0 text-uppercase">
                                Read More <i class="bi bi-arrow-right ms-2"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    // 4. Interaction Handlers
    handleSearch(e) {
        this.searchQuery = e.target.value.trim();
        this.renderPosts();
    }

    filterByCategory(category, btnElement) {
        this.currentCategory = category;
        
        // Update Active Button State
        document.querySelectorAll('#categoryFilters button').forEach(btn => {
            btn.classList.remove('active-filter', 'btn-danger', 'text-white');
            btn.classList.add('btn-outline-secondary');
        });
        
        // Style Active Button
        btnElement.classList.remove('btn-outline-secondary');
        btnElement.classList.add('active-filter', 'btn-danger', 'text-white');
        
        this.renderPosts();
    }
}

// Initialize
const updatesManager = new UpdatesManager();
document.addEventListener('DOMContentLoaded', () => updatesManager.init());
document.getElementById('searchInput').addEventListener('input', (e) => updatesManager.handleSearch(e));