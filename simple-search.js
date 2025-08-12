// Simple search implementation with synonym support
document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple search starting...');
    
    // Only run on pages with search container
    const searchContainer = document.getElementById('search-container');
    if (!searchContainer) {
        console.log('No search container found');
        return;
    }
    
    // Define synonym groups - each array contains words that are synonymous with each other
    const synonymGroups = [
        // Creation and submission actions
        ['create', 'add', 'new', 'make', 'generate'],
        ['submit', 'send', 'file', 'save', 'complete'],
        
        // Report-related terms
        ['report', 'complaint', 'issue', 'incident', 'submission', 'case', 'matter', 'form', 'document', 'disclosure'],
        
        // Privacy and security
        ['anonymous', 'private', 'confidential', 'unnamed'],
        ['secure', 'safe', 'encrypted', 'protected'],
        ['password', 'code', 'pin', 'key'],
        
        // Communication
        ['chat', 'message', 'communicate', 'contact'],
        ['email', 'mail', 'address'],
        
        // Access and authentication
        ['login', 'signin', 'access', 'enter'],
        
        // Status and progress
        ['status', 'progress', 'update', 'check'],
        
        // People and organizations
        ['client', 'customer', 'organization', 'company'],
        ['partner', 'user', 'account'],
        
        // Interface elements
        ['dashboard', 'portal', 'interface', 'page'],
        
        // Search and navigation
        ['search', 'find', 'locate', 'lookup'],
        ['view', 'see', 'display', 'show'],
        
        // Data modification
        ['edit', 'modify', 'change', 'update'],
        ['delete', 'remove', 'erase']
    ];
    
    // Build bidirectional synonym map from groups
    const synonyms = {};
    synonymGroups.forEach(group => {
        group.forEach(word => {
            // For each word, all other words in the group are its synonyms
            synonyms[word] = group.filter(w => w !== word);
        });
    });
    
    // Create search UI
    searchContainer.innerHTML = `
        <div class="search-wrapper">
            <input type="text" 
                   id="search-input" 
                   class="search-input" 
                   placeholder="Search guides..."
                   autocomplete="off">
            <div id="search-results" class="search-results"></div>
        </div>
    `;
    
    // Get all guide cards
    const guideCards = document.querySelectorAll('a.guide-card[href]');
    console.log('Found', guideCards.length, 'guide cards');
    
    // Build searchable data
    const guides = [];
    guideCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent || '';
        const description = card.querySelector('p')?.textContent || '';
        const href = card.getAttribute('href');
        
        guides.push({
            title: title,
            description: description,
            href: href,
            searchText: (title + ' ' + description).toLowerCase()
        });
        
        console.log('Indexed:', title);
    });
    
    // Get all search terms including synonyms
    function getSearchTerms(query) {
        const searchTerm = query.toLowerCase();
        const terms = [searchTerm];
        
        // Add synonyms if they exist
        if (synonyms[searchTerm]) {
            terms.push(...synonyms[searchTerm]);
        }
        
        console.log('Searching for:', searchTerm, 'and synonyms:', terms);
        return terms;
    }
    
    // Search function with synonym support
    function searchGuides(query) {
        const searchTerms = getSearchTerms(query);
        
        return guides.filter(guide => {
            // Check if any of the search terms (including synonyms) match
            return searchTerms.some(term => 
                guide.searchText.includes(term)
            );
        });
    }
    
    // Handle search input
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        const results = searchGuides(query);
        console.log('Search for "' + query + '" found', results.length, 'results');
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No guides found</div>';
        } else {
            let html = '';
            results.forEach(result => {
                // Highlight the search term
                const highlightedTitle = result.title.replace(
                    new RegExp('(' + query + ')', 'gi'), 
                    '<mark>$1</mark>'
                );
                const highlightedDesc = result.description.replace(
                    new RegExp('(' + query + ')', 'gi'), 
                    '<mark>$1</mark>'
                );
                
                html += `
                    <div class="search-result-item" style="padding: 1rem; border-bottom: 1px solid #e5e7eb;">
                        <h4 style="margin: 0 0 0.5rem 0;">
                            <a href="${result.href}" style="color: #2c6971; text-decoration: none;">
                                ${highlightedTitle}
                            </a>
                        </h4>
                        <p style="margin: 0; font-size: 0.875rem; color: #6b7280;">
                            ${highlightedDesc}
                        </p>
                    </div>
                `;
            });
            searchResults.innerHTML = html;
        }
        
        searchResults.style.display = 'block';
    });
    
    // Hide results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
    
    console.log('Simple search ready!');
});