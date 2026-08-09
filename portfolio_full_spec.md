# Full Portfolio + Admin Site Specification

This document describes the current portfolio website and its admin CMS in a clear, structured way so it can be used as input for a redesign or rebuild prompt in ChatGPT or another AI coding assistant.

---

# 1. Project Overview

Project name: Asfi Ahamed Portfolio

Purpose:
- Present the personal portfolio of Asfi Ahamed in a modern, interactive, and dynamic way.
- Allow content to be managed from an admin dashboard without changing the code directly.
- Support a public-facing portfolio site and a separate admin CMS.

Current stack:
- Frontend: React 19
- Build tool: Vite
- Language: TypeScript
- Styling: Tailwind CSS
- Animations: Framer Motion
- UI icons: Lucide React
- Backend / database: Supabase (PostgreSQL)
- Authentication: Supabase Auth
- Storage: Supabase Storage
- Notifications / feedback: Sonner toast system
- Charts in admin: Recharts
- Deployment target: Vercel

Core idea:
- The public website is content-driven from Supabase.
- The admin panel is a CMS to manage content without editing source code.
- The overall style is currently dark, futuristic, animated, and somewhat experimental.

---

# 2. Public Portfolio Site

## 2.1 Main Goal of the Public Site

The public site should:
- showcase the developer’s identity, skills, background, projects, and achievements;
- look polished and professional;
- be easy to read and navigate;
- support dynamic content from Supabase;
- feel modern but not overly “vibecoded” or cluttered.

## 2.2 Current Public Pages / Sections

The homepage currently includes the following sections:

1. Hero section
   - Name: Asfi Ahamed
   - Role/subtitle: Computer Science & Engineering student
   - Specialty: Data Science & Engineering
   - University: University of Moratuwa
   - CTA buttons: View Projects, Get in Touch
   - Social links: GitHub, LinkedIn, Email
   - Resume/CV download button
   - Portrait image and decorative ambient visual effects

2. About section
   - Short biography about the person
   - Academic and personal background
   - Professional interests and goals
   - Description of technical focus areas

3. Education + Background section
   - Education timeline
   - Experience timeline
   - Academic achievements and milestones

4. Projects section
   - Showcases selected projects in cards
   - Each card includes title, year, description, tech stack, and links
   - Some projects have GitHub and Live Demo links
   - Some are marked as Coming Soon if incomplete

5. Skills section
   - Skills grouped by categories such as:
     - Languages
     - Frameworks & Tools
     - Databases
     - AI / ML
   - Skills displayed in a dynamic way from Supabase

6. Certificates section
   - List of certificates and credentials
   - Includes issuer/platform names such as Kaggle, NVIDIA, AWS Academy
   - Supports optional image URLs

7. Appreciation / heart interaction section
   - Visitors can “appreciate” the portfolio
   - The action is tracked in Supabase
   - The app stores visitor state locally and submits appreciation data to the backend

8. Contact / footer area
   - Contact intro text
   - Footer information
   - Social links
   - Message/contact CTA area

## 2.3 Current Public Content (from database seed data)

### Personal identity
- Name: Asfi Ahamed
- Role: Computer Science & Engineering Student
- Specialization: Data Science & Engineering (DSE)
- University: University of Moratuwa, Sri Lanka

### Academic background
- B.Sc. (Hons) Computer Science & Engineering at University of Moratuwa
- G.C.E. Advanced Level from KM/Al-Ashraq National School, Nintavur
- G.C.E. Ordinary Level from the same school
- High academic achievement record

### Current interests
- AI systems
- Machine learning workflows
- Full-stack applications
- Data science projects
- Digital logic / computer architecture

### Projects included in the current content model
- Q&A Chat Bot
- End-to-End Data Science Project
- React Movie App
- Healthcare-MediBridge
- Nano-processor Mini Project

### Skills currently represented
- Python
- Java
- C++
- JavaScript
- TypeScript
- HTML
- CSS
- React
- FastAPI
- Streamlit
- LangChain
- HuggingFace
- Tailwind CSS
- MySQL
- MongoDB
- RAG Systems
- FAISS
- Embeddings
- Prompt Engineering
- Scikit-learn

### Certificates currently represented
- Intro to Machine Learning
- Pandas + Feature Engineering
- Generative Accelerated AI
- Cloud Foundations
- Microservices & CI/CD

### Social links currently represented
- GitHub
- LinkedIn
- Email

---

# 3. Admin Site

## 3.1 Main Goal of the Admin Site

The admin dashboard is a CMS for managing the portfolio content without touching the codebase.

The admin system allows the owner to:
- manage projects
- manage skills
- manage education entries
- manage experience entries
- manage certificates
- change homepage/site copy
- manage branding assets
- manage social links
- view appreciation stats

## 3.2 Current Admin Pages

### A. Dashboard
Purpose:
- overview of the portfolio CMS
- summary cards showing how many items exist for each content type
- appreciation stats and recent activity visualization

Included features:
- project count
- skills count
- education count
- certificates count
- experience count
- social links count
- appreciation totals for today, this week, this month
- 30-day appreciation chart

### B. Projects Management
Purpose:
- create, edit, delete, and reorder portfolio projects

Fields available:
- title
- year
- description
- tech stack (comma-separated array)
- GitHub URL
- demo URL
- live website URL
- highlight tag
- image URL
- display order

### C. Skills Management
Purpose:
- manage skill items grouped by category

Fields available:
- name
- category
- level (0 to 100)
- display order

### D. Education Management
Purpose:
- manage academic timeline entries

Fields available:
- title
- subtitle
- period
- details (array)
- display order

### E. Experience Management
Purpose:
- manage work or volunteer experience entries

Fields available:
- title
- subtitle
- period
- details (array)
- display order

### F. Certificates Management
Purpose:
- manage certificates and achievements

Fields available:
- name
- issuer
- image URL
- display order

### G. Site Content Management
Purpose:
- edit the homepage copy and SEO data

Editable fields include:
- hero title
- hero subtitle
- hero status
- about text and paragraphs
- contact intro
- footer text
- SEO title
- SEO description
- resume URL

### H. Branding Management
Purpose:
- manage branding-related assets such as logo, portrait, hero image, favicon

### I. Socials Management
Purpose:
- manage social media links shown on the site

Fields include:
- label
- URL
- icon
- display order

### J. Authentication / Access
Purpose:
- protect admin routes with authentication
- allow secure login to the CMS

---

# 4. Current Database Structure

The app uses Supabase PostgreSQL with multiple tables.

## 4.1 Main Tables

### projects
Stores portfolio projects.

Fields:
- id
- title
- year
- description
- tech (array)
- github
- demo
- live_website
- highlight
- image_url
- display_order
- created_at
- updated_at

### skills
Stores skill data.

Fields:
- id
- name
- category
- level
- display_order
- created_at
- updated_at

### education
Stores educational background entries.

Fields:
- id
- title
- subtitle
- period
- details (array)
- display_order
- created_at
- updated_at

### experience
Stores experience timeline entries.

Fields:
- id
- title
- subtitle
- period
- details (array)
- display_order
- created_at
- updated_at

### certificates
Stores certificates and achievements.

Fields:
- id
- name
- issuer
- image_url
- display_order
- created_at
- updated_at

### site_content
Stores main homepage copy and SEO text.

Fields:
- id
- hero_title
- hero_subtitle
- hero_status
- about_text
- about_paragraph1
- about_paragraph2
- about_paragraph3
- contact_intro
- footer_text
- seo_title
- seo_description
- resume_url
- logo_url
- portrait_url
- hero_image_url
- favicon_url
- updated_at

### socials
Stores social links.

Fields:
- id
- label
- href
- icon
- display_order
- created_at
- updated_at

### appreciations / appreciation_logs
Tracks appreciation interactions.

Purpose:
- count how many visitors appreciated the portfolio
- support admin stats

---

# 5. Current App Behavior

## 5.1 Public Site Behavior
- Loads portfolio content dynamically from Supabase.
- Renders sections based on data from the database.
- Supports responsive design for desktop and mobile.
- Uses motion/animation effects and decorative visuals.
- Supports resume download.
- Supports appreciation button interaction.
- Allows smooth scroll navigation between sections.

## 5.2 Admin Behavior
- Authenticated users can enter the admin panel.
- The admin uses a table-based CRUD interface.
- Content changes are saved to Supabase in real time.
- The admin dashboard displays counts and simple analytics.

---

# 6. Current UI Style Characteristics

The current design is:
- dark themed
- futuristic
- animated
- visually rich
- layered with gradients and glow effects
- more “creative” than “minimal professional”

It has strong visual identity but may feel too experimental or over-designed for a personal portfolio if the goal is a cleaner, more natural and professional presentation.

---

# 7. What Exists Right Now

## Public site features already implemented
- Modern landing hero
- About section
- Education and experience sections
- Projects cards
- Skills display
- Certificates display
- Dynamic content loading from Supabase
- Appreciation button
- Contact/footer area
- Responsive layout
- Admin authentication and CMS structure

## Admin features already implemented
- Dashboard
- Project CRUD
- Skills CRUD
- Education CRUD
- Experience CRUD
- Certificates CRUD
- Site content editing
- Brand asset management pages
- Social links management
- Authentication guard

---

# 8. Main Redesign Goal

The redesign should move from a highly styled, experimental, “vibecoded” appearance toward a more normal, professional, polished, and simple portfolio experience.

## Redesign direction
- Cleaner layout
- Better spacing and hierarchy
- More readable typography
- Less excessive motion
- Less visual noise
- Professional color palette
- More balanced use of cards and sections
- Stronger emphasis on content rather than decoration
- More calm, modern, and trustworthy design

## Design priorities for the redesign
1. Make the site feel professional, not overly flashy.
2. Improve readability and content hierarchy.
3. Use a simpler visual system with consistent cards, spacing, and typography.
4. Keep the dynamic CMS features intact.
5. Preserve the portfolio’s identity and personality while reducing visual clutter.
6. Ensure the admin panel remains simple and usable.

---

# 9. Recommended Redesign Instructions for AI

When handing this to ChatGPT or another AI builder, use the following direction:

- Keep the existing portfolio concept and all data-driven functionality.
- Preserve the current content model and Supabase-based CMS.
- Do not remove the admin system.
- Refactor the visual design into something more professional and minimal.
- Replace overly experimental effects with cleaner transitions and better layout structure.
- Focus on clarity, balance, spacing, and readability.
- Improve the public portfolio layout into a strong personal site that feels modern and trustworthy.
- Improve the admin site to feel calm, structured, and production-ready.

---

# 10. Suggested Prompt for ChatGPT

You can paste the following prompt into ChatGPT after this file:

"Take this portfolio and admin CMS project and redesign it into a clean, professional, modern portfolio website. Keep the existing functionality, Supabase-based CMS, authentication, and content structure. Remove the overly vibecoded and experimental visual style. Make the site feel normal, polished, and professional. Improve the hierarchy, spacing, typography, and interaction design. Make the public portfolio simple and elegant, and make the admin panel clean and intuitive. Preserve the current content model and all sections such as hero, about, background, projects, skills, certificates, appreciation, and contact. Use a refined minimal design system with better readability and less visual noise."

---

# 11. Summary

This project is a dynamic personal portfolio website with a content-driven admin panel. It already has:
- a strong public portfolio experience,
- a working CMS,
- Supabase-backed content,
- project/skill/certificate management,
- authentication-protected admin routes,
- appreciation tracking,
- and a dark, animated visual style.

The goal for redesign is not to rebuild everything from scratch, but to transform the visual language into something more professional, calmer, and easier to understand while preserving the existing functionality.
