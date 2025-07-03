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
        this.ratingFilter = document.getElementById('ratingFilter');
        this.sortSelect = document.getElementById('sortSelect');
        this.resultCount = document.getElementById('resultCount');
    }

    bindEvents() {
        // View toggle events
        this.cardViewBtn.addEventListener('click', () => this.switchView('card'));
        this.listViewBtn.addEventListener('click', () => this.switchView('list'));

        // Search and filter events with debounce
        let searchTimeout;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.filterLinks();
            }, 300);
            
            // Show/hide clear search button immediately
            const clearSearchBtn = document.getElementById('clearSearch');
            if (clearSearchBtn) {
                clearSearchBtn.style.display = e.target.value ? 'block' : 'none';
            }
        });
        
        this.categoryFilter.addEventListener('change', () => this.filterLinks());
        this.ratingFilter.addEventListener('change', () => this.filterLinks());
        this.sortSelect.addEventListener('change', () => this.filterLinks());
        
        // Clear search button
        const clearSearchBtn = document.getElementById('clearSearch');
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                this.searchInput.value = '';
                this.filterLinks();
                clearSearchBtn.style.display = 'none';
                this.searchInput.focus();
            });
        }
        
        // Clear filters button
        const clearFiltersBtn = document.getElementById('clearFilters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.categoryFilter.value = '';
                this.ratingFilter.value = '0';
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
        this.updateResultCount();
    }

    updateResultCount() {
        if (this.resultCount) {
            this.resultCount.textContent = this.links.length;
        }
    }

    filterLinks() {
        const searchTerm = this.searchInput.value.toLowerCase().trim();
        const categoryFilter = this.categoryFilter.value;
        const ratingFilter = parseInt(this.ratingFilter.value) || 0;
        const sortOption = this.sortSelect.value;
        
        // Show/hide clear search button
        const clearSearchBtn = document.getElementById('clearSearch');
        if (clearSearchBtn) {
            clearSearchBtn.style.display = searchTerm ? 'block' : 'none';
        }
        
        // Apply filters
        let filteredLinks = this.links.filter(link => {
            // Search filter - search in name and location
            const matchesSearch = !searchTerm || 
                link.name.toLowerCase().includes(searchTerm) ||
                (link.location && link.location.toLowerCase().includes(searchTerm));
            
            // Category filter
            const matchesCategory = !categoryFilter || link.category === categoryFilter;
            
            // Rating filter
            const matchesRating = link.rating >= ratingFilter;
            
            return matchesSearch && matchesCategory && matchesRating;
        });
        
        // Sort the filtered links
        filteredLinks = this.sortLinks(filteredLinks, sortOption);
        
        // Update result count with animation
        this.updateResultCount(filteredLinks.length);
        
        // Render with animation
        this.render(filteredLinks);
        
        // Show no results message if needed
        if (filteredLinks.length === 0 && (searchTerm || categoryFilter || ratingFilter > 0)) {
            this.showNoResultsMessage(searchTerm, categoryFilter, ratingFilter);
        }
    }
    
    updateResultCount(count) {
        if (this.resultCount) {
            // Add animation class
            this.resultCount.classList.add('count-update');
            this.resultCount.textContent = count;
            
            // Remove animation class after animation completes
            setTimeout(() => {
                this.resultCount.classList.remove('count-update');
            }, 300);
        }
    }
    
    showNoResultsMessage(searchTerm, categoryFilter, ratingFilter) {
        const container = this.currentView === 'card' ? this.cardContainer : this.listContainer;
        const message = this.buildNoResultsMessage(searchTerm, categoryFilter, ratingFilter);
        
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>ไม่พบผลลัพธ์</h3>
                <p>${message}</p>
                <button class="clear-all-filters" onclick="viewer.clearAllFilters()">
                    <i class="fas fa-times"></i> ล้างตัวกรองทั้งหมด
                </button>
            </div>
        `;
    }
    
    buildNoResultsMessage(searchTerm, categoryFilter, ratingFilter) {
        const conditions = [];
        
        if (searchTerm) {
            conditions.push(`คำค้น "${searchTerm}"`);
        }
        if (categoryFilter) {
            const categoryName = this.getCategoryName(categoryFilter);
            conditions.push(`หมวดหมู่ "${categoryName}"`);
        }
        if (ratingFilter > 0) {
            conditions.push(`คะแนน ${ratingFilter}+`);
        }
        
        if (conditions.length === 1) {
            return `ไม่พบวิดีโอที่ตรงกับ ${conditions[0]}`;
        } else if (conditions.length === 2) {
            return `ไม่พบวิดีโอที่ตรงกับ ${conditions[0]} และ ${conditions[1]}`;
        } else {
            return `ไม่พบวิดีโอที่ตรงกับเงื่อนไขทั้งหมด`;
        }
    }
    
    getCategoryName(categoryValue) {
        const categories = {
            'ghost-sightings': 'การพบเห็นผี',
            'paranormal': 'การสืบสวนอาถรรพ์',
            'haunted-places': 'สถานที่ผีสิง',
            'urban-legends': 'ตำนานเมือง',
            'horror-stories': 'เรื่องสยองขวัญ',
            'supernatural': 'เหนือธรรมชาติ',
            'cryptids': 'สัตว์ประหลาด',
            'other': 'อื่นๆ'
        };
        return categories[categoryValue] || categoryValue;
    }
    
    clearAllFilters() {
        this.searchInput.value = '';
        this.categoryFilter.value = '';
        this.ratingFilter.value = '0';
        this.sortSelect.value = 'date-desc';
        this.filterLinks();
        
        // Hide clear search button
        const clearSearchBtn = document.getElementById('clearSearch');
        if (clearSearchBtn) {
            clearSearchBtn.style.display = 'none';
        }
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
                <div class="card" data-id="${link.id}" onclick="viewer.openLink('${link.url}')">
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
                            <button class="card-btn primary" onclick="event.stopPropagation(); viewer.openLink('${link.url}')">
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
                <div class="list-item" data-id="${link.id}" onclick="viewer.openLink('${link.url}')">
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
                        <button class="list-btn primary" onclick="event.stopPropagation(); viewer.openLink('${link.url}')">
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

// Add some sample data if no links exist
if (viewer.links.length === 0) {
    const sampleLinks = [
        {
            id: 'sample1',
            name: 'ผีปรากฏในกล้อง - หลักฐานอาถรรพ์จริง',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            rating: 9,
            category: 'ghost-sightings',
            location: 'บ้านผีสิง',
            dateAdded: new Date().toISOString()
        },
        {
            id: 'sample2',
            name: 'การสืบสวนอาถรรพ์ในโรงแรมเก่า',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            rating: 7,
            category: 'paranormal',
            location: 'โรงแรมผีสิง',
            dateAdded: new Date().toISOString()
        },
        {
            id: 'sample3',
            name: 'ตำนานผีบ้านหลังเก่า',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            rating: 8,
            category: 'urban-legends',
            location: 'บ้านเก่า',
            dateAdded: new Date().toISOString()
        },
        {
            id: 'sample4',
            name: 'เรื่องสยองขวัญในโรงเรียน',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            rating: 6,
            category: 'horror-stories',
            location: 'โรงเรียนเก่า',
            dateAdded: new Date().toISOString()
        },
        {
            id: 'sample5',
            name: 'สัตว์ประหลาดในป่า',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            rating: 4,
            category: 'cryptids',
            location: 'ป่าลึก',
            dateAdded: new Date().toISOString()
        }
    ];
    
    viewer.links = sampleLinks;
    viewer.saveToLocalStorage();
    viewer.render();
} 