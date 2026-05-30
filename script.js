document.addEventListener('DOMContentLoaded', () => {
    console.log("THI Website Loaded Successfully.");

    // Smooth scrolling for any future internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // TODO for Hackathon team:
    // 1. Add fetch() calls here to interface with Vahan DB API endpoints
    // 2. Add logic to parse Overpass API node data for hospital locations
    // 3. Connect to backend services if server-side data processing is required
});