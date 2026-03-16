/**
 * update-details.js
 * Handles fetching specific post content based on URL query parameter 'id'.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Get ID from URL
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (!postId) {
        window.location.href = 'updates.html';
        return;
    }

    const titleEl = document.getElementById('articleTitle');
    const dateEl = document.getElementById('articleDate');
    const catEl = document.getElementById('articleCategory');
    const contentEl = document.getElementById('articleContent');
    const heroBg = document.getElementById('heroBg');

    // 2. Fetch Post Data
    fetch('posts.json')
        .then(res => res.json())
        .then(data => {
            const post = data.posts.find(p => p.id === postId);

            if (post) {
                renderArticle(post);
            } else {
                contentEl.innerHTML = '<div class="text-center text-danger"><h3>Update not found.</h3></div>';
                titleEl.textContent = '404 Error';
            }
        })
        .catch(err => {
            console.error('Error fetching post:', err);
            contentEl.innerHTML = '<div class="text-center text-danger"><h3>Error loading content.</h3></div>';
        });

    // 3. Render Logic
    function renderArticle(post) {
        // Set Header Info
        titleEl.textContent = post.title;
        dateEl.textContent = formatDate(post.date);
        catEl.innerHTML = `<span class="tag-line"></span>${post.category}`;

        // Set Hero Background
        if (post.image) {
            heroBg.style.backgroundImage = `url('${post.image}')`;
        }

        // Build Content Blocks
        let htmlContent = '';

        if (post.content && Array.isArray(post.content)) {
            post.content.forEach(block => {
                if (block.type === 'paragraph') {
                    htmlContent += `<p class="article-text">${block.text}</p>`;
                } else if (block.type === 'heading') {
                    htmlContent += `<h2 class="article-subheading">${block.text}</h2>`;
                } else if (block.type === 'image') {
                    htmlContent += `
                        <div class="article-image-wrapper">
                            <img src="${block.src}" alt="${block.caption || post.title}" class="img-fluid">
                            ${block.caption ? `<p class="image-caption">${block.caption}</p>` : ''}
                            <div class="corner-accent tl"></div>
                            <div class="corner-accent br"></div>
                        </div>
                    `;
                }
            });
        } else {
            // Fallback for posts without rich content
            htmlContent = `<p class="article-text">${post.excerpt}</p>`;
        }

        contentEl.innerHTML = htmlContent;
    }

    // Helper: Format Date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
});
