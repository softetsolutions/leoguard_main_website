document.addEventListener("DOMContentLoaded", function () {
  // 1. Loading Screen
  const loader = document.getElementById("loader");
  if (loader) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        loader.classList.add("hide");
        setTimeout(() => {
          loader.style.display = "none";
        }, 500);
      }, 800);
    });
  }

  // 2. Mobile Navigation
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  function closeMobileMenu() {
    if (navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      if (hamburger) {
        hamburger.classList.remove("active");
        const bars = hamburger.querySelectorAll(".bar");
        bars[0].style.transform = "";
        bars[1].style.opacity = "1";
        bars[2].style.transform = "";
      }
      document.body.style.overflow = "";
    }
  }

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      hamburger.classList.toggle("active");
      const bars = hamburger.querySelectorAll(".bar");
      if (navMenu.classList.contains("active")) {
        bars[0].style.transform = "rotate(45deg) translate(5px, 5px)";
        bars[1].style.opacity = "0";
        bars[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
        document.body.style.overflow = "hidden";
      } else {
        bars[0].style.transform = "";
        bars[1].style.opacity = "1";
        bars[2].style.transform = "";
        document.body.style.overflow = "";
      }
    });
  }

  // Mobile dropdown toggle
  document.querySelectorAll(".dropdown-toggle").forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      if (window.innerWidth <= 968) {
        e.preventDefault(); 
        const dropdown = toggle.closest(".dropdown");
        dropdown.classList.toggle("active");
      }
    });
  });

  // FIX: Close mobile menu when a nav link is tapped, but wait 150ms 
  // so the browser can execute the actual link navigation before disappearing.
  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const isDropdownToggle = link.classList.contains("dropdown-toggle");
      if (window.innerWidth <= 968 && !isDropdownToggle) {
        setTimeout(() => {
            closeMobileMenu();
        }, 150);
      } 
    });
  });

  // 3. Header Scrolled State
  const header = document.getElementById("mainHeader");
  window.addEventListener("scroll", () => {
    if (!header) return;
    if (window.scrollY > 50) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  });

  // 4. Scroll Reveal
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  // 5. Contact Form Simulation
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      btn.innerHTML = "Sending...";
      btn.disabled = true;

      setTimeout(() => {
        document.getElementById("formFeedback").textContent =
          "Inquiry successfully sent. Our corporate team will contact you.";
        document.getElementById("formFeedback").style.color = "#3A7D30";
        this.reset();
        btn.innerHTML = 'Send Inquiry <i class="fas fa-paper-plane"></i>';
        btn.disabled = false;
      }, 1500);
    });
  }

  // 6. Category Page Filter Logic
  const filterBtns = document.querySelectorAll(".filter-btn");
  const categorySections = document.querySelectorAll(".category-section");

  function activateCategory(targetId) {
    if (!targetId) return;

    categorySections.forEach((sec) => sec.classList.remove("active"));
    filterBtns.forEach((btn) => btn.classList.remove("active"));

    const targetSection = document.getElementById(targetId);
    const targetBtn = document.querySelector(
      `.filter-btn[data-target="${targetId}"]`,
    );

    if (targetSection) targetSection.classList.add("active");
    if (targetBtn) targetBtn.classList.add("active");

    if (window.innerWidth <= 968 && targetSection) {
      window.scrollTo({
        top: document.querySelector(".products-content").offsetTop - 100,
        behavior: "smooth",
      });
    }
  }

  // FIX: Allow navbar category links to switch tabs smoothly while already on categories.html
  window.addEventListener('hashchange', () => {
    if (window.location.pathname.includes('categories.html') || window.location.pathname.endsWith('categories')) {
        const hashTarget = window.location.hash.substring(1);
        if(hashTarget) {
           activateCategory(hashTarget);
        }
    }
  });

  if (
    window.location.pathname.includes("categories.html") &&
    window.location.hash
  ) {
    const hashTarget = window.location.hash.substring(1);
    activateCategory(hashTarget);
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = btn.getAttribute("data-target");
      activateCategory(target);
      if(history.pushState) {
          history.pushState(null, null, `#${target}`);
      } else {
          window.location.hash = target;
      }
    });
  });

  // 7. Product Modal - Show detailed info on click
  const modal = document.getElementById("productModal");
  const modalContent = document.getElementById("modalProductDetails");
  const modalClose = document.querySelector(".modal-close");

  const productDetails = {
    "Kojimic Cream": {
      name: "Kojimic Cream",
      img: "assets/kojimic.png",
      composition:
        "Tranexamic Acid 10% + Kojic Acid 2% + Magnesium Ascorbyl Phosphate 1% + Arbutin 1.5% + Vitamin E (Zinc Manganese Chelating Complex)",
      usage:
        "Apply twice daily on affected areas. For the use of a Registered Medical Practitioner or a Hospital or a Laboratory Only.",
      indication: "For hyperpigmentation, melasma, and skin brightening.",
    },
    "Kojimic Plus Cream": {
      name: "Kojimic Plus Cream",
      img: "assets/kojimic plus.png",
      composition:
        "Tranexamic Acid 5%, Glycolic Acid 5% + Kojic Acid 2% + Octanoic Acid 1% + Arbutin 1.5% + Vitamin E (Zinc Manganese Chelating Complex)",
      usage: "Apply once daily at night. Avoid sun exposure.",
      indication: "For stubborn pigmentation and melasma.",
    },
    "Follistore Hair Growth Serum": {
      name: "Follistore Hair Growth Serum",
      img: "assets/folistore.png",
      composition:
        "Aqua, Propolis 2%, Burgoon Up 3%, Anjaniq 3%, Biotin 2% (Contains: Amino Acids, Minerals, Vitamins)",
      usage: "Apply to scalp twice daily. Massage gently.",
      indication: "For hair growth stimulation and strengthening.",
    },
    "Follistore Tablet": {
      name: "Follistore Tablet",
      img: "assets/follistore tab.png",
      composition:
        "Nutritional supplement with essential vitamins and minerals for hair health.",
      usage: "Take one tablet twice daily after meals.",
      indication: "Supports hair growth and reduces hair fall.",
    },
    "Follistore Anti Hairfall Shampoo": {
      name: "Follistore Anti Hairfall Shampoo",
      img: "assets/folistore fd.png",
      composition: "Gentle cleansing formula with anti-hairfall properties.",
      usage:
        "Use regularly for best results. Massage into wet hair, leave for 2-3 minutes, then rinse.",
      indication: "Reduces hair fall, strengthens roots.",
    },
    "AD-C Nano Gel": {
      name: "AD-C Nano Gel",
      img: "assets/ad nano gel.png",
      composition: "Adapalene 0.1% w/w + Benzoyl Peroxide (2.5% w/w)",
      usage:
        "Apply thin layer once daily at night on clean, dry skin. Avoid contact with eyes and mouth.",
      indication: "For acne vulgaris, comedones, and inflammatory acne.",
    },
    "AD-B Nano Gel": {
      name: "AD-B Nano Gel",
      img: "assets/ad-bpop.png",
      composition:
        "Advanced acne treatment with benzoyl peroxide and adapalene combination.",
      usage: "Apply once daily at night. Use sunscreen during the day.",
      indication: "For moderate to severe acne.",
    },
    "Kojimic Soft Face Moisturiser": {
      name: "Kojimic Soft Face Moisturiser",
      img: "assets/kojimic pro.png",
      composition: "Lightweight moisturizer with skin brightening agents.",
      usage: "Apply morning and evening to clean skin.",
      indication: "For hydration and even skin tone.",
    },
    "Aquastore Moisturizing Cream": {
      name: "Aquastore Moisturizing Cream",
      img: "https://placehold.co/400x400/FFF8F5/E8601C?text=Aquastore",
      composition: "Ceramides, hyaluronic acid, and essential lipids.",
      usage: "Apply liberally to face and body as needed.",
      indication: "For dry and sensitive skin.",
    },
    "Aquastore SPF 50+": {
      name: "Aquastore SPF 50+",
      img: "assets/ninja sol.png",
      composition: "Broad-spectrum UVA/UVB protection with PA++++ rating.",
      usage: "Apply 15 minutes before sun exposure. Reapply every 2-3 hours.",
      indication: "Sun protection for all skin types.",
    },
    "ZMM Tablets": {
      name: "ZMM Tablets",
      img: "assets/zmm tablet.png",
      composition: "Zinc Manganese Chelating Complex",
      usage: "Take one tablet daily with food.",
      indication: "Antioxidant support for skin health.",
    },
    "ZMM Plus": {
      name: "ZMM Plus",
      img: "assets/zmm plus.png",
      composition: "Enhanced formulation with additional antioxidants.",
      usage: "Take one tablet twice daily.",
      indication: "For overall skin vitality and protection.",
    },
    "ZMM Glow": {
      name: "ZMM Glow",
      img: "assets/zmm glow-250.png",
      composition:
        "Beta-carotene, Glutathione, Caffeine, Copper, Zinc, Alpha-lipoic acid, Grape seed extract & Collagen hydrolysate.",
      usage: "Take one tablet twice daily.",
      indication: "For skin glow and anti-aging.",
    },
    Urtilong: {
      name: "Urtilong",
      img: "assets/urtilong.png",
      composition: "Antiallergic formulation with desloratadine.",
      usage: "Take as directed by physician.",
      indication: "For allergy relief.",
    },
    "Urtilong-M": {
      name: "Urtilong-M",
      img: "assets/urtilong m.png",
      composition: "Antiallergic with minerals.",
      usage: "Take one tablet daily.",
      indication: "For chronic allergy symptoms.",
    },
    "Urtilong-DM": {
      name: "Urtilong-DM",
      img: "assets/urtiong-dm.png",
      composition:
        "Desloratadine Tablets (Contains: Amino Acids, Minerals, Vitamins)",
      usage: "Take one tablet daily.",
      indication: "For allergic rhinitis and urticaria.",
    },
    "Prublast Bilastine": {
      name: "Prublast Bilastine",
      img: "assets/prublast.png",
      composition: "Bilastine 20 mg tablets.",
      usage: "Take one tablet daily on an empty stomach.",
      indication: "Non-sedative allergy relief.",
    },
    "ITLONG-100/200": {
      name: "ITLONG-100/200",
      img: "assets/itlong-100.png",
      composition: "Itraconazole 100 mg / 200 mg capsules.",
      usage: "Take as prescribed by physician.",
      indication: "Systemic antifungal treatment.",
    },
    "Ninjafine 250": {
      name: "Ninjafine 250",
      img: "assets/kzlong soup.png",
      composition: "Antifungal tablets.",
      usage: "Take one tablet daily.",
      indication: "For fungal infections.",
    },
    LZlong: {
      name: "LZlong",
      img: "assets/l z long.png",
      composition: "Luliconazole Cream.",
      usage: "Apply to affected area once daily.",
      indication: "For topical fungal infections.",
    },
    "ZMM-GT": {
      name: "ZMM-GT",
      img: "assets/zmm-gtx.png",
      composition:
        "L-Glutathione 500 mg + Alpha lipoic acid 100 mg + Vitamin C 50 mg.",
      usage: "Take one tablet daily.",
      indication: "Skin lightening and antioxidant support.",
    },
    "ZMM-GTX": {
      name: "ZMM-GTX",
      img: "assets/zmm-gtx.png",
      composition:
        "L-Glutathione 250 mg, Tranexamic Acid 250 mg, Ascorbic Acid 500 mg.",
      usage: "Take one tablet daily.",
      indication: "Advanced skin lightening.",
    },
    "Tacrotop Forte": {
      name: "Tacrotop Forte",
      img: "assets/tacrotop.png",
      composition: "Tacrolimus 0.1% w/w.",
      usage: "Apply thin layer twice daily. For external use only.",
      indication: "Immunomodulator for atopic dermatitis.",
    },
    "Melastore Tablets": {
      name: "Melastore Tablets",
      img: "assets/melastore.png",
      composition: "Herbal and antioxidant formulation.",
      usage: "Take one tablet twice daily.",
      indication: "For pigmentation disorders.",
    },
    "Fusileo M": {
      name: "Fusileo M",
      img: "assets/fusileo-m.png",
      composition: "Combination cream for skin infections.",
      usage: "Apply twice daily to affected area.",
      indication: "For bacterial and fungal infections.",
    },
    "Ninjasol-S": {
      name: "Ninjasol-S",
      img: "assets/ninja sol.png",
      composition: "Solubilized ointment.",
      usage: "Apply as directed.",
      indication: "For topical applications.",
    },
    "ZMM-Cal": {
      name: "ZMM-Cal",
      img: "assets/zmm-cal.png",
      composition: "Calcium Gluconate 1000 mg + Magnesium Sulfate 200 mg.",
      usage: "Take one tablet twice daily.",
      indication: "Calcium and magnesium supplementation.",
    },
  };

  function showProductDetails(productName) {
    const details = productDetails[productName];
    if (!details) return;

    modalContent.innerHTML = `
            <div class="modal-product-details">
                <img src="${details.img}" alt="${details.name}" onerror="this.src='https://placehold.co/200x200/FFF8F5/E8601C?text=${encodeURIComponent(details.name)}'">
                <h3>${details.name}</h3>
                <p><strong>Composition:</strong> ${details.composition}</p>
                <p><strong>Indication:</strong> ${details.indication}</p>
                <div class="usage">
                    <strong>Directions for Use:</strong> ${details.usage}
                </div>
            </div>
        `;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Attach click handlers to all product items
  const productItems = document.querySelectorAll(".product-item");
  productItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const productName =
        item.getAttribute("data-product") ||
        item.querySelector("h4")?.innerText;
      if (productName) {
        showProductDetails(productName);
      }
    });
  });

  console.log("Dermalong website fully loaded with product modal");
});