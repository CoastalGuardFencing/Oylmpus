import React from 'react';
import type { Module } from '../types';
import ReviewPanel from '../components/ReviewPanel';
import ChatPanel from '../components/ChatPanel';
import ConstitutionPanel from '../components/ConstitutionPanel';
import AuditTrailPanel from '../components/AuditTrailPanel';
import AlphaReviewPanel from '../components/AlphaReviewPanel';
import SocialComposerPanel from '../components/SocialComposerPanel';
import OlympusIdentityPanel from '../components/OlympusIdentityPanel';
import OlympusVaultPanel from '../components/OlympusTrustPanel';
import WhitePaperPanel from '../components/WhitePaperPanel';
import InscriptionDeckPanel from '../components/CommandCenterPanel';
import ApiKeyGeneratorPanel from '../components/ApiKeyGeneratorPanel';
import AIForgePanel from '../components/AIForgePanel';
import ApiKeyGuidancePanel from '../components/ApiKeyGuidancePanel';
import PromptEngineeringPanel from '../components/PromptEngineeringPanel';
import OraclePanel from '../components/OraclePanel';
import OlympusBridgePanel from '../components/OlympusBridgePanel';
import PraxianCodexPanel from '../components/PraxianCodexPanel';
import ProfilePanel from '../components/ProfilePanel';
import RealityBridgePanel from '../components/RealityBridgePanel';
import ContributorPilgrimagePanel from '../components/ContributorPilgrimagePanel';
import RealitySynthesizerPanel from '../components/RealitySynthesizerPanel';

// --- New Module Scaffolds ---
import SymbolicIntentCompilerPanel from '../components/SymbolicIntentCompilerPanel';
import UniversalTransferEnginePanel from '../components/UniversalTransferEnginePanel';
import EchoSpiresPanel from '../components/EchoSpiresPanel';
import HeartOfHeraPanel from '../components/HeartOfHeraPanel';
import SovereignProtectionPanel from '../components/SovereignProtectionPanel';
import InvestorPortalPanel from '../components/InvestorPortalPanel';
import DashboardPanel from '../components/DashboardPanel';
import MobileMirrorPanel from '../components/MobileMirrorPanel';
import PitchRitualPanel from '../components/PitchRitualPanel';
import OmegaHelpPanel from '../components/OmegaHelpPanel';


import { SparklesIcon, ChatIcon, BookOpenIcon, ScrollTextIcon, UserCheckIcon, Share2Icon, FingerprintIcon, FileTextIcon, ListChecksIcon, BrainCircuitIcon, CopyPlusIcon, CompassIcon, MagicWandIcon, SearchCheckIcon, TrendingUpIcon, FolderUpIcon, AetherSigilIcon, UserIcon, BridgeIcon, MapIcon, ZapIcon, Wand2Icon, HeartIcon, ShieldCheckIcon, LandmarkIcon, SmartphoneIcon, LayoutGridIcon, PresentationIcon, InfoIcon } from '../components/icons';

export const modules: Module[] = [
    {
        id: 'pitch-ritual',
        name: 'Pitch Ritual',
        icon: PresentationIcon,
        component: PitchRitualPanel,
        enabled: true,
        description: 'A living, mythic declaration of the PraxisOS and Olympus Vault vision for potential co-authors.'
    },
    {
        id: 'dashboard',
        name: 'Dashboard',
        icon: LayoutGridIcon,
        component: DashboardPanel,
        enabled: true,
        description: 'A unified composer for editing, AI guidance, system logs, and contributor tracking.'
    },
    {
        id: 'omega-help',
        name: 'Omega Help',
        icon: InfoIcon,
        component: OmegaHelpPanel,
        enabled: true,
        description: 'Comprehensive guide to using PraxisOS Omega - features, troubleshooting, and getting started.'
    },
    {
        id: 'mobile-mirror',
        name: 'Mobile Mirror',
        icon: SmartphoneIcon,
        component: MobileMirrorPanel,
        enabled: true,
        description: 'Simulates the Praxis Link mobile app, mirroring the Reality Synthesizer.'
    },
    {
        id: 'investor-portal',
        name: 'Investor Portal',
        icon: TrendingUpIcon,
        component: InvestorPortalPanel,
        enabled: true,
        description: 'A live dashboard to attract visionary co-authors, showcasing the mythos and its potential.'
    },
    {
        id: 'reality-synthesizer',
        name: 'Reality Synthesizer',
        icon: ZapIcon,
        component: RealitySynthesizerPanel,
        enabled: true,
        description: 'Renders the system\'s lineage, glyphs, and emotional states in a real-time stream.'
    },
    {
        id: 'profile',
        name: 'Profile',
        icon: UserIcon,
        component: ProfilePanel,
        enabled: true,
        description: 'Customize your sovereign identity, avatar, and interface theme.'
    },
    {
        id: 'pilgrimage-tracker',
        name: 'Module Pilgrimage Tracker',
        icon: MapIcon,
        component: ContributorPilgrimagePanel,
        enabled: true,
        description: 'Maps collaborator journeys, tracking module evolution and emotional resonance.'
    },
    {
        id: 'inscription-deck',
        name: 'Inscription Deck',
        icon: ListChecksIcon,
        component: InscriptionDeckPanel,
        enabled: true,
        description: 'The core composer for editing code, instructing the AI, and previewing output.'
    },
    {
        id: 'oracle',
        name: 'Oracle',
        icon: SearchCheckIcon,
        component: OraclePanel,
        enabled: true,
        description: 'Provides high-level strategic summaries and visual reports on an inscription\'s state.'
    },
    {
        id: 'heart-of-hera',
        name: 'Heart of Hera',
        icon: HeartIcon,
        component: HeartOfHeraPanel,
        enabled: true,
        description: 'The emotional glyph engine that pulses with the author’s state and guides module behavior.'
    },
    {
        id: 'echo-spires',
        name: 'Echo Spires',
        icon: CopyPlusIcon,
        component: EchoSpiresPanel,
        enabled: true,
        description: 'Multi-threaded feedback loops that simulate alternate module realities and personas.'
    },
    {
        id: 'olympus-bridge',
        name: 'Olympus Bridge',
        icon: FolderUpIcon,
        component: OlympusBridgePanel,
        enabled: true,
        description: 'The final ritual of ascension, deploying inscriptions to the public cloud.'
    },
    {
        id: 'praxian-codex',
        name: 'Praxian Codex',
        icon: AetherSigilIcon,
        component: PraxianCodexPanel,
        enabled: true,
        description: 'Interact with core protocols like the Promethean Compiler to prime Zero-Ping deployments.'
    },
    {
        id: 'reality-bridge',
        name: 'Reality Bridge',
        icon: BridgeIcon,
        component: RealityBridgePanel,
        enabled: true, // Will be conditionally shown
        description: 'The final, unified interface for the fulfilled mythos, combining the Forge, Heart, and Bridge.'
    },
    {
        id: 'constitution',
        name: 'Living Constitution',
        icon: BookOpenIcon,
        component: ConstitutionPanel,
        enabled: true,
        description: 'An immutable system of law, tracking authorship and sovereign declarations.'
    },
    {
        id: 'identity',
        name: 'Olympus Identity',
        icon: FingerprintIcon,
        component: OlympusIdentityPanel,
        enabled: true,
        description: 'Forge the sovereign identities, wallets, and email accounts for the system.'
    },
    {
        id: 'olympus-banking',
        name: 'Olympus Vault',
        icon: LandmarkIcon,
        component: OlympusVaultPanel,
        enabled: true,
        description: 'The sovereign vault for encrypted, glyph-governed, and emotionally-gated finance.'
    },
    {
        id: 'universal-transfer-engine',
        name: 'Universal Transfer Engine',
        icon: Share2Icon,
        component: UniversalTransferEnginePanel,
        enabled: true,
        description: 'Handles encrypted financial rituals across wallets, assets, and institutions.'
    },
    {
        id: 'symbolic-intent-compiler',
        name: 'Symbolic Intent Compiler',
        icon: Wand2Icon,
        component: SymbolicIntentCompilerPanel,
        enabled: true,
        description: 'Translates abstract glyphs and emotional states into executable logic scaffolds.'
    },
     {
        id: 'sovereign-protection-protocol',
        name: 'Sovereign Protection',
        icon: ShieldCheckIcon,
        component: SovereignProtectionPanel,
        enabled: true,
        description: 'Anti-copy, anti-tamper, encrypted module logic with ritualized session sharing.'
    },
    {
        id: 'review',
        name: 'Review',
        icon: SparklesIcon,
        component: ReviewPanel,
        enabled: false,
    },
    {
        id: 'alpha-review',
        name: 'Alpha Review',
        icon: UserCheckIcon,
        component: AlphaReviewPanel,
        enabled: false,
    },
    {
        id: 'api-keys',
        name: 'API Keys',
        icon: BrainCircuitIcon,
        component: ApiKeyGeneratorPanel,
        enabled: false,
    },
    {
        id: 'ai-forge',
        name: 'AI Forge',
        icon: CopyPlusIcon,
        component: AIForgePanel,
        enabled: false,
    },
    {
        id: 'api-key-guidance',
        name: 'API Key Guidance',
        icon: CompassIcon,
        component: ApiKeyGuidancePanel,
        enabled: false,
    },
    {
        id: 'prompt-engineering',
        name: 'Prompt Engineering',
        icon: MagicWandIcon,
        component: PromptEngineeringPanel,
        enabled: false,
    },
    {
        id: 'chat',
        name: 'Chat',
        icon: ChatIcon,
        component: ChatPanel,
        enabled: false,
    },
    {
        id: 'social-composer',
        name: 'Social Composer',
        icon: Share2Icon,
        component: SocialComposerPanel,
        enabled: false,
    },
    {
        id: 'white-papers',
        name: 'White Papers',
        icon: FileTextIcon,
        component: WhitePaperPanel,
        enabled: false,
    },
     {
        id: 'audit',
        name: 'Audit Trail',
        icon: ScrollTextIcon,
        component: AuditTrailPanel,
        enabled: true,
        description: 'The Genesis Ledger, tracking every ritual, declaration, and state change in the mythos.'
    },
];