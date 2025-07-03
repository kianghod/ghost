// YouTube Link Manager JavaScript

class YouTubeLinkManager {
    constructor() {
        this.links = JSON.parse(localStorage.getItem('youtubeLinks')) || [];
        this.currentView = 'card';
        this.editingId = null;
        
        this.initializeElements();
        this.bindEvents();
        this.render();
        this.setupContextMenu();
        this.updateResultCount();
    }

    initializeElements() {
        // Modal elements
        this.modal = document.getElementById('linkModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.linkForm = document.getElementById('linkForm');
        this.closeBtn = document.querySelector('.close');
        this.cancelBtn = document.getElementById('cancelBtn');
        
        // Form elements
        this.nameInput = document.getElementById('linkName');
        this.linkInput = document.getElementById('youtubeLink');
        this.ratingInput = document.getElementById('rating');
        this.ratingValue = document.getElementById('ratingValue');
        this.categoryInput = document.getElementById('category');
        this.locationInput = document.getElementById('location');
        
        // View elements
        this.cardViewBtn = document.getElementById('cardView');
        this.listViewBtn = document.getElementById('listView');
        this.cardContainer = document.getElementById('cardContainer');
        this.listContainer = document.getElementById('listContainer');
        
        // Control elements
        this.addLinkBtn = document.getElementById('addLinkBtn');
        this.searchInput = document.getElementById('searchInput');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.ratingFilter = document.getElementById('ratingFilter');
        this.sortSelect = document.getElementById('sortSelect');
        this.resultCount = document.getElementById('resultCount');
    }

    bindEvents() {
        // Modal events
        this.addLinkBtn.addEventListener('click', () => this.openModal());
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.cancelBtn.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        // Form events
        this.linkForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.ratingInput.addEventListener('input', (e) => {
            this.ratingValue.textContent = e.target.value;
        });

        // View toggle events
        this.cardViewBtn.addEventListener('click', () => this.switchView('card'));
        this.listViewBtn.addEventListener('click', () => this.switchView('list'));

        // Search and filter events
        this.searchInput.addEventListener('input', () => this.filterLinks());
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

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    openModal(linkId = null) {
        this.editingId = linkId;
        
        if (linkId) {
            const link = this.links.find(l => l.id === linkId);
            if (link) {
                this.modalTitle.textContent = 'แก้ไขวิดีโอผี';
                this.nameInput.value = link.name;
                this.linkInput.value = link.url;
                this.ratingInput.value = link.rating;
                this.ratingValue.textContent = link.rating;
                this.categoryInput.value = link.category;
                this.locationInput.value = link.location || '';
            }
        } else {
            this.modalTitle.textContent = 'เพิ่มวิดีโอผี';
            this.linkForm.reset();
            this.ratingValue.textContent = '5';
        }
        
        this.modal.style.display = 'block';
        this.nameInput.focus();
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.editingId = null;
        this.linkForm.reset();
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: this.nameInput.value.trim(),
            url: this.linkInput.value.trim(),
            rating: parseInt(this.ratingInput.value),
            category: this.categoryInput.value,
            location: this.locationInput.value.trim(),
            dateAdded: new Date().toISOString()
        };

        // Validate YouTube URL
        if (!this.isValidYouTubeUrl(formData.url)) {
            alert('กรุณาใส่ลิงก์วิดีโอ YouTube ที่ถูกต้อง');
            return;
        }

        if (this.editingId) {
            // Update existing link
            const index = this.links.findIndex(l => l.id === this.editingId);
            if (index !== -1) {
                this.links[index] = { ...this.links[index], ...formData };
            }
        } else {
            // Add new link
            formData.id = this.generateId();
            this.links.unshift(formData);
        }

        this.saveToLocalStorage();
        this.render();
        this.closeModal();
    }

    isValidYouTubeUrl(url) {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[a-zA-Z0-9_-]{11}/;
        return youtubeRegex.test(url);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getVideoId(url) {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    getThumbnailUrl(videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
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
        const ratingFilter = parseInt(this.ratingFilter.value) || 0;
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
            const matchesRating = link.rating >= ratingFilter;
            
            return matchesSearch && matchesCategory && matchesRating;
        });
        
        // Sort the filtered links
        filteredLinks = this.sortLinks(filteredLinks, sortOption);
        
        // Update result count
        if (this.resultCount) {
            this.resultCount.textContent = filteredLinks.length;
        }
        
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
                    <p>คลิก "เพิ่มวิดีโอผี" เพื่อเริ่มต้น!</p>
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
                            <button class="card-btn primary" onclick="app.openLink('${link.url}')">
                                <i class="fas fa-play"></i> ดู
                            </button>
                        </div>
                        <div class="card-hint">
                            <small>คลิกขวาสำหรับตัวเลือกเพิ่มเติม</small>
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
                    <p>คลิก "เพิ่มวิดีโอผี" เพื่อเริ่มต้น!</p>
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
                        <button class="list-btn primary" onclick="app.openLink('${link.url}')">
                            <i class="fas fa-play"></i> ดู
                        </button>
                    </div>
                    <div class="list-hint">
                        <small>คลิกขวาสำหรับตัวเลือกเพิ่มเติม</small>
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

    deleteLink(linkId) {
        if (confirm('คุณแน่ใจหรือไม่ที่จะลบวิดีโอนี้?')) {
            this.links = this.links.filter(link => link.id !== linkId);
            this.saveToLocalStorage();
            this.render();
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('youtubeLinks', JSON.stringify(this.links));
    }

    updateResultCount() {
        if (this.resultCount) {
            this.resultCount.textContent = this.links.length;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupContextMenu() {
        document.addEventListener('contextmenu', (e) => {
            const card = e.target.closest('.card');
            const listItem = e.target.closest('.list-item');
            
            if (card || listItem) {
                e.preventDefault();
                const linkId = (card || listItem).dataset.id;
                const link = this.links.find(l => l.id === linkId);
                
                if (link) {
                    this.showContextMenu(e, link);
                }
            }
        });

        // Hide context menu when clicking elsewhere
        document.addEventListener('click', () => {
            this.hideContextMenu();
        });
    }

    showContextMenu(e, link) {
        this.hideContextMenu();
        
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.innerHTML = `
            <div class="context-menu-item" onclick="app.openModal('${link.id}')">
                <i class="fas fa-edit"></i> แก้ไข
            </div>
            <div class="context-menu-item" onclick="app.deleteLink('${link.id}')">
                <i class="fas fa-trash"></i> ลบ
            </div>
        `;
        
        menu.style.position = 'fixed';
        menu.style.left = e.pageX + 'px';
        menu.style.top = e.pageY + 'px';
        menu.style.zIndex = '10000';
        
        document.body.appendChild(menu);
        
        // Store reference to hide later
        this.currentContextMenu = menu;
    }

    hideContextMenu() {
        if (this.currentContextMenu) {
            this.currentContextMenu.remove();
            this.currentContextMenu = null;
        }
    }
}

// Initialize the application
const app = new YouTubeLinkManager();

// Add some sample data if no links exist
if (app.links.length === 0) {
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
    
    app.links = sampleLinks;
    app.saveToLocalStorage();
    app.render();
} 