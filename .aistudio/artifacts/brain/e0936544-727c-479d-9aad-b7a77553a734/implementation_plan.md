# Implementation Plan - Typing Champion

A stage-based, fantasy-themed typing game designed for elementary school students to improve their typing skills, featuring progression, daily missions, and a real-time global leaderboard.

## User Review & Critical Decisions

> [!IMPORTANT]
> - **Theme**: Fantasy Quest (Magic/Knight theme)
> - **Audience**: Elementary School Students
> - **Firebase**: Required for real-time leaderboards, user authentication, and daily mission persistence.

- **Confirmed Decision 1**: Fantasy Quest theme with engaging knight/magic motifs.
- **Confirmed Decision 2**: Elementary school-appropriate vocabulary and difficulty ramping.
- **Open Question 1**: How would you like the daily mission rewards to be visualized? (Recommended: Simple badge unlocking system).

## 1. Overview & Core Concept

- **What It Does**: An interactive typing game where students defend a fantasy realm by typing words correctly to cast spells/defeat enemies.
- **Target Audience**: Elementary School Students.
- **Key Value**: Engaging, gamified learning environment that encourages consistent practice through progression and rewards.

## 2. User Experience & Visual Design

- **Key User Flows**:
    1.  **Title Screen**: Atmospheric fantasy background, start CTA.
    2.  **Playing Mode**: Typing UI (word prompt, input field), health/spell meters.
    3.  **Round Summary**: Feedback on typing speed/accuracy.
    4.  **Leaderboard/Missions**: View real-time standings and claim rewards.
- **Visual Identity & Theme**:
    - *Aesthetic*: Playful, magical fantasy (knights, wizards, scrolls, castle ramparts).
    - *Palette*: Deep emerald/mahogany (arena), crisp white/parchment (cards/UI), sharp gold/royal blue accents.
    - *Typography*: Characterful display titles (e.g., `Cinzel` or `Fraunces`) paired with highly readable sans-serif body text (e.g., `Outfit` or `Plus Jakarta Sans`).
    - *Spatial*: Clear card-based layout for UI elements, unobstructed center playfield.
- **Interactive Feedback**: Web Audio synth chimes for successful/failed types, subtle screen shake on heavy impacts, particle bursts for spell-casting effects.

## 3. Key Product Decisions & Trade-Offs

- **Decision 1**: Firebase for Real-time Leaderboards and Persistence.
    - *Chosen*: Firebase Firestore + Auth.
    - *Why*: Ensures real-time updates for competitive rankings and secure storage of user progress/mission status.
- **Decision 2**: Game Loop vs. React.
    - *Chosen*: Isolated `<canvas>` game container.
    - *Why*: Keeps high-frequency typing interactions responsive (60fps) without re-rendering the entire React tree.

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                       App Container                         │
├──────────────────────┬──────────────────────────────────────┤
│  React UI Layer      │    Game Engine (Isolated Canvas)     │
│  (Auth, Leaderboard, │    (Loop, Input, Spell/Combat)       │
│   Daily Missions)    │                                      │
└──────────┬───────────┴──────────────────┬───────────────────┘
           │                              │
           └────────────► Firebase ◄──────┘
```

- **Data Model**:
    - `users/{userId}`: Profile, current progress.
    - `leaderboards/global`: Top 10 rankings.
    - `missions/{missionId}`: Daily mission status.
- **State Mapping**:
    - Input: Keyboard listener in canvas -> updates game state.
    - Firestore: React hooks fetch user stats/leaderboards, updating UI components outside the game engine.
