document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("data/site-data.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Could not load site-data.json (${response.status})`);
    }

    const data = await response.json();

    renderIndex(data);
    renderProjects(data);
    renderBlog(data);
    renderUpdates(data);
    renderResearch(data);
    renderAbout(data);
    renderContact(data);

  } catch (error) {
    console.error("Portfolio data loading failed:", error);
  }
});


/* =========================================================
   HELPERS
   ========================================================= */

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizePath(path) {
  return String(path || "").replaceAll("\\", "/");
}

function tagsHTML(tags = []) {
  return tags
    .map(tag => `<span class="tag">${esc(tag)}</span>`)
    .join("");
}


/* =========================================================
   HOMEPAGE
   ========================================================= */

function renderIndex(data) {

  /* ---------- SELECTED PROJECTS ---------- */

  const projectGrid = document.querySelector("#work .project-grid");

  if (projectGrid && Array.isArray(data.projects)) {

    const featured = data.projects.filter(project => project.featured);

const selectedProjects =
  (featured.length ? featured : data.projects).slice(0, 4);

    projectGrid.innerHTML = selectedProjects.map((project, index) => `
      <article class="project-card">

        <div class="project-image">
          <img
            src="${normalizePath(project.image)}"
            alt="${esc(project.title)}">
        </div>

        <div class="card-body">

          <div class="project-no">
            ${String(index + 1).padStart(2, "0")} / ${esc(project.status)}
          </div>

          <h3>${esc(project.title)}</h3>

          <p>${esc(project.description)}</p>

          <div class="tags">
            ${tagsHTML(project.tags)}
          </div>

        </div>

      </article>
    `).join("");
  }


  /* ---------- RESEARCH INTERESTS ---------- */

  const interestsGrid =
    document.querySelector("#research-interests .interests-grid");

  if (
    interestsGrid &&
    data.research &&
    Array.isArray(data.research.interests)
  ) {

    interestsGrid.innerHTML = data.research.interests.map(interest => `
      <article class="interest">

        <div class="interest-icon">
          ${esc(interest.icon)}
        </div>

        <h3>${esc(interest.title)}</h3>

        <p>${esc(interest.description)}</p>

      </article>
    `).join("");
  }


  /* ---------- TOOLKIT ---------- */

  const toolkitGrid =
    document.querySelector("#toolkit .toolkit-grid");

  if (toolkitGrid && Array.isArray(data.toolkit)) {

    toolkitGrid.innerHTML = data.toolkit.map((group, index) => `
      <article class="toolkit-card">

        <div class="toolkit-icon">
          ${esc(group.icon || "⌘")}
        </div>

        <div class="toolkit-number">
          ${String(index + 1).padStart(2, "0")}
        </div>

        <h3>${esc(group.title)}</h3>

        <div class="toolkit-list">
          ${(group.tools || [])
            .map(tool => `<span>${esc(tool)}</span>`)
            .join("")}
        </div>

      </article>
    `).join("");
  }


  /* ---------- HERO ---------- */

  if (data.hero) {

    const kicker = document.querySelector(".hero .kicker");

    if (kicker && data.hero.kicker) {
      kicker.textContent = data.hero.kicker;
    }

    const status = document.querySelector(".hero .status-items");

    if (status && data.hero.status) {
      const parts = data.hero.status.split(" • ");

      status.innerHTML = parts
        .map((item, i) =>
          i === 0
            ? esc(item)
            : ` <span>•</span> ${esc(item)}`
        )
        .join("");
    }
  }
}


/* =========================================================
   PROJECT ARCHIVE PAGE
   ========================================================= */

function renderProjects(data) {

  const archive =
    document.querySelector(".archive-grid");

  if (!archive || !Array.isArray(data.projects)) {
    return;
  }

  archive.innerHTML = data.projects.map((project, index) => `
    <article class="project-card">

      <div class="project-image">
        <img
          src="${normalizePath(project.image)}"
          alt="${esc(project.title)}">
      </div>

      <div class="card-body">

        <div class="project-no">
          ${String(index + 1).padStart(2, "0")} / ${esc(project.status)}
        </div>

        <h3>${esc(project.title)}</h3>

        <p>${esc(project.description)}</p>

        <div class="tags">
          ${tagsHTML(project.tags)}
        </div>

        ${
          project.link
            ? `
              <div style="margin-top:14px;">
                <a
                  class="arrow"
                  href="${esc(project.link)}"
                  target="_blank"
                  rel="noopener">
                  VIEW PROJECT ↗
                </a>
              </div>
            `
            : ""
        }

      </div>

    </article>
  `).join("");
}


/* =========================================================
   RESEARCH BLOG
   ========================================================= */

function renderBlog(data) {

  const blogGrid =
    document.querySelector(".blog-grid");

  if (!blogGrid || !Array.isArray(data.blog)) {
    return;
  }

  blogGrid.innerHTML = data.blog.map(post => `
    <article class="blog-card">

      <div class="blog-meta">
        ${esc(post.category || "")}
        ${post.readTime ? ` · ${esc(post.readTime)}` : ""}
        ${post.year ? ` · ${esc(post.year)}` : ""}
      </div>

      <h3>${esc(post.title)}</h3>

      <p>${esc(post.description)}</p>

      <a
        class="arrow"
        href="${esc(post.url || "#")}">
        READ ARTICLE →
      </a>

    </article>
  `).join("");
}


/* =========================================================
   NEWS & STATUS
   ========================================================= */

function renderUpdates(data) {

  const updatesGrid =
    document.querySelector(".updates-grid");

  if (!updatesGrid || !Array.isArray(data.news)) {
    return;
  }

  updatesGrid.innerHTML = data.news.map(update => `
    <article class="update">

      <div class="update-thumb">
        <img
          src="${normalizePath(
            update.image || "assets/images/project-placeholder.svg"
          )}"
          alt="${esc(update.title)}">
      </div>

      <div>

        <div class="update-date">
          ${esc(update.date || "")}
        </div>

        <h3>
          ${esc(update.title)}
        </h3>

        <p>
          ${esc(update.description)}
        </p>

      </div>

    </article>
  `).join("");
}


/* =========================================================
   RESEARCH PAGE
   ========================================================= */

function renderResearch(data) {

  if (!data.research) {
    return;
  }

  const intro =
    document.querySelector(".research-intro");

  if (intro && data.research.intro) {
    intro.textContent = data.research.intro;
  }


  const interestsGrid =
    document.querySelector("#research-interests .interests-grid");

  if (
    interestsGrid &&
    Array.isArray(data.research.interests)
  ) {

    interestsGrid.innerHTML =
      data.research.interests.map(interest => `
        <article class="interest">

          <div class="interest-icon">
            ${esc(interest.icon)}
          </div>

          <h3>${esc(interest.title)}</h3>

          <p>${esc(interest.description)}</p>

        </article>
      `).join("");
  }


  /* ---------- RESEARCH BLOG PROMO ---------- */

  const blogSection =
    document.querySelector("#research-blog");

  if (blogSection) {

    const title =
      blogSection.querySelector("h2");

    const description =
      blogSection.querySelector(".lead");

    if (title && data.research.blogTitle) {
      title.textContent = data.research.blogTitle;
    }

    if (description && data.research.blogIntro) {
      description.textContent = data.research.blogIntro;
    }
  }


  /* ---------- RESEARCH GROUP ---------- */

  const groupSection =
    document.querySelector("#group");

  if (groupSection) {

    const title =
      groupSection.querySelector("h2");

    const description =
      groupSection.querySelector(".lead");

    const link =
      groupSection.querySelector("a.btn");

    const kicker =
      groupSection.querySelector(".kicker");

    if (kicker && data.research.groupKicker) {
      kicker.textContent = data.research.groupKicker;
    }

    if (title && data.research.groupTitle) {
      title.textContent = data.research.groupTitle;
    }

    if (description && data.research.groupDescription) {
      description.textContent =
        data.research.groupDescription;
    }

    if (link && data.research.groupUrl) {
      link.href = data.research.groupUrl;
    }
  }
}


/* =========================================================
   ABOUT PAGE
   ========================================================= */

function renderAbout(data) {

  if (!data.profile) {
    return;
  }

  const paragraphs =
    document.querySelector(".about-copy");

  if (paragraphs && Array.isArray(data.profile.aboutParagraphs)) {

    const button =
      paragraphs.querySelector("a.btn");

    paragraphs.innerHTML =
      data.profile.aboutParagraphs
        .map(text => `<p>${esc(text)}</p>`)
        .join("");

    if (button) {
      paragraphs.appendChild(button);
    }
  }


  const photo =
    document.querySelector(".about-photo img");

  if (photo && data.profile.photo) {
    photo.src = normalizePath(data.profile.photo);
  }


  const tagline =
    document.querySelector(".page-hero .research-intro");

  if (tagline && data.profile.tagline) {
    tagline.textContent = data.profile.tagline;
  }
}


/* =========================================================
   CONTACT
   ========================================================= */

function renderContact(data) {

  if (!data.contact) {
    return;
  }

  const c = data.contact;

  document.querySelectorAll(".cta").forEach(section => {

    const links =
      section.querySelectorAll(".social");

    links.forEach(link => {

      const label =
        link.querySelector("span");

      const value =
        link.querySelector("strong");

      if (!label || !value) {
        return;
      }

      const type =
        label.textContent.trim().toLowerCase();

      if (type === "github" && c.github) {
        link.href = c.github;
        value.textContent =
          c.github.replace("https://github.com/", "@");
      }

      if (type === "linkedin" && c.linkedin) {
        link.href = c.linkedin;
        value.textContent = c.linkedin;
      }

      if (type === "email" && c.email) {
        link.href = c.email;
        value.textContent =
          c.email.replace("mailto:", "");
      }

      if (type.includes("scholar") && c.scholar) {
        link.href = c.scholar;
      }

    });
  });
}
/*
=========================================================
ADD TO THE END OF assets/js/site-data.js
=========================================================

Then make ONE small change near the top:
replace the existing calls:

    renderIndex(data);
    renderProjects(data);
    renderBlog(data);
    renderUpdates(data);
    renderResearch(data);
    renderAbout(data);
    renderContact(data);

with:

    renderIndex(data);
    renderProjects(data);
    renderBlog(data);
    renderUpdates(data);
    renderResearch(data);
    renderAbout(data);
    renderContact(data);
    renderGallery(data);
    renderCertificates(data);

The two functions below make Gallery and Certificates
data-driven. They use flexible selectors because the
existing gallery/certificates HTML can differ.
=========================================================
*/

function renderGallery(data){

  const source =
    Array.isArray(data.gallery)
      ? data.gallery
      : [];

  const containers = [
    document.querySelector(".gallery-grid"),
    document.querySelector("#gallery .gallery-grid"),
    document.querySelector(".gallery-list"),
    document.querySelector("#gallery .gallery-list")
  ].filter(Boolean);

  const gallery =
    containers[0];

  if(!gallery){
    return;
  }

  gallery.innerHTML =
    source.map(item => `

      <article class="gallery-item">

        <div class="gallery-image">

          <img
            src="${normalizePath(
              item.image ||
              item.imagePath ||
              ""
            )}"
            alt="${esc(
              item.alt ||
              item.altText ||
              item.title ||
              ""
            )}">

        </div>

        <div class="gallery-content">

          ${
            item.category
              ? `<div class="gallery-category">
                   ${esc(item.category)}
                 </div>`
              : ""
          }

          <h3>
            ${esc(
              item.title ||
              item.name ||
              ""
            )}
          </h3>

          ${
            item.caption ||
            item.description
              ? `<p>
                   ${esc(
                     item.caption ||
                     item.description
                   )}
                 </p>`
              : ""
          }

          ${
            item.url
              ? `<a
                   class="arrow"
                   href="${esc(item.url)}"
                   target="_blank"
                   rel="noopener">
                   VIEW ↗
                 </a>`
              : ""
          }

        </div>

      </article>

    `).join("");
}


function renderCertificates(data){

  const source =
    Array.isArray(data.certificates)
      ? data.certificates
      : [];

  const containers = [
    document.querySelector(".certificates-grid"),
    document.querySelector("#certificates .certificates-grid"),
    document.querySelector(".certificates-list"),
    document.querySelector("#certificates .certificates-list")
  ].filter(Boolean);

  const certificates =
    containers[0];

  if(!certificates){
    return;
  }

  certificates.innerHTML =
    source.map(item => `

      <article class="certificate-card">

        <div class="certificate-image">

          <img
            src="${normalizePath(
              item.image ||
              item.imagePath ||
              ""
            )}"
            alt="${esc(
              item.alt ||
              item.title ||
              ""
            )}">

        </div>

        <div class="certificate-content">

          ${
            item.category
              ? `<div class="certificate-category">
                   ${esc(item.category)}
                 </div>`
              : ""
          }

          <h3>
            ${esc(
              item.title ||
              item.name ||
              ""
            )}
          </h3>

          ${
            item.issuer ||
            item.organization
              ? `<div class="certificate-issuer">
                   ${esc(
                     item.issuer ||
                     item.organization
                   )}
                 </div>`
              : ""
          }

          ${
            item.date ||
            item.year
              ? `<div class="certificate-date">
                   ${esc(
                     item.date ||
                     item.year
                   )}
                 </div>`
              : ""
          }

          ${
            item.description ||
            item.caption
              ? `<p>
                   ${esc(
                     item.description ||
                     item.caption
                   )}
                 </p>`
              : ""
          }

          ${
            item.url ||
            item.credentialUrl
              ? `<a
                   class="arrow"
                   href="${esc(
                     item.url ||
                     item.credentialUrl
                   )}"
                   target="_blank"
                   rel="noopener">
                   VIEW CREDENTIAL ↗
                 </a>`
              : ""
          }

        </div>

      </article>

    `).join("");
}


/*
=========================================================
OPTIONAL — SELECTED WORK CONTROL

Your existing renderIndex() currently uses:

    const selectedProjects = data.projects.slice(0, 4);

Replace that ONE line with:

    const featured = data.projects.filter(project => project.featured);
    const selectedProjects =
      (featured.length ? featured : data.projects).slice(0, 4);

This makes the Homepage editor's Selected Work
checkboxes control the four homepage cards.
=========================================================
*/
