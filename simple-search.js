// Simple search implementation with synonym support
document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple search starting...');
    
    // Only run on pages with search container
    const searchContainer = document.getElementById('search-container');
    if (!searchContainer) {
        console.log('No search container found');
        return;
    }
    
    // Define reporter-specific synonyms
    const synonyms = {
        'submit': ['send', 'file', 'report', 'create'],
        'send': ['submit', 'file', 'report'],
        'file': ['submit', 'send', 'report'],
        'create': ['submit', 'make', 'new'],
        
        'report': ['complaint', 'issue', 'incident', 'submission', 'case', 'matter'],
        'complaint': ['report', 'issue', 'incident'],
        'issue': ['report', 'complaint', 'incident'],
        'incident': ['report', 'complaint', 'issue'],
        'submission': ['report', 'submit'],
        
        'anonymous': ['private', 'confidential', 'unnamed'],
        'private': ['anonymous', 'confidential'],
        'confidential': ['anonymous', 'private'],
        'unnamed': ['anonymous'],
        
        'chat': ['message', 'communicate', 'contact'],
        'message': ['chat', 'communicate', 'contact'],
        'communicate': ['chat', 'message', 'contact'],
        'contact': ['chat', 'message', 'communicate'],
        
        'login': ['signin', 'access', 'enter'],
        'signin': ['login', 'access'],
        'access': ['login', 'signin', 'enter'],
        'enter': ['login', 'access'],
        
        'status': ['progress', 'update', 'check'],
        'progress': ['status', 'update'],
        'update': ['status', 'progress', 'check'],
        'check': ['status', 'update', 'view'],
        
        'secure': ['safe', 'encrypted', 'protected'],
        'safe': ['secure', 'protected'],
        'encrypted': ['secure', 'protected'],
        'protected': ['secure', 'safe', 'encrypted'],
        
        'password': ['code', 'pin', 'key'],
        'code': ['password', 'pin'],
        'pin': ['password', 'code'],
        'key': ['password'],
        
        'email': ['mail', 'address'],
        'mail': ['email', 'address'],
        'address': ['email', 'mail']
    };
    
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