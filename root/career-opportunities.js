// career-opportunities.js
document.addEventListener('DOMContentLoaded', function() {
    // Create career section in the right sidebar
    const rightSidebar = document.querySelector('.right-sidebar');
    
    if (rightSidebar) {
        const careerSection = document.createElement('div');
        careerSection.id = 'careerOpportunities';
        careerSection.className = 'career-section';
        careerSection.innerHTML = `
            <h3>🚀 Career Opportunities</h3>
            <div class="career-categories">
                <div class="career-category" data-type="internships">
                    <h4>Internships</h4>
                    <p>Find gender-inclusive internships</p>
                </div>
                <div class="career-category" data-type="courses">
                    <h4>Courses</h4>
                    <p>Learn new skills</p>
                </div>
                <div class="career-category" data-type="mentorship">
                    <h4>Mentorship</h4>
                    <p>Connect with mentors</p>
                </div>
            </div>
            <div id="careerResults" class="career-results"></div>
        `;
        
        rightSidebar.insertBefore(careerSection, rightSidebar.firstChild);
        
        // Add event listeners
        document.querySelectorAll('.career-category').forEach(item => {
            item.addEventListener('click', function() {
                showCareerResources(this.dataset.type);
            });
        });
    }

    // Career resources data
    const careerResources = {
        internships: [
            { name: "Girls Who Code Internship", url: "https://girlswhocode.com/programs/internship-program", description: "Paid internships for women in tech" },
            { name: "Out in Tech Fellowship", url: "https://outintech.com/fellowship", description: "For LGBTQ+ tech professionals" },
            { name: "AnitaB.org Internships", url: "https://anitab.org/programs/internships/", description: "For women in computing fields" }
        ],
        courses: [
            { name: "Gender & Diversity in Tech (Coursera)", url: "https://www.coursera.org/learn/gender-diversity-tech", description: "Free course on inclusive workplaces" },
            { name: "Unconscious Bias @ Work (LinkedIn)", url: "https://www.linkedin.com/learning/unconscious-bias", description: "Recognizing workplace biases" },
            { name: "Women in Leadership (edX)", url: "https://www.edx.org/course/women-in-leadership", description: "Building leadership skills" }
        ],
        mentorship: [
            { name: "ADPList", url: "https://adplist.org/", description: "Free mentorship for diverse talent" },
            { name: "Women Who Code Mentorship", url: "https://www.womenwhocode.com/mentorship", description: "1:1 mentorship program" },
            { name: "Out in Tech Mentorship", url: "https://outintech.com/mentorship/", description: "For LGBTQ+ in tech" }
        ]
    };

    function showCareerResources(type) {
        const resultsContainer = document.getElementById('careerResults');
        resultsContainer.innerHTML = '';
        
        const resources = careerResources[type] || [];
        
        if (resources.length > 0) {
            resources.forEach(resource => {
                const resourceElement = document.createElement('div');
                resourceElement.className = 'career-item';
                resourceElement.innerHTML = `
                    <a href="${resource.url}" target="_blank" rel="noopener noreferrer">
                        <h4>${resource.name}</h4>
                        <p>${resource.description}</p>
                    </a>
                `;
                resultsContainer.appendChild(resourceElement);
            });
        } else {
            resultsContainer.innerHTML = '<p>No resources found for this category.</p>';
        }
    }
});