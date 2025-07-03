// YouTube Link Manager - View Only Version

class YouTubeLinkViewer {
    constructor() {
        this.links = JSON.parse(localStorage.getItem('youtubeLinks')) || [];
        this.currentView = 'card';
        
        this.initializeElements();
        this.bindEvents();
        this.render();
    }

    initializeElements() {
        // View elements
        this.cardViewBtn = document.getElementById('cardView');
        this.listViewBtn = document.getElementById('listView');
        this.cardContainer = document.getElementById('cardContainer');
        this.listContainer = document.getElementById('listContainer');
        
        // Control elements
        this.searchInput = document.getElementById('searchInput');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.sortSelect = document.getElementById('sortSelect');
    }

    bindEvents() {
        // View toggle events
        this.cardViewBtn.addEventListener('click', () => this.switchView('card'));
        this.listViewBtn.addEventListener('click', () => this.switchView('list'));

        // Search and filter events
        this.searchInput.addEventListener('input', () => this.filterLinks());
        this.categoryFilter.addEventListener('change', () => this.filterLinks());
        this.sortSelect.addEventListener('change', () => this.filterLinks());
        
        // Clear search button
        const clearSearchBtn = document.getElementById('clearSearch');
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                this.searchInput.value = '';
                this.filterLinks();
                clearSearchBtn.style.display = 'none';
            });
        }
        
        // Clear filters button
        const clearFiltersBtn = document.getElementById('clearFilters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.categoryFilter.value = '';
                this.sortSelect.value = 'date-desc';
                this.filterLinks();
            });
        }
    }

    switchView(view) {
        this.currentView = view;
        
        if (view === 'card') {
            this.cardViewBtn.classList.add('active');
            this.listViewBtn.classList.remove('active');
            this.cardContainer.classList.remove('hidden');
            this.listContainer.classList.remove('active');
            this.listContainer.classList.add('hidden');
        } else {
            this.listViewBtn.classList.add('active');
            this.cardViewBtn.classList.remove('active');
            this.listContainer.classList.remove('hidden');
            this.listContainer.classList.add('active');
            this.cardContainer.classList.add('hidden');
        }
        
        this.render();
    }

    filterLinks() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const categoryFilter = this.categoryFilter.value;
        const sortOption = this.sortSelect.value;
        
        // Show/hide clear search button
        const clearSearchBtn = document.getElementById('clearSearch');
        if (clearSearchBtn) {
            clearSearchBtn.style.display = searchTerm ? 'block' : 'none';
        }
        
        let filteredLinks = this.links.filter(link => {
            const matchesSearch = link.name.toLowerCase().includes(searchTerm) ||
                                (link.location && link.location.toLowerCase().includes(searchTerm));
            const matchesCategory = !categoryFilter || link.category === categoryFilter;
            
            return matchesSearch && matchesCategory;
        });
        
        // Sort the filtered links
        filteredLinks = this.sortLinks(filteredLinks, sortOption);
        
        this.render(filteredLinks);
    }

    sortLinks(links, sortOption) {
        const sortedLinks = [...links];
        
        switch (sortOption) {
            case 'date-desc':
                return sortedLinks.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            case 'date-asc':
                return sortedLinks.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
            case 'rating-desc':
                return sortedLinks.sort((a, b) => b.rating - a.rating);
            case 'rating-asc':
                return sortedLinks.sort((a, b) => a.rating - b.rating);
            case 'name-asc':
                return sortedLinks.sort((a, b) => a.name.localeCompare(b.name, 'th'));
            case 'name-desc':
                return sortedLinks.sort((a, b) => b.name.localeCompare(a.name, 'th'));
            default:
                return sortedLinks;
        }
    }

    render(linksToRender = null) {
        const links = linksToRender || this.links;
        
        if (this.currentView === 'card') {
            this.renderCardView(links);
        } else {
            this.renderListView(links);
        }
    }

    renderCardView(links) {
        if (links.length === 0) {
            this.cardContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-ghost"></i>
                    <h3>ยังไม่มีวิดีโอผี</h3>
                    <p>ยังไม่มีวิดีโอในคอลเลกชัน</p>
                </div>
            `;
            return;
        }

        this.cardContainer.innerHTML = links.map(link => {
            const videoId = this.getVideoId(link.url);
            const thumbnailUrl = videoId ? this.getThumbnailUrl(videoId) : '';
            const ratingNumber = link.rating;
            
            return `
                <div class="card" data-id="${link.id}">
                    <div class="card-header">
                        <div class="card-category">${this.escapeHtml(link.category)}</div>
                        <div class="card-rating">
                            <span class="rating-number">${ratingNumber}</span>
                            <span class="rating-text">/10</span>
                        </div>
                    </div>
                    <div class="card-thumbnail">
                        ${thumbnailUrl ? `<img src="${thumbnailUrl}" alt="${link.name}" onerror="this.style.display='none'">` : ''}
                        <div class="play-icon">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${this.escapeHtml(link.name)}</h3>
                        ${link.location ? `<div class="card-location"><i class="fas fa-map-marker-alt"></i> ${this.escapeHtml(link.location)}</div>` : ''}
                        <div class="card-actions">
                            <button class="card-btn primary" onclick="viewer.openLink('${link.url}')">
                                <i class="fas fa-play"></i> ดู
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderListView(links) {
        if (links.length === 0) {
            this.listContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-ghost"></i>
                    <h3>ยังไม่มีวิดีโอผี</h3>
                    <p>ยังไม่มีวิดีโอในคอลเลกชัน</p>
                </div>
            `;
            return;
        }

        this.listContainer.innerHTML = links.map(link => {
            const videoId = this.getVideoId(link.url);
            const thumbnailUrl = videoId ? this.getThumbnailUrl(videoId) : '';
            const ratingNumber = link.rating;
            
            return `
                <div class="list-item" data-id="${link.id}">
                    <div class="list-thumbnail">
                        ${thumbnailUrl ? `<img src="${thumbnailUrl}" alt="${link.name}" onerror="this.style.display='none'">` : ''}
                    </div>
                    <div class="list-content">
                        <h3 class="list-title">${this.escapeHtml(link.name)}</h3>
                        <div class="list-meta">
                            <span><i class="fas fa-tag"></i> ${this.escapeHtml(link.category)}</span>
                            <span><i class="fas fa-star"></i> ${ratingNumber}/10</span>
                            ${link.location ? `<span><i class="fas fa-map-marker-alt"></i> ${this.escapeHtml(link.location)}</span>` : ''}
                            <span><i class="fas fa-calendar"></i> ${new Date(link.dateAdded).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="list-actions">
                        <button class="list-btn primary" onclick="viewer.openLink('${link.url}')">
                            <i class="fas fa-play"></i> ดู
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    openLink(url) {
        // Ensure the URL is properly formatted for YouTube
        let youtubeUrl = url;
        
        // If it's a youtu.be link, convert it to youtube.com
        if (youtubeUrl.includes('youtu.be/')) {
            const videoId = youtubeUrl.split('youtu.be/')[1];
            youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        }
        
        // If it's an embed link, convert it to watch link
        if (youtubeUrl.includes('youtube.com/embed/')) {
            const videoId = youtubeUrl.split('youtube.com/embed/')[1];
            youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        }
        
        // Open in new tab
        window.open(youtubeUrl, '_blank');
    }

    getVideoId(url) {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    getThumbnailUrl(videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the viewer
const viewer = new YouTubeLinkViewer(); 