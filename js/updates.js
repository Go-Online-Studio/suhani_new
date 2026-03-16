/**
 * updates.js
 * Handles fetching posts from posts.json and rendering them with search/filter functionality.
 */

document.addEventListener('DOMContentLoaded', () => {
    let allPosts = [];
    const blogGrid = document.getElementById('blogGrid');
    const searchInput = document.getElementById('blogSearch');
    const categoryContainer = document.getElementById('categoryContainer');

    // Fetch Posts
    fetch('posts.json')
        .then(res => res.json())
        .then(data => {
            allPosts = data.posts;
            renderPosts(allPosts);
            // populateCategories(allPosts); // Optional if dynamic categories are needed
        })
        .catch(err => {
            console.error('Error fetching posts:', err);
            blogGrid.innerHTML = `<div class="col-12 text-center text-danger">Failed to load updates.</div>`;
        });

    // Render Posts
    function renderPosts(posts) {
        if (posts.length === 0) {
            blogGrid.innerHTML = `<div class="col-12 text-center text-secondary py-5">
                <h4>No updates found matching your criteria.</h4>
            </div>`;
            return;
        }

        blogGrid.innerHTML = posts.map(post => `
            <div class="col-lg-4 col-md-6" data-aos="fade-up">
                <div class="blog-card">
                    <div class="blog-image">
                        <img src="${post.image}" alt="${post.title}" loading="lazy">
                        <span class="blog-category">${post.category}</span>
                        <div class="image-overlay"></div>
                    </div>
                    <div class="blog-content">
                        <div class="blog-meta">
                            <i class="bi bi-calendar-event"></i>
                            <span>${formatDate(post.date)}</span>
                        </div>
                        <h3 class="blog-title">
                            <a href="${post.url}">${post.title}</a>
                        </h3>
                        <p class="blog-excerpt">${post.excerpt}</p>
                        <a href="${post.url}" class="read-more">
                            READ MORE <i class="bi bi-arrow-right"></i>
                        </a>
                    </div>
                    <div class="card-border"></div>
                </div>
            </div>
        `).join('');
    }

    // Search Filter
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        filterPosts(term, getActiveCategory());
    });

    // Category Filter
    const filterBtns = document.querySelectorAll('.blog-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');
            filterPosts(searchInput.value.toLowerCase(), category);
        });
    });

    // Combined Filter Logic
    function filterPosts(term, category) {
        const filtered = allPosts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(term) ||
                post.excerpt.toLowerCase().includes(term) ||
                post.tags.some(tag => tag.toLowerCase().includes(term));

            const matchesCategory = category === 'all' || post.category === category;

            return matchesSearch && matchesCategory;
        });
        renderPosts(filtered);
    }

    function getActiveCategory() {
        const activeBtn = document.querySelector('.blog-filter-btn.active');
        return activeBtn ? activeBtn.getAttribute('data-category') : 'all';
    }

    // Helper: Format Date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
});
