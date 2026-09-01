# Fixora — Native Repair & Tech Marketplace

This is a **native mobile app**, not a web app. The starter uses Expo/React Native so UI is rendered with native iOS/Android primitives, with native navigation and Reanimated-ready motion.

## Product pillars
- Shop phones, accessories and parts
- Request repairs and compare verified repairers
- Verified vendor / repairer onboarding
- Paid tutorial marketplace
- Community feed with posts, comments, replies, likes, reposts and saves
- Profiles and business profiles
- Wallet / payout architecture
- Delivery-provider abstraction for future courier integrations

## Screens included in this first build
Home, Shop, Repair, Community, Learn, Profile.

## Run
npm install
npx expo start

For native builds:
npx expo run:android
npx expo run:ios

Next engineering layer:
Supabase Auth + Postgres + Storage + Realtime, payments/payouts, verification workflow, messaging, orders, tutorial purchases/progress, push notifications, and courier integrations.
