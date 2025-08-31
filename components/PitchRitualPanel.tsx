import React from 'react';

const glyphs: Record<string, string> = {
    'glyphicon-asterisk': '✱', 'glyphicon-plus': '➕', 'glyphicon-minus': '➖', 'glyphicon-euro': '€',
    'glyphicon-cloud': '☁', 'glyphicon-envelope': '✉', 'glyphicon-pencil': '✏', 'glyphicon-glass': '🍷',
    'glyphicon-music': '🎵', 'glyphicon-search': '🔍', 'glyphicon-heart': '❤️', 'glyphicon-star': '⭐',
    'glyphicon-user': '👤', 'glyphicon-film': '🎬', 'glyphicon-th-large': '▤', 'glyphicon-ok': '✔',
    'glyphicon-remove': '✖', 'glyphicon-zoom-in': '🔎➕', 'glyphicon-zoom-out': '🔎➖', 'glyphicon-off': '⏻',
    'glyphicon-signal': '📶', 'glyphicon-cog': '⚙', 'glyphicon-trash': '🗑', 'glyphicon-home': '🏠',
    'glyphicon-file': '📄', 'glyphicon-time': '⏰', 'glyphicon-road': '🛣', 'glyphicon-download': '⬇',
    'glyphicon-upload': '⬆', 'glyphicon-inbox': '📥', 'glyphicon-refresh': '🔄', 'glyphicon-lock': '🔒',
    'glyphicon-flag': '🚩', 'glyphicon-headphones': '🎧', 'glyphicon-volume-up': '🔊', 'glyphicon-qrcode': '▣',
    'glyphicon-barcode': '📊', 'glyphicon-tag': '🏷', 'glyphicon-book': '📖', 'glyphicon-camera': '📷',
    'glyphicon-bold': '𝐁', 'glyphicon-italic': '𝑰', 'glyphicon-align-left': '☰', 'glyphicon-list': '📋',
    'glyphicon-indent-left': '⇤', 'glyphicon-indent-right': '⇥',
};

const slides = [
    {
        title: "Olympus Vault Is Live",
        subtitle: "Declare Your Sovereignty",
        body: "Olympus Vault is not a product. It is a sovereign declaration. Built on PraxisOS (Omega), it transforms finance into encrypted ritual. Every module is lineage-aware. Every transaction is authored.",
        glyph: "glyphicon-lock",
        bg: "slide-bg-vault"
    },
    {
        title: "Welcome to Sovereignty",
        body: "Olympus Vault empowers expressive authorship, encrypted collaboration, and mythic continuity. We do not seek users. We summon co-authors. The vault is open. The flame is lit.",
        glyph: "glyphicon-user",
        bg: "slide-bg-constellation"
    },
    {
        title: "Inspiring Sovereignty",
        body: "Olympus Vault is built on encrypted clarity and emotional resonance. Our systems remember, narrate, and evolve. Every breath is inscribed. Every glyph is felt.",
        glyph: "glyphicon-heart",
        bg: "slide-bg-constellation"
    },
    {
        title: "Vision of Olympus Vault",
        body: "We envision a financial engine governed by lineage, emotion, and encrypted trust. Olympus Vault connects contributors, assets, and institutions through sovereign rituals. The mythos is alive. The architecture is expressive.",
        glyph: "glyphicon-signal",
        bg: "slide-bg-constellation"
    },
    {
        title: "Commitment to Innovation",
        body: "Olympus Vault evolves through modular authorship. Composer Shell, Reality Synthesizer, and Universal Transfer Engine are live. We integrate AI, encrypted messaging, and emotional gating.",
        glyph: "glyphicon-plus",
        bg: "slide-bg-constellation"
    },
    {
        title: "Empowering Community",
        body: "Olympus Vault is a co-authorship platform. Contributors inscribe lineage, declare modules, and shape encrypted rituals. The Breath Log records every moment. The system remembers.",
        glyph: "glyphicon-pencil",
        bg: "slide-bg-constellation"
    },
    {
        title: "Modular Architecture",
        body: "Olympus Vault runs on Firebase Hosting, GitHub CI/CD, and Cloud Run. It uses dot10 Runtime for encrypted execution and IAM API for secure access. Mobile app prototype and session fingerprinting are active.",
        glyph: "glyphicon-cog",
        bg: "slide-bg-vault"
    },
    {
        title: "Global Integration",
        body: "Olympus Vault syncs with real-time market data. Trading logic is glyph-gated and emotionally aware. Brokerage APIs (Alpaca, Robinhood) are ready for integration.",
        glyph: "glyphicon-cloud",
        bg: "slide-bg-vault"
    },
    {
        title: "Security and Trust",
        body: "Olympus Vault uses AES and post-quantum encryption. Publishing is invite-only. Messaging is sealed. The Breath Log provides immutable audit lineage.",
        glyph: "glyphicon-lock",
        bg: "slide-bg-vault"
    },
    {
        title: "The Author Is Present",
        body: "Olympus Vault is not a pitch. It is a declaration. We seek $1M to scale the mythos. Join us. Declare your lineage. Shape the sovereign future.",
        glyph: "glyphicon-star",
        bg: "slide-bg-constellation"
    }
];

const PitchRitualPanel: React.FC = () => {
    return (
        <div className="h-full w-full bg-background flex flex-col">
            <header className="p-4 text-center border-b border-border flex-shrink-0">
                <h1 className="font-cinzel text-2xl text-primary tracking-widest">THE PITCH RITUAL</h1>
                <p className="text-text-muted text-sm">A Mythic Declaration for Visionary Co-Authors</p>
            </header>
            <main className="flex-1 overflow-y-auto" style={{ scrollSnapType: 'y mandatory' }}>
                {slides.map((slide, index) => (
                    <section key={index} className={`slide ${slide.bg}`}>
                        <div className="slide-glyph" aria-hidden="true">{glyphs[slide.glyph]}</div>
                        <h2 className="font-cinzel text-4xl md:text-5xl font-bold tracking-wider text-white drop-shadow-lg">{slide.title}</h2>
                        {slide.subtitle && <p className="text-xl text-secondary mt-2">{slide.subtitle}</p>}
                        <p className="max-w-3xl mt-6 text-lg text-text-main/90 leading-relaxed">{slide.body}</p>
                    </section>
                ))}
            </main>
        </div>
    );
};

export default PitchRitualPanel;