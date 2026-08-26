/* Style direction: Midnight Distribution Film — contemporary Indian corporate editorial, deep navy, warm white, Route Amber, asymmetric image-led layouts, restrained motion. */
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronRight, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const ASSETS = {
  hero: "/manus-storage/prk-hero_262f4659.jpg",
  products: "/manus-storage/prk-products_efb48591.jpg",
  operations: "/manus-storage/prk-operations_d0561270.jpg",
  trichy: "/manus-storage/prk-trichy_0d2ec7dd.jpg",
  mark: "/manus-storage/prk-route-mark_f9a1ecb9.png",
};

const products = [
  { name: "CLEAR", type: "Packaged drinking water", note: "Everyday hydration, prepared for the route.", image: ASSETS.products },
  { name: "SVVA", type: "Packaged drinking water", note: "A considered water supply for real requirements.", image: ASSETS.products },
  { name: "BEVERAGES", type: "Beverage products", note: "Crates and cases moving through the network.", image: ASSETS.operations },
  { name: "GAS", type: "Gas distribution", note: "Organized, professional supply with safety in mind.", image: ASSETS.operations },
  { name: "OTHER PRODUCTS", type: "Commercial supply", note: "Additional products available through the network.", image: ASSETS.hero },
];

const mediaKeyByProduct: Record<string, string> = { CLEAR: "product-clear", SVVA: "product-svva", BEVERAGES: "product-beverages", GAS: "product-gas", "OTHER PRODUCTS": "product-other" };

const services = [
  { no: "01", title: "Water supply", copy: "Packaged drinking water supply for businesses, retailers and other requirements.", image: ASSETS.products },
  { no: "02", title: "Beverage distribution", copy: "Distribution of beverage products through the PRK network.", image: ASSETS.operations },
  { no: "03", title: "Gas agency", copy: "Gas-related supply and distribution services in a clean, professional setting.", image: ASSETS.operations },
  { no: "04", title: "Business supply", copy: "Supply solutions for commercial and business requirements.", image: ASSETS.hero },
];

const mediaKeyByService: Record<string, string> = { "Water supply": "service-water", "Beverage distribution": "service-beverages", "Gas agency": "service-gas", "Business supply": "service-business" };

const process = [
  ["01", "Stock", "Products are received and organized."],
  ["02", "Sort", "Orders are prepared for distribution."],
  ["03", "Deliver", "Products move through the distribution network."],
  ["04", "Supply", "Customers and businesses receive what they need."],
];

function SectionLabel({ number, children, light = false }: { number: string; children: string; light?: boolean }) {
  return <div className={`section-label ${light ? "section-label-light" : ""}`}><span>{number}</span><i />{children}</div>;
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { data: mediaSections } = trpc.media.list.useQuery();
  const mediaByKey = new Map((mediaSections ?? []).map((item) => [item.sectionKey, item]));
  const imageFor = (key: string, fallback: string) => mediaByKey.get(key)?.imageUrl || fallback;
  const captionFor = (key: string, fallback: string) => mediaByKey.get(key)?.caption || fallback;
  const videoFor = (key: string) => mediaByKey.get(key)?.videoUrl || null;
  const heroVideo = videoFor("hero");
  const heroPoster = imageFor("hero", ASSETS.hero);

  useEffect(() => {
    if (!videoRef.current || !heroVideo) return;
    if (videoPaused) videoRef.current.pause();
    else void videoRef.current.play().catch(() => undefined);
  }, [heroVideo, videoPaused]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    const targets = document.querySelectorAll(".reveal-section, .service-row, .process-step, .why-item");
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const submitEnquiry = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Your enquiry is ready to send.", { description: "Contact details will be connected once PRK Agencies provides them." });
  };

  return (
    <div className="site-shell">
      <header className={`site-nav ${scrolled ? "site-nav-scrolled" : ""}`}>
        <a href="#home" className="brand-lockup" onClick={closeMenu}>
          <img src={ASSETS.mark} alt="" className="brand-mark" />
          <span className="brand-name">PRK <b>AGENCIES</b><small>WATER · BEVERAGES · GAS · DISTRIBUTION</small></span>
        </a>
        <nav className={menuOpen ? "nav-links nav-links-open" : "nav-links"}>
          {[["ABOUT", "about"], ["PRODUCTS", "products"], ["SERVICES", "services"], ["BRANDS", "brands"], ["CONTACT", "contact"]].map(([label, id]) => <a href={`#${id}`} key={id} onClick={closeMenu}>{label}</a>)}
          <a className="nav-cta" href="#enquiry" onClick={closeMenu}>ENQUIRE NOW <ArrowRight size={15} /></a>
        </nav>
        <button className="menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <main>
        <section id="home" className="hero-section">
          {heroVideo ? <video ref={videoRef} className="hero-image" autoPlay muted loop playsInline poster={heroPoster} aria-label="PRK Agencies distribution journey video"><source src={heroVideo} type="video/mp4" /></video> : <img src={heroPoster} alt="PRK Agencies delivery route in Trichy" className="hero-image" />}
          <div className="hero-wash" />
          <div className="hero-content page-width">
            <div className="hero-kicker"><span className="pulse-dot" /> TRICHY · TAMIL NADU <span className="kicker-rule" /></div>
            <h1>Distribution<br /><em>that keeps</em><br />Trichy moving.</h1>
            <p>Reliable distribution across packaged drinking water, beverages, gas and essential business supplies.</p>
            <div className="hero-actions"><a href="#products" className="button button-primary">EXPLORE PRODUCTS <ArrowRight size={16} /></a><a href="#enquiry" className="button button-ghost">SEND AN ENQUIRY <ArrowRight size={16} /></a></div>
          </div>
          <div className="hero-bottom page-width"><span>01 / 09</span><span className="hero-scroll"><span /> SCROLL TO EXPLORE</span><button className="hero-video-control" type="button" onClick={() => setVideoPaused((current) => !current)} aria-label={videoPaused ? "Play hero video" : "Pause hero video"}>{videoPaused ? "PLAY FILM" : "PAUSE FILM"}</button><span>EST. ROUTE / LOCAL REACH</span></div>
        </section>

        <section id="about" className="intro-section page-width section-pad reveal-section">
          <div className="intro-copy"><SectionLabel number="02">THE PRK APPROACH</SectionLabel><h2>More than supply.<br /><em>We keep businesses moving.</em></h2><p>PRK Agencies is a Trichy-based distribution and supply business serving businesses and customers with packaged drinking water, beverages, gas and other essential products.</p><a className="text-link" href="#enquiry">ABOUT PRK <ArrowRight size={17} /></a></div>
          <div className="intro-visual"><img src={imageFor("intro", ASSETS.operations)} alt="Organized warehouse distribution activity" /><div className="image-caption"><span>{captionFor("intro", "THE WORK BEHIND THE ROUTE")}</span><span>TRICHY / 10.79° N</span></div></div>
        </section>

        <section id="products" className="products-section section-pad">
          <div className="page-width section-heading-row"><div><SectionLabel number="03" light>PRODUCT RUNWAY</SectionLabel><h2 className="light-heading">Products we<br /><em>distribute.</em></h2></div><p className="heading-aside">A considered range of products, organized for the businesses and customers that depend on them.</p></div>
          <div className="product-runway page-width">{products.map((product, index) => <article className="product-card" key={product.name}><div className="product-media"><img src={imageFor(mediaKeyByProduct[product.name], product.image)} alt={product.name} /><span className="product-index">0{index + 1}</span></div><div className="product-info"><span className="eyebrow">{product.type}</span><h3>{product.name}</h3><p>{product.note}</p><a href="#enquiry">VIEW PRODUCT <ChevronRight size={16} /></a></div></article>)}</div>
        </section>

        <section id="brands" className="brands-section"><div className="page-width brands-header"><SectionLabel number="04">BRAND NETWORK</SectionLabel><h2>Brands we <em>distribute.</em></h2></div><div className="marquee" aria-label="Brands distributed by PRK Agencies"><div className="marquee-track">{["CLEAR", "SVVA", "BRITISH EMPIRE", "CLEAR", "SVVA", "BRITISH EMPIRE"].map((brand, i) => <span key={`${brand}-${i}`}>{brand}<i>✦</i></span>)}</div></div></section>

        <section id="services" className="services-section section-pad page-width"><div className="services-intro"><SectionLabel number="05">THE SUPPLY SIDE</SectionLabel><h2>What we <em>supply.</em></h2><p>From everyday hydration to dependable commercial requirements, the work is simple: make the right supply available when it is needed.</p></div><div className="service-list">{services.map((service) => <article className="service-row" key={service.no}><span className="service-no">{service.no}</span><div className="service-image"><img src={imageFor(mediaKeyByService[service.title], service.image)} alt="" /></div><div className="service-copy"><h3>{service.title}</h3><p>{service.copy}</p></div><ArrowUpRight className="service-arrow" size={24} /></article>)}</div></section>

        <section className="process-section section-pad"><div className="page-width"><div className="process-head"><div><SectionLabel number="06" light>THE DISTRIBUTION PROCESS</SectionLabel><h2 className="light-heading">From source<br /><em>to shelf.</em></h2></div><p>Every delivery begins with an organized route and ends with a business that can keep going.</p></div><div className="process-line">{process.map(([no, title, copy]) => <div className="process-step" key={no}><span>{no}</span><div className="process-node" /><h3>{title}</h3><p>{copy}</p></div>)}</div></div></section>

        <section id="contact" className="trichy-section"><img src={imageFor("trichy", ASSETS.trichy)} alt="Trichy, Tamil Nadu at golden hour" /><div className="trichy-overlay" /><div className="page-width trichy-content"><SectionLabel number="07" light>HOME BASE</SectionLabel><h2>Trichy.<br /><em>Our home base.</em></h2><p>Serving businesses and customers from Trichy, Tamil Nadu, with dependable distribution and supply solutions.</p><span className="location-stamp">TIRUCHIRAPPALLI · TAMIL NADU</span></div></section>

        <section className="why-section section-pad page-width"><div className="why-heading"><SectionLabel number="08">THE DIFFERENCE</SectionLabel><h2>Why <em>PRK.</em></h2></div><div className="why-grid">{[["RELIABLE SUPPLY", "Consistent distribution and product availability."], ["LOCAL KNOWLEDGE", "A Trichy-based business serving the local market."], ["MULTIPLE CATEGORIES", "Water, beverages, gas and other supply requirements."], ["DIRECT ENQUIRY", "Easy communication for business and supply requirements."]].map(([title, copy], i) => <div className="why-item" key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{copy}</p></div>)}</div></section>

        <section id="enquiry" className="enquiry-section section-pad"><div className="page-width enquiry-layout"><div className="enquiry-intro"><SectionLabel number="09" light>START A CONVERSATION</SectionLabel><h2>Looking for a<br /><em>reliable supply partner?</em></h2><p>Tell us what you need. Our team will get back to you.</p><div className="contact-placeholders"><div><span>CALL US</span><strong>Contact details to be provided</strong></div><div><span>WHATSAPP</span><strong>Contact details to be provided</strong></div><div><span>EMAIL</span><strong>Contact details to be provided</strong></div></div></div><form className="enquiry-form" onSubmit={submitEnquiry}><label>FULL NAME<input required name="name" placeholder="Your name" /></label><label>BUSINESS / COMPANY NAME<input name="company" placeholder="Company name" /></label><div className="form-split"><label>PHONE NUMBER<input required name="phone" placeholder="Phone number" /></label><label>EMAIL ADDRESS<input type="email" name="email" placeholder="Email address" /></label></div><label>INTERESTED IN<select name="interest" defaultValue=""><option value="" disabled>Select a category</option><option>Water</option><option>Beverages</option><option>Gas</option><option>Business Supply</option><option>Other</option></select></label><label>MESSAGE<textarea required name="message" placeholder="Tell us what you need..."></textarea></label><button type="submit" className="button button-amber">SEND ENQUIRY <ArrowRight size={16} /></button></form></div></section>
      </main>

      <footer className="footer"><div className="footer-artwork"><img src="/manus-storage/prk-world-of-hydration_e82f803f.jpg" alt="World of Hydration brand network across India, UAE, USA, UK, and Japan" /></div><div className="page-width footer-top"><div className="footer-brand"><img src={ASSETS.mark} alt="" className="brand-mark" /><span className="brand-name">PRK <b>AGENCIES</b><small>WATER · BEVERAGES · GAS · DISTRIBUTION</small></span><p>Trichy, Tamil Nadu</p></div><div className="footer-links"><div><span className="eyebrow">EXPLORE</span><a href="#home">Home</a><a href="#about">About</a><a href="#products">Products</a><a href="#services">Services</a></div><div><span className="eyebrow">CONNECT</span><a href="#enquiry">Contact</a><span>Phone details to be provided</span><span>Email details to be provided</span></div></div></div><div className="page-width footer-bottom"><span>© 2026 PRK Agencies</span><span>WATER · BEVERAGES · GAS · DISTRIBUTION</span><a href="#home">BACK TO TOP ↑</a></div></footer>
    </div>
  );
}
